// Selah Kids stories. Retellings are original, written for ages 4 to 9.
// Memory verses are quoted from the World English Bible (public domain).
// Scene items: [kind, x, y, scale, opts]. Ground line at y=0 for each item; viewBox 400x260.
const STORIES = [
{
  id:'creation', title:'God Makes Everything', ref:'Genesis 1 to 2', testament:'old', color:'#FFC94A',
  sticker:{bg:'#BFE3F7', items:[['hills',0,0,1,{c:'#7CC47F'}],['sun',200,95,1.3,{}],['flower',150,205,1.4,{c:'#FF7A6B'}],['flower',250,210,1.2,{c:'#B57BE8'}]]},
  pages:[
    {t:'In the very beginning, there was nothing at all. Then God spoke: “Light!” And light shone out, bright and warm.',
     s:{bg:'dark', items:[['glow',200,130,1.6,{say:'Light! God made light first.'}]]}},
    {t:'God made the big blue sky above and the splashing sea below.',
     s:{bg:'day', items:[['clouds',0,0,1,{}],['sea',0,170,1,{say:'Splish, splash! God made the sea.'}]]}},
    {t:'God made dry land. Up popped grass and trees and flowers of every color.',
     s:{bg:'day', items:[['clouds',0,0,1,{}],['hills',0,0,1,{c:'#7CC47F'}],['tree',90,210,1.2,{say:'A tall tree!'}],['palm',320,205,1.1,{}],['flower',170,228,1,{c:'#FF7A6B',say:'A red flower!'}],['flower',205,232,0.9,{c:'#B57BE8',say:'A purple flower!'}],['flower',240,228,1,{c:'#FFC94A',say:'A yellow flower!'}]]}},
    {t:'God put the sun in the sky for the daytime, and the moon and stars for the night.',
     s:{bg:'dusk', items:[['stars',0,0,1,{}],['sun',95,105,1,{say:'The sun keeps us warm.'}],['moon',300,80,1,{say:'The moon glows at night.'}],['hills',0,0,1,{c:'#5E9C6A'}]]}},
    {t:'God filled the sea with fish and the sky with birds. Then came animals, big and small!',
     s:{bg:'day', items:[['birds',0,0,1,{}],['hills',0,0,1,{c:'#7CC47F',low:1}],['sea',0,200,1,{left:1}],['fish',60,235,1,{c:'#FF9F43',say:'Blub, blub!'}],['fish',120,248,0.8,{c:'#4CC9F0',flip:1,say:'Blub!'}],['elephant',250,215,1,{say:'Elephants are big!'}],['lion',340,222,0.9,{say:'Roar!'}],['sheep',190,226,0.8,{say:'Baa!'}]]}},
    {t:'Last of all, God made people, and God loved them. God looked at everything and said, “It is very good!”',
     s:{bg:'day', items:[['sun',340,60,0.8,{}],['hills',0,0,1,{c:'#7CC47F'}],['tree',60,212,1.1,{}],['tree',350,214,0.9,{}],['person',175,232,1.15,{robe:'#E8C39E',hair:'#3A2A1E',say:'God made people!'}],['person',225,232,1.1,{robe:'#E8C39E',hair:'#2B1B12',long:1,skin:'#B97A50',say:'God loves people!'}],['sheep',290,236,0.7,{say:'Baa!'}],['flower',120,240,0.8,{c:'#FF7A6B'}]]}}
  ],
  verse:{t:'God saw everything that he had made, and, behold, it was very good.', r:'Genesis 1:31'},
  quiz:[
    {q:'What did God make first?', a:['Light','Fish','Trees'], c:0},
    {q:'Who did God make last of all?', a:['People','Lions','Stars'], c:0},
    {q:'What did God say about everything he made?', a:['It is very good!','It is too small.','Try again.'], c:0}
  ],
  talk:['What is your favorite thing God made? Why?','How can we take care of God’s world this week?']
},
{
  id:'noah', title:'Noah’s Big Boat', ref:'Genesis 6 to 9', testament:'old', color:'#FF7A6B',
  sticker:{bg:'#BFE3F7', items:[['rainbow',200,190,1.1,{}],['ark',200,215,0.75,{}]]},
  pages:[
    {t:'Noah loved God, even when the people all around him did not.',
     s:{bg:'day', items:[['clouds',0,0,1,{}],['hills',0,0,1,{c:'#9BCB7A'}],['house',80,215,1,{}],['house',320,212,0.9,{}],['person',200,228,1.2,{robe:'#6B8F71',hair:'#DDD',beard:1,arms:'pray',say:'Noah loved God.'}]]}},
    {t:'God told Noah, “Build a big boat. A really, really big boat!” So Noah got to work. Bang! Bang! Bang!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A',low:1}],['ark',220,220,1,{frame:1,say:'Bang, bang, bang!'}],['person',80,236,1.1,{robe:'#6B8F71',hair:'#DDD',beard:1,arms:'up',hold:'hammer',say:'Noah worked hard.'}]]}},
    {t:'The animals came two by two. Two lions, two sheep, two elephants, and two giraffes!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A',low:1}],['ark',280,205,0.85,{}],['giraffe',40,232,0.8,{say:'Two giraffes!'}],['giraffe',75,236,0.8,{}],['elephant',140,236,0.75,{say:'Two elephants!'}],['lion',195,240,0.6,{say:'Two lions! Roar!'}],['lion',225,244,0.6,{}],['sheep',110,252,0.55,{say:'Two sheep! Baa!'}],['sheep',140,256,0.55,{}]]}},
    {t:'Then the rain came down. Pitter-patter, splish-splash, for forty days and forty nights.',
     s:{bg:'storm', items:[['clouds',0,0,1,{dark:1}],['rain',0,0,1,{}],['sea',0,190,1,{rough:1}],['ark',200,205,0.9,{bob:1,say:'Everyone was safe inside!'}],['lightning',320,40,1,{}]]}},
    {t:'At last the rain stopped. Noah sent out a dove, and it came back with a green leaf in its beak.',
     s:{bg:'day', items:[['sun',340,60,0.9,{}],['sea',0,195,1,{}],['ark',170,210,0.9,{bob:1}],['dove',300,110,1.3,{leaf:1,say:'Coo! A leaf means dry land!'}]]}},
    {t:'Everyone stepped out onto dry land. God put a rainbow in the sky as a promise to Noah and to us.',
     s:{bg:'day', items:[['rainbow',200,230,1.4,{say:'A rainbow! God keeps his promises.'}],['hills',0,0,1,{c:'#9BCB7A'}],['ark',300,200,0.6,{}],['person',140,228,1.1,{robe:'#6B8F71',hair:'#DDD',beard:1,arms:'up',say:'Thank you, God!'}],['elephant',60,236,0.6,{}],['sheep',200,238,0.6,{}],['giraffe',240,234,0.6,{}]]}}
  ],
  verse:{t:'I set my rainbow in the cloud, and it will be a sign of a covenant between me and the earth.', r:'Genesis 9:13'},
  quiz:[
    {q:'What did God ask Noah to build?', a:['A big boat','A tall tower','A little house'], c:0},
    {q:'How did the animals come?', a:['Two by two','One at a time','In a car'], c:0},
    {q:'What did God put in the sky as a promise?', a:['A rainbow','A kite','A balloon'], c:0}
  ],
  talk:['God always keeps his promises. What is a promise you can keep this week?','What animal would you most like to meet on Noah’s boat?']
},
{
  id:'moses', title:'Walking Through the Sea', ref:'Exodus 14', testament:'old', color:'#4CC9F0',
  sticker:{bg:'#FCE9C8', items:[['waterwall',95,240,0.6,{}],['waterwall',305,240,0.6,{right:1}],['person',200,225,1.4,{robe:'#B5651D',hair:'#888',beard:1,arms:'up',staff:1}]]},
  pages:[
    {t:'God’s people had been slaves in Egypt for a long, long time. God sent Moses to lead them out to freedom.',
     s:{bg:'desert', items:[['sun',330,60,0.9,{}],['pyramid',80,190,1,{say:'The pyramids of Egypt.'}],['pyramid',150,190,0.7,{}],['person',220,236,1.2,{robe:'#B5651D',hair:'#888',beard:1,staff:1,say:'Moses! God sent him.'}],['crowd',320,240,1,{}]]}},
    {t:'They walked and walked until they came to a big sea. Oh no! The king’s army was coming up behind them!',
     s:{bg:'desert', items:[['sea',0,175,1,{right:1}],['army',60,200,1,{say:'Here comes the army!'}],['crowd',230,236,1,{}],['person',300,236,1.1,{robe:'#B5651D',hair:'#888',beard:1,staff:1,mood:'wow'}]]}},
    {t:'Moses said, “Don’t be afraid. God will fight for you.” Then Moses held his staff up high over the water.',
     s:{bg:'desert', items:[['sea',0,175,1,{}],['person',200,236,1.3,{robe:'#B5651D',hair:'#888',beard:1,arms:'up',staff:1,say:'Don’t be afraid!'}],['crowd',80,244,0.9,{}],['crowd',320,244,0.9,{}]]}},
    {t:'Whoosh! God sent a strong wind all night long, and the water split into two tall walls.',
     s:{bg:'night', items:[['stars',0,0,1,{}],['waterwall',70,260,1,{say:'Whoosh! A wall of water!'}],['waterwall',330,260,1,{right:1,say:'Look, a fish in the wall!'}],['wind',200,120,1,{}],['ground',200,260,1,{narrow:1}]]}},
    {t:'God’s people walked right through on dry ground, all the way to the other side.',
     s:{bg:'day', items:[['waterwall',70,260,1,{}],['waterwall',330,260,1,{right:1}],['ground',200,260,1,{narrow:1}],['person',180,232,0.8,{robe:'#E27D60',hair:'#3A2A1E',say:'Walking on dry ground!'}],['person',215,242,0.8,{robe:'#85C1A9',long:1,hair:'#2B1B12'}],['person',200,256,0.9,{robe:'#B5651D',hair:'#888',beard:1,staff:1}]]}},
    {t:'On the other side, Miriam grabbed her tambourine, and everyone sang and danced to thank God.',
     s:{bg:'day', items:[['sun',60,60,0.9,{}],['sea',0,150,1,{}],['ground',200,260,1,{}],['person',110,238,1.1,{robe:'#E8A0BF',long:1,hair:'#2B1B12',arms:'up',hold:'tambourine',say:'Miriam sang to God!'}],['person',190,240,1,{robe:'#85C1A9',arms:'up'}],['person',260,240,1,{robe:'#E27D60',long:1,arms:'up',hair:'#3A2A1E'}],['person',330,240,1.1,{robe:'#B5651D',hair:'#888',beard:1,staff:1}]]}}
  ],
  verse:{t:'Yahweh will fight for you, and you shall be still.', r:'Exodus 14:14'},
  quiz:[
    {q:'Who did God send to lead his people?', a:['Moses','Noah','Jonah'], c:0},
    {q:'What did God do to the sea?', a:['Split it in two','Froze it into ice','Made it disappear'], c:0},
    {q:'What did the people do on the other side?', a:['Sang and danced','Went to sleep','Built a boat'], c:0}
  ],
  talk:['When do you feel scared? How can you remember that God is with you?','The verse says God’s name is Yahweh. What do you like to call God when you pray?']
},
{
  id:'david', title:'David and the Giant', ref:'1 Samuel 17', testament:'old', color:'#7CC47F',
  sticker:{bg:'#D7EFCB', items:[['stones',200,190,2.4,{}],['sheep',120,220,1,{}],['sheep',290,225,0.8,{flip:1}]]},
  pages:[
    {t:'David was a shepherd boy. He took care of his sheep and sang songs to God.',
     s:{bg:'day', items:[['clouds',0,0,1,{}],['hills',0,0,1,{c:'#9BCB7A'}],['person',150,226,1,{robe:'#F2B880',hair:'#A0522D',kid:1,staff:1,say:'David loved to sing to God.'}],['sheep',230,230,0.8,{say:'Baa!'}],['sheep',280,222,0.7,{flip:1,say:'Baa baa!'}],['sheep',320,236,0.75,{}],['note',190,150,1,{}]]}},
    {t:'One day David visited his big brothers in the army. A giant named Goliath was shouting, “Who will fight me?” Everyone was scared.',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#C9B27C'}],['person',290,238,2.1,{robe:'#8A8F99',hair:'#3A2A1E',beard:1,helmet:1,mood:'mad',arms:'out',say:'Goliath was nine feet tall!'}],['person',70,236,0.9,{robe:'#6E7B8B',mood:'wow',helmet:1}],['person',120,240,0.9,{robe:'#6E7B8B',mood:'wow',helmet:1}],['person',165,242,0.75,{robe:'#F2B880',hair:'#A0522D',kid:1,say:'David was not afraid.'}]]}},
    {t:'“I will,” said David. “God helped me keep my sheep safe from lions and bears. God will help me now.”',
     s:{bg:'tent', items:[['person',140,236,1.3,{robe:'#7A4E9C',hair:'#3A2A1E',beard:1,crown:1,mood:'wow',say:'King Saul.'}],['person',250,236,1,{robe:'#F2B880',hair:'#A0522D',kid:1,arms:'out',say:'God will help me!'}]]}},
    {t:'David didn’t take armor or a sword. He picked five smooth stones from a stream.',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A'}],['stream',0,0,1,{}],['person',150,226,1.1,{robe:'#F2B880',hair:'#A0522D',kid:1,arms:'down',say:'One, two, three, four, five!'}],['stones',240,230,1.4,{say:'Five smooth stones.'}]]}},
    {t:'David swung his sling, round and round. Whizz! The stone hit Goliath, and down he fell. Thud!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#C9B27C'}],['person',90,236,1,{robe:'#F2B880',hair:'#A0522D',kid:1,arms:'up',hold:'sling',say:'Whizz!'}],['person',300,232,2,{robe:'#8A8F99',hair:'#3A2A1E',beard:1,helmet:1,mood:'wow',rot:-70,say:'Thud!'}]]}},
    {t:'Everyone cheered! David knew it was God who helped him win.',
     s:{bg:'day', items:[['sun',330,60,0.9,{}],['hills',0,0,1,{c:'#9BCB7A'}],['person',200,232,1.2,{robe:'#F2B880',hair:'#A0522D',kid:1,arms:'up',say:'Hooray! Thank you, God!'}],['person',100,240,0.9,{robe:'#6E7B8B',helmet:1,arms:'up'}],['person',300,240,0.9,{robe:'#6E7B8B',helmet:1,arms:'up'}]]}}
  ],
  verse:{t:'Yahweh is my shepherd: I shall lack nothing.', r:'Psalm 23:1'},
  quiz:[
    {q:'What was David’s job?', a:['Shepherd','King','Fisherman'], c:0},
    {q:'How many stones did David pick?', a:['Five','One','Ten'], c:0},
    {q:'Who helped David?', a:['God','The giant','His sheep'], c:0}
  ],
  talk:['What feels like a giant to you right now? Let’s pray about it together.','David wrote songs to God. Could we make up a song to God today?']
},
{
  id:'daniel', title:'Daniel and the Lions', ref:'Daniel 6', testament:'old', color:'#E8A94B',
  sticker:{bg:'#FCE9C8', items:[['lion',200,215,2,{sleep:1}]]},
  pages:[
    {t:'Daniel loved God. Three times every day, he prayed to God by his open window.',
     s:{bg:'day', items:[['house',200,240,2,{win:1}],['person',200,206,1,{robe:'#3E6FB0',hair:'#3A2A1E',beard:1,arms:'pray',say:'Daniel prayed every day.'}]]}},
    {t:'Some jealous men tricked the king into making a rule: “Nobody may pray to anyone except the king!”',
     s:{bg:'palace', items:[['person',200,236,1.3,{robe:'#7A4E9C',hair:'#3A2A1E',beard:1,crown:1,say:'King Darius.'}],['person',90,240,1,{robe:'#5C5C5C',beard:1,mood:'mad',say:'Hmph!'}],['person',310,240,1,{robe:'#5C5C5C',beard:1,mood:'mad'}]]}},
    {t:'But Daniel kept praying to God anyway, just like always.',
     s:{bg:'dusk', items:[['house',200,240,2,{win:1}],['person',200,206,1,{robe:'#3E6FB0',hair:'#3A2A1E',beard:1,arms:'pray',say:'Daniel kept praying.'}]]}},
    {t:'So Daniel was thrown into a den full of hungry lions. Gulp!',
     s:{bg:'den', items:[['lion',90,236,1.2,{say:'Grrr!'}],['lion',320,240,1.1,{flip:1,say:'Roar!'}],['person',205,236,1.1,{robe:'#3E6FB0',hair:'#3A2A1E',beard:1,arms:'pray',say:'God, please help me.'}]]}},
    {t:'But God sent an angel to shut the lions’ mouths. Daniel spent the whole night safe and sound.',
     s:{bg:'den', items:[['person',200,226,1.2,{angel:1,arms:'out',say:'God sent an angel!'}],['lion',85,240,1.1,{sleep:1,say:'Zzz. This lion is sleepy.'}],['lion',320,244,1,{sleep:1,flip:1,say:'Zzz.'}],['person',260,246,0.85,{robe:'#3E6FB0',hair:'#3A2A1E',beard:1,sleep:1}]]}},
    {t:'In the morning, the king ran to the den. “Daniel, are you okay?” “Yes! My God kept me safe!”',
     s:{bg:'dawn', items:[['sun',200,150,1,{}],['hills',0,0,1,{c:'#C9B27C'}],['person',150,236,1.2,{robe:'#7A4E9C',hair:'#3A2A1E',beard:1,crown:1,mood:'wow',say:'Daniel, are you okay?'}],['person',250,236,1.2,{robe:'#3E6FB0',hair:'#3A2A1E',beard:1,arms:'up',say:'God kept me safe!'}]]}}
  ],
  verse:{t:'My God has sent his angel, and has shut the lions’ mouths, and they have not hurt me.', r:'Daniel 6:22 (part)'},
  quiz:[
    {q:'How many times a day did Daniel pray?', a:['Three times','Once a year','Never'], c:0},
    {q:'Who shut the lions’ mouths?', a:['An angel sent by God','The king','A zookeeper'], c:0},
    {q:'How was Daniel in the morning?', a:['Safe and sound','Very hurt','Gone'], c:0}
  ],
  talk:['Daniel talked to God every day. When could we pray together each day?','Is it hard to do the right thing when others don’t? Why?']
},
{
  id:'jonah', title:'Jonah and the Big Fish', ref:'Jonah 1 to 3', testament:'old', color:'#5E7FA8',
  sticker:{bg:'#BFE3F7', items:[['bigfish',200,180,0.9,{}]]},
  pages:[
    {t:'God told Jonah, “Go to the city of Nineveh and tell them to stop doing wrong.” But Jonah ran the other way!',
     s:{bg:'day', items:[['city',300,200,1,{say:'The big city of Nineveh.'}],['hills',0,0,1,{c:'#C9B27C',low:1}],['person',110,236,1.1,{robe:'#4C9A8A',hair:'#3A2A1E',beard:1,run:1,mood:'wow',say:'Jonah ran away!'}]]}},
    {t:'Jonah hopped onto a boat. Soon a huge storm rocked the boat up and down, side to side.',
     s:{bg:'storm', items:[['clouds',0,0,1,{dark:1}],['rain',0,0,1,{}],['sea',0,180,1,{rough:1}],['boat',200,195,1.3,{rock:1,sail:1,say:'Whoa! Up and down!'}],['lightning',80,40,1,{}]]}},
    {t:'“It’s my fault,” said Jonah. “Throw me into the sea.” Splash! And the storm stopped.',
     s:{bg:'day', items:[['sea',0,180,1,{}],['boat',260,190,1.1,{sail:1}],['splash',130,195,1,{say:'Splash!'}]]}},
    {t:'Gulp! God sent a big fish to swallow Jonah. For three days, Jonah sat inside the fish and prayed.',
     s:{bg:'under', items:[['bubbles',0,0,1,{}],['bigfish',200,140,1,{jonah:1,say:'Jonah prayed inside the fish.'}],['fish',60,230,0.8,{c:'#FF9F43',say:'Blub!'}],['fish',350,60,0.7,{c:'#FFC94A',flip:1}]]}},
    {t:'Then the fish spat Jonah out onto the beach. Bleh!',
     s:{bg:'day', items:[['sun',340,55,0.8,{}],['sea',0,165,1,{left:1}],['beach',0,0,1,{}],['bigfish',95,190,0.6,{say:'Bleh!'}],['person',280,236,1.1,{robe:'#4C9A8A',hair:'#3A2A1E',beard:1,mood:'wow',say:'I’m out!'}]]}},
    {t:'This time Jonah obeyed. The people of Nineveh said sorry to God, and God forgave them.',
     s:{bg:'day', items:[['city',200,190,1.3,{}],['person',100,240,1,{robe:'#4C9A8A',hair:'#3A2A1E',beard:1,arms:'out',say:'God loves you!'}],['person',230,240,0.9,{robe:'#D9A441',arms:'up',say:'We’re sorry, God.'}],['person',290,240,0.9,{robe:'#C46D5E',long:1,arms:'up',hair:'#2B1B12'}],['person',340,240,0.7,{robe:'#7DAF6B',kid:1,arms:'up'}]]}}
  ],
  verse:{t:'Salvation belongs to Yahweh.', r:'Jonah 2:9 (part)'},
  quiz:[
    {q:'Where did God tell Jonah to go?', a:['Nineveh','The zoo','Egypt'], c:0},
    {q:'What swallowed Jonah?', a:['A big fish','A lion','A dragon'], c:0},
    {q:'What did God do when the people said sorry?', a:['Forgave them','Got angry','Sent a storm'], c:0}
  ],
  talk:['Is it hard to say sorry? God loves to forgive us.','Jonah got a second chance. Who could you give a second chance to?']
},
{
  id:'birth', title:'Baby Jesus Is Born', ref:'Luke 2', testament:'new', color:'#B57BE8',
  sticker:{bg:'#2E3A6E', items:[['star',200,95,1.6,{}],['manger',200,215,1.3,{baby:1}]]},
  pages:[
    {t:'Mary and Joseph traveled a long way to the little town of Bethlehem.',
     s:{bg:'dusk', items:[['stars',0,0,1,{}],['hills',0,0,1,{c:'#7E9A6A'}],['city',320,195,0.6,{}],['person',130,232,1.1,{robe:'#5B8DEF',scarf:'#EAF2FF',long:1,hair:'#2B1B12',say:'Mary.'}],['person',185,232,1.15,{robe:'#A0764E',hair:'#3A2A1E',beard:1,staff:1,say:'Joseph.'}]]}},
    {t:'Every room in town was full. The only place left was a stable, where the animals slept.',
     s:{bg:'night', items:[['stars',0,0,1,{}],['ground',200,260,1,{}],['stable',200,240,1.3,{say:'A cozy stable.'}],['sheep',80,244,0.7,{say:'Baa!'}],['donkey',330,244,0.9,{say:'Hee-haw!'}]]}},
    {t:'That night, baby Jesus was born! Mary wrapped him up warm and laid him in a manger.',
     s:{bg:'night', items:[['star',200,40,0.9,{say:'A bright star!'}],['ground',200,260,1,{}],['stable',200,250,1.5,{}],['manger',200,236,1.1,{baby:1,say:'Baby Jesus!'}],['person',140,238,1,{robe:'#5B8DEF',scarf:'#EAF2FF',long:1,hair:'#2B1B12',arms:'pray'}],['person',262,238,1.05,{robe:'#A0764E',hair:'#3A2A1E',beard:1,staff:1}]]}},
    {t:'Out in the fields, shepherds were watching their sheep. Suddenly an angel appeared, shining bright!',
     s:{bg:'night', items:[['stars',0,0,1,{}],['hills',0,0,1,{c:'#3F5E4A'}],['person',260,120,1.2,{angel:1,arms:'up',say:'Good news!'}],['person',80,236,1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,mood:'wow',say:'Wow!'}],['person',140,238,0.85,{robe:'#8A6E4B',kid:1,mood:'wow'}],['sheep',200,244,0.7,{say:'Baa!'}],['sheep',330,242,0.7,{flip:1}]]}},
    {t:'“Good news!” said the angel. “A Savior is born for you today!” Then the whole sky filled with angels singing.',
     s:{bg:'night', items:[['stars',0,0,1,{}],['hills',0,0,1,{c:'#3F5E4A'}],['person',200,110,1.1,{angel:1,arms:'up',say:'Glory to God!'}],['person',90,90,0.7,{angel:1,arms:'up'}],['person',310,90,0.7,{angel:1,arms:'up'}],['person',40,150,0.5,{angel:1,arms:'up'}],['person',360,150,0.5,{angel:1,arms:'up'}],['note',140,60,1,{}],['note',270,50,1,{}]]}},
    {t:'The shepherds hurried to Bethlehem and found baby Jesus, just like the angel said. Then they told everyone!',
     s:{bg:'night', items:[['star',200,40,0.9,{}],['ground',200,260,1,{}],['stable',200,250,1.5,{}],['manger',200,236,1.1,{baby:1,say:'Baby Jesus, the Savior!'}],['person',140,238,1,{robe:'#5B8DEF',scarf:'#EAF2FF',long:1,hair:'#2B1B12'}],['person',60,242,1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,say:'We found him!'}],['person',275,240,0.85,{robe:'#8A6E4B',kid:1,arms:'up'}],['sheep',340,248,0.6,{}]]}}
  ],
  verse:{t:'For there is born to you today, in David’s city, a Savior, who is Christ the Lord.', r:'Luke 2:11'},
  quiz:[
    {q:'Where was Jesus born?', a:['Bethlehem','Egypt','Nineveh'], c:0},
    {q:'Where did Mary lay baby Jesus?', a:['In a manger','In a boat','In a castle'], c:0},
    {q:'Who told the shepherds the good news?', a:['An angel','A king','A fish'], c:0}
  ],
  talk:['Jesus is God’s best gift to us. Who could we share this good news with?','The shepherds hurried! What would you have said to baby Jesus?']
},
{
  id:'storm', title:'Jesus Calms the Storm', ref:'Mark 4', testament:'new', color:'#3E6FB0',
  sticker:{bg:'#BFE3F7', items:[['sea',0,175,1,{}],['boat',200,185,1.8,{sail:1}]]},
  pages:[
    {t:'One evening, Jesus and his friends got into a boat to cross the lake.',
     s:{bg:'dusk', items:[['sun',300,150,1,{}],['sea',0,180,1,{}],['boat',190,190,1.4,{sail:1,crew:2,say:'Off we go across the lake!'}]]}},
    {t:'Jesus was tired, so he lay down in the back of the boat and fell fast asleep. Zzz.',
     s:{bg:'night', items:[['stars',0,0,1,{}],['moon',320,60,0.8,{}],['sea',0,180,1,{}],['boat',200,190,1.5,{sail:1,sleeper:1,say:'Shh! Jesus is sleeping.'}],['zzz',250,120,1,{}]]}},
    {t:'Suddenly the wind blew hard. Huge waves crashed over the boat! His friends were so scared.',
     s:{bg:'storm', items:[['clouds',0,0,1,{dark:1}],['rain',0,0,1,{}],['sea',0,175,1,{rough:1}],['boat',200,190,1.5,{rock:1,sail:1,crew:2,scared:1,say:'Help! The waves are so big!'}],['lightning',70,40,1,{}]]}},
    {t:'“Jesus, wake up! Don’t you care? We’re sinking!”',
     s:{bg:'storm', items:[['clouds',0,0,1,{dark:1}],['rain',0,0,1,{}],['sea',0,175,1,{rough:1}],['boat',200,190,1.5,{rock:1,sail:1,crew:2,scared:1,sleeper:1,say:'Wake up, Jesus!'}],['lightning',330,40,1,{}]]}},
    {t:'Jesus stood up and said to the wind and the waves, “Peace! Be still!” And everything went calm.',
     s:{bg:'night', items:[['stars',0,0,1,{}],['sea',0,185,1,{}],['boat',200,195,1.5,{sail:1}],['person',200,170,1.1,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'out',say:'Peace! Be still!'}]]}},
    {t:'His friends whispered, “Who is this? Even the wind and the waves obey him!”',
     s:{bg:'night', items:[['stars',0,0,1,{}],['moon',80,60,0.8,{}],['sea',0,185,1,{}],['boat',200,195,1.5,{sail:1,crew:2,wow:1,say:'Who is this?'}],['person',240,170,1,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1}]]}}
  ],
  verse:{t:'He awoke, and rebuked the wind, and said to the sea, “Peace! Be still!” The wind ceased, and there was a great calm.', r:'Mark 4:39'},
  quiz:[
    {q:'What was Jesus doing when the storm came?', a:['Sleeping','Fishing','Swimming'], c:0},
    {q:'What did Jesus say to the storm?', a:['Peace! Be still!','Go away, rain!','Blow harder!'], c:0},
    {q:'What did the wind and waves do?', a:['They obeyed Jesus','They got bigger','They laughed'], c:0}
  ],
  talk:['What feels stormy or scary in your life? Jesus is bigger than all of it.','Let’s say it together when we feel scared: “Peace! Be still!”']
},
{
  id:'sheep', title:'The Lost Sheep', ref:'Luke 15', testament:'new', color:'#9BCB7A',
  sticker:{bg:'#D7EFCB', items:[['person',200,230,1.5,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,carry:1}]]},
  pages:[
    {t:'Jesus told a story about a shepherd who had one hundred sheep. He knew every single one by name.',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A'}],['flock',0,0,1,{n:9}],['person',70,236,1.1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,say:'The good shepherd.'}]]}},
    {t:'One day he counted: ninety-seven, ninety-eight, ninety-nine... Oh no! One little sheep was missing!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A'}],['flock',0,0,1,{n:8}],['person',70,236,1.1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,mood:'wow',say:'Where is my little sheep?'}],['question',300,120,1,{}]]}},
    {t:'The shepherd left the ninety-nine safe together and went looking. Over hills, through bushes, up rocky places.',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#8DB86E'}],['rocks',300,220,1.2,{}],['bush',90,232,1,{}],['person',200,226,1.1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,run:1,say:'I’m coming, little sheep!'}]]}},
    {t:'Then he heard a tiny “Baa!” There it was, stuck in a thorny bush!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#8DB86E'}],['bush',240,238,1.8,{thorn:1}],['sheep',240,214,0.7,{say:'Baa! Help!'}],['person',100,236,1.1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,staff:1,arms:'out',say:'There you are!'}]]}},
    {t:'He lifted the little sheep onto his shoulders and carried it all the way home.',
     s:{bg:'dusk', items:[['sun',320,170,1,{}],['hills',0,0,1,{c:'#7E9A6A'}],['person',190,230,1.25,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,carry:1,say:'Safe at last!'}]]}},
    {t:'“Come and celebrate with me! I found my lost sheep!” Jesus said God loves each one of us just like that.',
     s:{bg:'day', items:[['house',90,215,1,{}],['hills',0,0,1,{c:'#9BCB7A',low:1}],['person',190,232,1.1,{robe:'#A88B5E',hair:'#3A2A1E',beard:1,arms:'up',say:'I found my sheep!'}],['person',260,236,0.95,{robe:'#E27D60',long:1,hair:'#2B1B12',arms:'up'}],['person',320,236,0.95,{robe:'#5B8DEF',arms:'up'}],['sheep',130,240,0.7,{say:'Baa! I’m home!'}]]}}
  ],
  verse:{t:'Rejoice with me, for I have found my sheep which was lost!', r:'Luke 15:6 (part)'},
  quiz:[
    {q:'How many sheep did the shepherd have?', a:['One hundred','Ten','Two'], c:0},
    {q:'Where was the lost sheep?', a:['Stuck in a bush','On a boat','In the house'], c:0},
    {q:'Who loves us like the shepherd loves his sheep?', a:['God','The bush','The wolf'], c:0}
  ],
  talk:['God knows your name and never stops looking for you. How does that feel?','Have you ever been lost? What was it like to be found?']
},
{
  id:'zacchaeus', title:'Zacchaeus Climbs a Tree', ref:'Luke 19', testament:'new', color:'#5E9C6A',
  sticker:{bg:'#BFE3F7', items:[['tree',200,240,2.1,{big:1}],['person',225,140,0.8,{robe:'#D9A441',hair:'#3A2A1E',beard:1,short:1}]]},
  pages:[
    {t:'Zacchaeus collected taxes. He took too much money from people, so nobody liked him very much.',
     s:{bg:'day', items:[['house',300,215,1.2,{}],['person',160,236,0.85,{robe:'#D9A441',hair:'#3A2A1E',beard:1,hold:'coins',say:'Zacchaeus had lots of coins.'}],['person',70,236,1,{robe:'#85C1A9',mood:'mad',say:'Hmph!'}],['person',240,236,1,{robe:'#E27D60',long:1,hair:'#2B1B12',mood:'mad'}]]}},
    {t:'One day, Jesus came to town. Everyone crowded around, and Zacchaeus was too short to see!',
     s:{bg:'day', items:[['crowd',200,240,1.4,{}],['person',330,240,0.8,{robe:'#D9A441',hair:'#3A2A1E',beard:1,arms:'up',say:'I can’t see!'}]]}},
    {t:'So he ran ahead and climbed up a sycamore tree. Now he could see!',
     s:{bg:'day', items:[['tree',220,245,2.2,{big:1,say:'A big sycamore tree.'}],['person',248,120,0.75,{robe:'#D9A441',hair:'#3A2A1E',beard:1,arms:'out',say:'Now I can see!'}],['crowd',80,248,0.9,{}]]}},
    {t:'Jesus stopped right under the tree. “Zacchaeus, come down! I’m coming to your house today.”',
     s:{bg:'day', items:[['tree',220,245,2.2,{big:1}],['person',248,120,0.75,{robe:'#D9A441',hair:'#3A2A1E',beard:1,mood:'wow',say:'Me?'}],['person',120,240,1.2,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'up',say:'Zacchaeus, come down!'}]]}},
    {t:'Zacchaeus was so happy that he changed his ways. “I’ll give back everything I took, and even more!”',
     s:{bg:'day', items:[['house',90,215,1.2,{}],['person',200,236,0.85,{robe:'#D9A441',hair:'#3A2A1E',beard:1,arms:'out',hold:'coins',say:'Here is your money back!'}],['person',290,236,1,{robe:'#85C1A9',arms:'up',say:'Thank you!'}],['coins',250,190,1,{}]]}},
    {t:'Jesus smiled. “That’s why I came: to find and save people who are lost.”',
     s:{bg:'dusk', items:[['sun',330,150,1,{}],['house',90,215,1.2,{}],['person',190,236,1.2,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'out',say:'I came to find the lost.'}],['person',260,236,0.85,{robe:'#D9A441',hair:'#3A2A1E',beard:1}]]}}
  ],
  verse:{t:'For the Son of Man came to seek and to save that which was lost.', r:'Luke 19:10'},
  quiz:[
    {q:'Why did Zacchaeus climb a tree?', a:['He was too short to see','To pick fruit','To hide from a lion'], c:0},
    {q:'Where did Jesus want to go?', a:['Zacchaeus’s house','The beach','The top of the tree'], c:0},
    {q:'What did Zacchaeus do after meeting Jesus?', a:['Gave money back','Ran away','Took more money'], c:0}
  ],
  talk:['Meeting Jesus changed Zacchaeus. How can we be fair and kind today?','Jesus chose the person nobody liked. Who might feel left out at school or church?']
},
{
  id:'lunch', title:'A Lunch for Thousands', ref:'John 6', testament:'new', color:'#E8A94B',
  sticker:{bg:'#FCE9C8', items:[['basket',200,205,2.2,{}]]},
  pages:[
    {t:'A huge crowd followed Jesus up a hill to hear him teach. Thousands and thousands of people!',
     s:{bg:'day', items:[['hills',0,0,1,{c:'#9BCB7A'}],['crowd',110,230,1,{}],['crowd',290,232,1,{}],['person',200,200,1.1,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'out',say:'Jesus taught the people.'}]]}},
    {t:'By evening, everyone was hungry. “Where can we get enough food?” asked Jesus’s friend Philip.',
     s:{bg:'dusk', items:[['sun',330,160,1,{}],['hills',0,0,1,{c:'#7E9A6A'}],['person',150,236,1.15,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1}],['person',240,236,1.1,{robe:'#6E8BB0',hair:'#5A3A22',beard:1,mood:'wow',say:'So many hungry people!'}]]}},
    {t:'A boy came with his lunch: five little loaves of bread and two small fish. “It’s not very much,” said Andrew.',
     s:{bg:'dusk', items:[['hills',0,0,1,{c:'#7E9A6A'}],['person',150,238,0.8,{robe:'#E27D60',hair:'#3A2A1E',kid:1,arms:'out',hold:'basket',say:'You can have my lunch!'}],['person',260,236,1.1,{robe:'#8DA05E',hair:'#3A2A1E',beard:1,mood:'wow',say:'It’s not very much.'}]]}},
    {t:'Jesus took the lunch, thanked God for it, and began to share it out.',
     s:{bg:'dusk', items:[['hills',0,0,1,{c:'#7E9A6A'}],['person',200,232,1.25,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'up',hold:'bread',say:'Thank you, God, for this food.'}],['person',100,240,0.75,{robe:'#E27D60',hair:'#3A2A1E',kid:1}],['basket',300,236,1.2,{}]]}},
    {t:'Everyone ate until they were full! Then they gathered up twelve baskets of leftovers.',
     s:{bg:'dusk', items:[['hills',0,0,1,{c:'#7E9A6A'}],['basket',60,236,1,{say:'One!'}],['basket',115,240,1,{say:'Two!'}],['basket',170,236,1,{say:'Three!'}],['basket',225,240,1,{say:'Four!'}],['basket',280,236,1,{say:'Five!'}],['basket',335,240,1,{say:'Six! And six more!'}],['crowd',200,200,0.8,{}]]}}
  ],
  verse:{t:'Jesus said to them, “I am the bread of life.”', r:'John 6:35 (part)'},
  quiz:[
    {q:'What was in the boy’s lunch?', a:['Five loaves and two fish','Pizza','Apples'], c:0},
    {q:'What did Jesus do before sharing the food?', a:['Thanked God','Went to sleep','Asked for more'], c:0},
    {q:'How many baskets were left over?', a:['Twelve','None','One'], c:0}
  ],
  talk:['The boy shared what he had. What could you share this week?','Let’s thank God before our next meal, like Jesus did.']
},
{
  id:'easter', title:'Jesus Is Alive!', ref:'Matthew 28', testament:'new', color:'#FF9F43',
  sticker:{bg:'#FFE1C4', items:[['sun',250,120,1.2,{}],['tomb',180,215,1,{open:1}]]},
  pages:[
    {t:'Jesus died on a cross, and his friends were very sad. They laid his body in a tomb, with a big stone in front.',
     s:{bg:'dusk', items:[['hills',0,0,1,{c:'#7E9A6A'}],['tomb',260,226,1.3,{}],['person',90,236,1,{robe:'#5B8DEF',scarf:'#EAF2FF',long:1,hair:'#2B1B12',mood:'sad',say:'His friends were sad.'}],['person',145,236,1,{robe:'#8DA05E',hair:'#3A2A1E',beard:1,mood:'sad'}]]}},
    {t:'Early on Sunday morning, some women came to the tomb. The sun was just coming up.',
     s:{bg:'dawn', items:[['sun',340,170,1,{}],['hills',0,0,1,{c:'#7E9A6A'}],['tomb',260,226,1.3,{}],['person',80,236,1,{robe:'#B57BE8',scarf:'#F3E8FF',long:1,hair:'#2B1B12',say:'It’s Sunday morning.'}],['person',130,238,1,{robe:'#E8A0BF',scarf:'#FFF0F5',long:1,hair:'#3A2A1E'}]]}},
    {t:'The big stone was rolled away! An angel was sitting on it, shining like lightning.',
     s:{bg:'dawn', items:[['sun',340,150,1,{}],['hills',0,0,1,{c:'#7E9A6A'}],['tomb',230,226,1.3,{open:1,say:'The tomb is empty!'}],['person',335,200,1,{angel:1,arms:'out',say:'Don’t be afraid!'}]]}},
    {t:'“Don’t be afraid,” said the angel. “Jesus is not here. He is alive, just like he said!”',
     s:{bg:'morning', items:[['hills',0,0,1,{c:'#8DB86E'}],['tomb',260,226,1.3,{open:1}],['person',150,214,1,{angel:1,arms:'up',say:'He is alive!'}],['person',60,236,0.95,{robe:'#B57BE8',scarf:'#F3E8FF',long:1,hair:'#2B1B12',mood:'wow'}],['person',100,240,0.95,{robe:'#E8A0BF',scarf:'#FFF0F5',long:1,hair:'#3A2A1E',mood:'wow'}]]}},
    {t:'The women ran to tell the others. And on the way, they met Jesus himself! “Hello!” he said.',
     s:{bg:'morning', items:[['sun',330,60,0.9,{}],['hills',0,0,1,{c:'#8DB86E'}],['flower',60,240,0.9,{c:'#FF7A6B'}],['flower',340,236,0.9,{c:'#FFC94A'}],['person',250,232,1.2,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'out',glow:1,say:'Hello!'}],['person',140,236,1,{robe:'#B57BE8',scarf:'#F3E8FF',long:1,hair:'#2B1B12',arms:'up',say:'Jesus!'}],['person',185,240,1,{robe:'#E8A0BF',scarf:'#FFF0F5',long:1,hair:'#3A2A1E',arms:'up'}]]}},
    {t:'Jesus is alive! He is with us forever, and that is the best news ever!',
     s:{bg:'morning', items:[['sun',200,110,1.6,{say:'Jesus is alive!'}],['hills',0,0,1,{c:'#8DB86E'}],['person',200,232,1.25,{robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,arms:'out',glow:1}],['person',100,238,0.95,{robe:'#B57BE8',scarf:'#F3E8FF',long:1,hair:'#2B1B12',arms:'up'}],['person',300,238,0.95,{robe:'#8DA05E',hair:'#3A2A1E',beard:1,arms:'up'}],['person',50,244,0.7,{robe:'#E27D60',kid:1,arms:'up'}],['person',350,244,0.7,{robe:'#5B8DEF',kid:1,long:1,hair:'#2B1B12',arms:'up'}]]}}
  ],
  verse:{t:'He is not here, for he has risen, just like he said.', r:'Matthew 28:6 (part)'},
  quiz:[
    {q:'What was in front of the tomb?', a:['A big stone','A door','A tree'], c:0},
    {q:'Who was sitting on the stone?', a:['An angel','A lion','A soldier'], c:0},
    {q:'What is the best news ever?', a:['Jesus is alive!','It’s sunny.','Lunch is ready.'], c:0}
  ],
  talk:['Easter means Jesus is alive. How can we celebrate that today?','The women ran to tell others. Who would you tell?']
}
];
