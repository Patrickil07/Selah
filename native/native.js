// Bridge between the Selah web app and native iOS/Android features (Capacitor).
// The app checks window.SelahNative; in a browser this file does nothing.
(function(){
  const C=window.Capacitor;
  if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  const {LocalNotifications,Haptics,Share,SplashScreen}=C.Plugins;
  const REMINDER_ID=1000;

  // One repeating local notification at the plan's reminder time: every day, or weekly on the reading day
  async function scheduleReminders(plan){
    if(!plan||!LocalNotifications)return;
    try{
      let perm=await LocalNotifications.checkPermissions();
      if(perm.display!=='granted')perm=await LocalNotifications.requestPermissions();
      if(perm.display!=='granted')return;
      const pending=await LocalNotifications.getPending();
      if(pending.notifications.length)await LocalNotifications.cancel({notifications:pending.notifications.map(n=>({id:n.id}))});
      const [hour,minute]=(plan.time||'07:30').split(':').map(Number);
      const daily=plan.cad==='daily';
      await LocalNotifications.schedule({notifications:[{
        id:REMINDER_ID,
        title:daily?"Today's reading is ready":"This week's reading is ready",
        body:'A few minutes in the Word. Tap to open Selah.',
        schedule:{on:daily?{hour,minute}:{weekday:(plan.day||0)+1,hour,minute},allowWhileIdle:true}
      }]});
    }catch(e){console.warn('Selah reminders',e);}
  }

  window.SelahNative={
    haptic(){Haptics&&Haptics.impact({style:'LIGHT'}).catch(()=>{});},
    scheduleReminders,
    share(text){Share&&Share.share({text,dialogTitle:'Share verse'}).catch(()=>{});}
  };
  addEventListener('load',()=>{SplashScreen&&SplashScreen.hide().catch(()=>{});});
})();
