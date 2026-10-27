/* Elaria Arc II gameplay — integrates with legacy single-page engine. */
(function(){
'use strict';
const A=window.ARC2;if(!A)return;
Object.entries(A.materials).forEach(([id,name])=>items[id]={name,type:'item'});
Object.assign(items,A.gear,A.potions);
const NEW_ZONES=Object.keys(A.places);
const ARC_MOBS={tidehaven:[],sunshore:['crab','gull','siren'],saltcave:['coralgolem','siren','eelhunter'],abyssalheart:['eelhunter','coralgolem','siren']};
NEW_ZONES.filter(z=>z!=='tidehaven').forEach(z=>{if(!MOB_ZONES.includes(z))MOB_ZONES.push(z)});
const oldMobType=mobType;
mobType=function(zone){const pool=ARC_MOBS[zone];return pool?.length?pool[Math.floor(Math.random()*pool.length)]:oldMobType(zone)};
Object.entries(A.places).forEach(([id,p])=>WORLD_PLACES[id]={name:p.name,x:p.entry[0],y:p.entry[1]});
function ready(){return !!state?.flags?.cryptArcDone}
function arc(){if(!state)return null;state.arc2||={chapter:0,choices:{},recruited:{},side:{},bosses:{},visited:{},journal:[]};return state.arc2}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function scene(title,body,buttons){modal('<div class="arc2-story"><div class="arc2-ornament">✦ THE TIDEBOUND SAGA ✦</div><h2>'+title+'</h2>'+body+(buttons||'<button onclick="closeModal()">Continue</button>')+'</div>')}
function chapter(n){
const a=arc();if(!a||a.chapter>=n||n>8)return;
a.chapter=n;const c=A.chapters[n-1];
a.journal.push({chapter:n,title:c.title,scene:c.scene});
note('Arc II: Chapter '+n+' — '+c.title);
scene('Chapter '+c.title,'<p>'+c.scene+'</p><p class="arc2-voice">“'+c.voice.replace(/[“”]/g,'')+'”</p><p><b>Objective:</b> '+c.objective+'</p>');
autoSave();
}
function go(zone,x,y){
if(!A.places[zone]&&!WORLD_PLACES[zone])return;
const previousZone=state.zone;
state.zone=zone;state.x=x;state.y=y;
if(zone==='sunshore'||zone==='saltcave'||zone==='abyssalheart'){if(previousZone!==zone)arc().bosses[zone+'Visit']=false;ensureMobs(zone)}
trackVisit();note('Arrived at '+(A.places[zone]?.name||WORLD_PLACES[zone].name));render();autoSave();
}
const oldMove=move;
move=function(dx,dy){
if(!state||battle)return;
const z=state.zone,nx=state.x+dx,ny=state.y+dy;
if(z==='forest'&&nx===19&&ny===10){if(!ready()){note('The coastal trail is closed until the Moonfall crypt is resolved.');return}if(!arc().chapter)chapter(1);go('tidehaven',1,6);return}
if(z==='tidehaven'){
if(nx===0&&ny===6){go('forest',18,10);return}
if(nx===19&&ny===6){go('sunshore',1,6);return}
}
if(z==='sunshore'){
if(nx===0&&ny===6){go('tidehaven',18,6);return}
if(nx===19&&ny===6){go('saltcave',1,6);if(arc().chapter===4)chapter(5);return}
}
if(z==='saltcave'){
if(nx===0&&ny===6){go('sunshore',18,6);return}
if(nx===19&&ny===6){if(arc().chapter<7||!arc().bosses.heraldDefeated){note('The drowned gate is sealed. Defeat the Abyssal Herald and uncover the Compact first.');return}go('abyssalheart',1,6);if(arc().chapter===7)chapter(8);return}
}
if(z==='abyssalheart'&&nx===0&&ny===6){go('saltcave',18,6);return}
if(NEW_ZONES.includes(z)){
if(nx<1||nx>18||ny<1||ny>11)return;
state.x=nx;state.y=ny;
checkBossContact();
if(!battle&&z!=='tidehaven')roamMobs();
render();autoSave();return;
}
oldMove(dx,dy);
};
function checkBossContact(){
if(!state||battle)return;
const z=state.zone,a=arc();if(!a)return;
const targets={
sunshore:{x:15,y:5,type:'reefbreaker',chapter:3},
saltcave:{x:15,y:7,type:'herald',chapter:7},
abyssalheart:{x:16,y:6,type:'leviathan',chapter:8}
};
const b=targets[z];if(!b||a.bosses[z+'Visit']||a.chapter<b.chapter)return;
if(z==='sunshore'&&Object.keys(a.recruited).length<3){if(Math.abs(state.x-b.x)+Math.abs(state.y-b.y)<=2)note('Gather Brann, Selene and Pippa before confronting the Reefbreaker.');return}
if(Math.abs(state.x-b.x)+Math.abs(state.y-b.y)<=1){a.bosses[z+'Visit']=true;startBattle(b.type)}
}
const oldTravel=travelTo;
travelTo=function(zone){
if(!state||battle||!state.visitedPlaces?.[zone])return;
if(A.places[zone]){const p=A.places[zone];go(zone,p.entry[0],p.entry[1]);return}
oldTravel(zone);
};
function recruit(id){
const a=arc(),d=A.characters.find(c=>c.id===id);if(!a||!d||a.recruited[id])return;
const p={id:d.id,name:d.name,gender:d.gender,race:d.race,cl:d.cl,level:1,exp:0,hp:d.hp,maxhp:d.hp,atk:d.atk,def:d.def,spd:d.spd,energy:0,ascensionMaterial:'leviathancore',gear:{weapon:null,armor:null,accessory:null}};
state.party.push(p);a.recruited[id]=true;
setupProgress(p);rosterSetup();if(state.activeParty.length<4)state.activeParty.push(id);
note(d.name+' joined the party! Their ascension requires Leviathan Memory Cores.');
scene('New Companion: '+d.name,'<p>'+d.intro+'</p><p>'+d.story+'</p><p><b>Role:</b> '+d.role+' · '+d.race+' · '+d.cl+'</p><p>They joined your roster. Manage your active party to bring them into battle.</p>');
render();autoSave();
}
function companionTalk(id){
const a=arc(),d=A.characters.find(c=>c.id===id);if(!d)return;
if(!a.recruited[id]){
const introductions={
brann:'Brann is trying to lift an overturned fishing boat by himself. His booming laugh conceals a moment of fear when he sees the ship’s name: Wavebreaker. “I watched her sink. Or I dreamed it. Either way, I won’t let another crew drown.”',
selene:'Selene practices a sword form beside the docks. Her blade moves before her thoughts. “This technique belongs to an officer who has not been born. Yet my hands remember her crimes.”',
pippa:'Pippa sings on a crate in the market. The crowd cheers, but she stops at an empty space in the audience. “My brother always stands there. Nobody else can see him anymore. Help me sing loud enough to bring him back.”'
};
scene(d.name+' — A New Oath','<p>'+introductions[id]+'</p><p>'+d.intro+'</p><button onclick="arc2Recruit(\''+id+'\')">Invite '+d.name+' to the party</button><button onclick="closeModal()">Not yet</button>');return;
}
const key='companion_'+id,stage=a.choices[key]||0;
const passages={
brann:['Brann shows you the cracked compass of the Wavebreaker. It points toward ships that have already sunk. “I was supposed to be the shield. A shield that survives everyone else is a pretty poor shield.”','At the wreck, Brann finds a journal written in his handwriting, describing a voyage he never took. His captain ordered the crew to save strangers over themselves.','Brann stands before the sea at dawn. “I can’t save the past. But I can make sure the next boat comes home.” His laughter returns, gentler this time.'],
selene:['Selene reveals her royal crest. It is identical to a crest engraved in the cave, except the cave inscription says she betrayed the fleet.','She faces a reflection made of saltglass. It calls her a coward for refusing to carry out a terrible order. Selene lowers her sword: “You are a possible me, not my master.”','Selene chooses to protect the living rather than chase a verdict from another timeline. She begins teaching the harbor watch to fight without hatred.'],
pippa:['Pippa invites you to rehearse a song about a missing boy. She remembers his favorite jokes, but not his face.','The lighthouse keeper confesses that Pippa’s brother was among the first names offered to the sea. Pippa sings until her voice breaks, and a shadow in the surf answers.','Pippa finishes the song without asking the sea to return what it took. For one moment, every lantern in the harbor lights up with her brother’s name.']
};
const text=passages[id][Math.min(stage,2)];
if(stage<2){a.choices[key]=stage+1;scene(d.name+' — Personal Story '+(stage+1),'<p>'+text+'</p><p class="arc2-voice">Your companions listen. The tide keeps its own counsel.</p>')}
else{a.choices[key]=3;scene(d.name+' — Bond Complete','<p>'+text+'</p><p><b>Bond strengthened:</b> '+d.name+' gains a permanent +5 ATK and +5 DEF.</p>');if(!a.choices[key+'_reward']){a.choices[key+'_reward']=true;const p=state.party.find(p=>p.id===id);if(p){p.atk+=5;p.def+=5}}}
autoSave();render();
}
window.arc2Recruit=recruit;
function sideTalk(id){
const a=arc(),q=A.sideStories.find(s=>s.id===id);if(!a||!q)return;
if(a.chapter<q.start){note('This side story is not yet available.');return}
const progress=a.side[id]||0;
if(progress===0){a.side[id]=1;scene('Side Story: '+q.name,'<p>'+q.steps[0]+'</p><p><b>Return to this character to investigate further.</b></p>')}
else if(progress===1){a.side[id]=2;scene('Side Story: '+q.name,'<p>'+q.steps[1]+'</p><p>What will you do?</p><button onclick="arc2SideFinish(\''+id+'\',0)">'+q.choices[0][0]+'</button><button onclick="arc2SideFinish(\''+id+'\',1)">'+q.choices[0][1]+'</button>')}
else scene('Side Story Complete: '+q.name,'<p>'+q.ends[a.choices['side_'+id]||0]+'</p>');
autoSave();
}
window.arc2SideFinish=function(id,choice){
const a=arc(),q=A.sideStories.find(s=>s.id===id);if(!a||!q||a.side[id]!==2)return;
a.side[id]=3;a.choices['side_'+id]=choice;state.gold+=85;gain('expfolio');
scene('Side Story Complete: '+q.name,'<p>'+q.ends[choice]+'</p><p><b>Reward:</b> 85 gold and Scholar EXP Folio. Your decision is recorded in the story journal.</p>');
render();autoSave();
};
function menuFor(id){
const d=A.characters.find(c=>c.id===id),related=A.sideStories.filter(q=>q.npc===id&&arc().chapter>=q.start);
let html='<p>What would you like to discuss?</p>';
if(d)html+='<button onclick="arc2Companion(\''+id+'\')">'+(arc().recruited[id]?'Personal story':'Invite '+d.name)+'</button>';
for(const q of related)html+='<button onclick="arc2Side(\''+q.id+'\')">'+esc(q.name)+(arc().side[q.id]===3?' ✓':'')+'</button>';
html+='<button onclick="closeModal()">Leave</button>';
scene(d?d.name:'Tidehaven',html);
}
window.arc2Companion=companionTalk;window.arc2Side=sideTalk;
function mayorTalk(){
const a=arc();
if(a.chapter===1){chapter(2);return}
if(a.chapter===2){chapter(3);return}
if(a.chapter===3){scene('Mayor Corven — The Broken Compact','<p>“Three strangers have been asking after our missing ships,” the mayor says. “The guardian, the swordswoman, the singer. If you wish to help us, take them to Sunshore and defeat the Reefbreaker that stalks our fishermen.”</p><p><b>Goal:</b> Recruit Brann, Selene and Pippa, then defeat the Reefbreaker.</p>');return}
if(a.chapter===4&&!a.choices.festival){
scene('Chapter XI — The Festival of Borrowed Names','<p>The mayor holds a ledger full of names crossed out in seawater. “If I publish this, the town may riot. If I burn it, the dead vanish again.”</p><p>Pippa begs for the truth. Brann asks whether the living can bear it. Selene says a hidden wound never heals.</p><button onclick="arc2Festival(\'reveal\')">Reveal the ledger</button><button onclick="arc2Festival(\'protect\')">Protect the town for now</button>');return}
if(a.chapter===6&&!a.choices.compact){
if(!a.choices.keeper){scene('Mayor Corven','<p>“Speak to Keeper Vael at the lighthouse. His lens contains the testimony I cannot give you.”</p>');return}
scene('Chapter XIII — The Price of Safe Passage','<p>Mayor Corven finally confesses: his family has guarded the Tidebound Compact for generations. Their ancestors bargained away the fleet’s memories to escape the falling star. Each generation inherited the debt without knowing its origin.</p><p>“Tell them I was a coward,” he says, “or let me help make it right.”</p><button onclick="arc2Compact(\'confess\')">Ask the mayor to confess publicly</button><button onclick="arc2Compact(\'repair\')">Help him restore the stolen records first</button>');return}
menuFor('mayor');
}
window.arc2Festival=function(choice){const a=arc();if(a.chapter!==4)return;a.choices.festival=choice;scene('The Festival Divides','<p>'+(choice==='reveal'?'The ledger is read aloud. Grief and anger sweep the harbor, but the lost sailors are named for the first time in a century.':'You protect the crowd from the truth until the festival ends. The lanterns glow peacefully, but the tide carries a warning: silence is also a choice.')+'</p>');chapter(5);render();autoSave()};
window.arc2Compact=function(choice){const a=arc();if(a.chapter!==6)return;a.choices.compact=choice;scene('The Compact Reconsidered','<p>'+(choice==='confess'?'Corven steps before the townsfolk and admits the bargain. Some forgive him; others refuse. He accepts both.':'You rebuild the registry together, then invite the townsfolk to judge the truth for themselves. The lighthouse lamp burns blue for the first time.')+'</p>');chapter(7);render();autoSave()};
function apothecary(){
scene('Neriel — Elven Apothecary','<p>“Every tide brings a remedy, if you know which shells to listen to.” Neriel buys spare materials and brews tonics with distinct effects.</p><div class="arc2-shop">'+Object.entries(A.potions).map(([id,p])=>'<button onclick="arc2Buy(\''+id+'\')">'+esc(p.name)+' — '+p.price+' G<br><small>'+esc(p.description)+'</small></button>').join('')+'</div><p>Sell materials: 15 gold each (except rare boss cores).</p><button onclick="arc2Sell()">View material offers</button><button onclick="arc2Side(\'medicine\')">A Cure in Bitter Water</button><button onclick="closeModal()">Leave</button>');
}
window.arc2Buy=function(id){const p=A.potions[id];if(!p||state.gold<p.price){note('Not enough gold.');return}state.gold-=p.price;gain(id);render();autoSave();apothecary()};
window.arc2Sell=function(id){
const ids=Object.keys(A.materials).filter(key=>!['leviathancore','reefcrest'].includes(key)&&count(key)>0);
if(!id){
const offers=ids.map(key=>'<button data-id="'+key+'" onclick="arc2Sell(this.dataset.id)">'+A.materials[key]+' ×'+count(key)+' — 15 gold each</button>').join('');
scene('Neriel — Material Offers','<p>Choose which material to sell. Rare ascension cores are protected.</p>'+offers+'<button onclick="closeModal()">Leave</button>');
return;
}
if(!ids.includes(id))return;
consume(id);state.gold+=15;note('Sold '+A.materials[id]+' for 15 gold.');render();autoSave();window.arc2Sell();
};
function smith(){
scene('Orin — Harbor Blacksmith','<p>“No gambling with steel. You buy what I forged, and you know what you get.” Orin sells equipment with fixed effects.</p>'+Object.entries(A.gear).map(([id,p],i)=>'<button onclick="arc2SmithBuy(\''+id+'\')">'+esc(p.name)+' — '+(260+i*65)+' G ('+esc(p.set)+' set)</button>').join('')+'<button onclick="arc2Side(\'coral\')">The Smith and the Singing Ore</button><button onclick="closeModal()">Leave</button>');
}
window.arc2SmithBuy=function(id){
const entry=Object.entries(A.gear).find(([key])=>key===id);if(!entry)return;
const price=260+Object.keys(A.gear).indexOf(id)*65;if(state.gold<price){note('Not enough gold.');return}
forgeSetup();const uid='harbor_'+state.nextEquipmentId++,base=items[id];
const it={...base,name:base.name+' [CRAFTED]',rarity:'blue',upgrade:0,substats:{},instance:true,baseId:id,fixedEffects:true};
state.equipmentCatalog[uid]=it;items[uid]=it;state.gold-=price;state.inv[uid]=(state.inv[uid]||0)+1;note('Bought '+it.name+' with fixed equipment stats.');render();autoSave();smith();
};
const oldInteract=interact;
interact=function(){
if(!state||battle)return;
if(state.zone==='tidehaven'){
const npcs=[['mayor',10,5],['merchant',6,4],['smith',14,4],['brann',6,9],['selene',12,9],['pippa',16,9],['keeper',17,3]];
const near=npcs.filter(([id,x,y])=>Math.abs(state.x-x)+Math.abs(state.y-y)<=2).sort((a,b)=>(Math.abs(state.x-a[1])+Math.abs(state.y-a[2]))-(Math.abs(state.x-b[1])+Math.abs(state.y-b[2])));
if(!near.length){note('Explore Tidehaven and approach a resident to talk.');return}
const id=near[0][0];
if(id==='mayor')mayorTalk();else if(id==='merchant')apothecary();else if(id==='smith')smith();else if(id==='keeper')keeperTalk();else menuFor(id);
return;
}
if(state.zone==='saltcave'&&arc().chapter===5){
const crystals=[[6,3],[10,4],[14,9]];
const index=crystals.findIndex(([x,y])=>Math.abs(state.x-x)+Math.abs(state.y-y)<=2);
if(index>=0){
const a=arc();a.choices.caveCrystals||={};
if(!a.choices.caveCrystals[index]){
a.choices.caveCrystals[index]=true;state.inv.echopearl=(state.inv.echopearl||0)+1;
note('Recovered Echo Pearl '+Object.keys(a.choices.caveCrystals).length+'/3 from singing saltglass.');
if(Object.keys(a.choices.caveCrystals).length===3)chapter(6);
}else note('This saltglass crystal has already surrendered its memory.');
render();autoSave();return;
}
}
if(NEW_ZONES.includes(state.zone)){note('The salt wind carries distant voices. Look for a person or a marked place.');return}
oldInteract();
};
function keeperTalk(){
const a=arc();if(a.chapter===6){scene('The Keeper of Unfinished Names','<p>Keeper Vael removes the lighthouse lens. Inside are thousands of tiny names, each one a memory traded for passage. “I was ordered to forget my own daughter,” he says. “Every night I polish her name and remember her again.”</p><p>The lens shows the fleet carrying refugees, not deserters. The sea spirit kept them alive, but stole their histories.</p><p>“Take the truth to the mayor. Then descend to the Drowned Heart. The bargain must end.”</p>');a.choices.keeper=true;autoSave();return}
scene('Keeper Vael','<p>“The sea has a long memory, and our lighthouse has a short one. Ask the mayor about the old Compact.”</p>');
}
function newEnemy(type,index){
const data=A.enemies[type];if(!data)return null;
const level=state.hero?.level||1,scale=1+Math.min(1.7,(level-1)*.018);
const hp=Math.round(data.hp*scale);
return {id:index?'enemy'+index:'enemy',type,name:data.name,hp,maxhp:hp,atk:Math.round(data.atk*scale),def:Math.round(data.def*scale),spd:data.spd,energy:0,clock:10000/data.spd};
}
const oldStartBattle=startBattle;
startBattle=function(type){
if(!A.enemies[type]){oldStartBattle(type);return}
if(battle||!state)return;
const boss=['reefbreaker','herald','leviathan'].includes(type);
const types=boss?[type]:Array.from({length:1+Math.floor(Math.random()*3)},(_,i)=>i===0?type:mobType(state.zone));
const enemies=types.map((t,i)=>newEnemy(t,i)).filter(Boolean);
if(!enemies.length)return;
battle={enemy:enemies[0],enemies,selectedEnemyId:'enemy',clocks:{},points:3,turn:null,arc2Type:type,arc2Enemies:types};
members().forEach(p=>battle.clocks[p.id]=10000/Math.max(1,stats(p).spd));
enemies.forEach(e=>battle.clocks[e.id]=e.clock);
note('Encounter: '+enemies.map(e=>e.name).join(', ')+'!');
nextTurn();render();
};
const oldVictory=victory;
victory=function(){
if(!battle)return;
const a=arc(),type=battle.arc2Type;
if(!type){oldVictory();return}
const boss=['reefbreaker','herald','leviathan'].includes(type);
const defeated=battle.arc2Enemies||[type];
battle.enemy.type=boss?'boss':'wolf';
oldVictory();
if(!state||!a)return;
let rewards=0;
for(const t of defeated){
const d=A.enemies[t];if(!d)continue;
const id=d.drops[Math.floor(Math.random()*d.drops.length)];
state.inv[id]=(state.inv[id]||0)+1;rewards++;
if(Math.random()<.26&&t!=='leviathan'){const gear=Object.keys(A.gear);gain(gear[Math.floor(Math.random()*gear.length)])}
}
if(type==='reefbreaker'){state.inv.reefcrest=(state.inv.reefcrest||0)+2;if(a.chapter===3){chapter(4)}}
if(type==='herald'){a.bosses.heraldDefeated=true;state.inv.abyssfang=(state.inv.abyssfang||0)+3;note('The Herald falls. The drowned gate opens.')}
if(type==='leviathan'){
a.bosses.leviathanDefeated=true;
const cores=4+Math.floor(Math.random()*4);state.inv.leviathancore=(state.inv.leviathancore||0)+cores;
if(a.chapter===8&&!a.choices.ending)finale();
}
note('Tidebound loot: '+rewards+' material drops'+(type==='leviathan'?' and Leviathan Memory Cores':'')+'.');
render();autoSave();
};
finishEnemyWave=function(){
if(!battle)return false;
if(livingEnemies().length){syncBattlePrimary();return false}
battle.enemy=(battle.enemies||[battle.enemy])[0];battle.enemy.hp=0;
victory();return true;
};
function finale(){
scene('Chapter XV — The Tide That Remembers','<p>The Leviathan collapses into a sea of stars. Every stolen name rises around you, a constellation of possible lives. The voice that sounds like your own finally speaks clearly: “I did not come to save this timeline. I came to see if you could.”</p><p>Brann braces the collapsing cathedral. Selene holds back the drowning current. Pippa sings every name she can remember. Beyond the waves, another you reaches toward the same light.</p><p>The sea offers two mercies. Release every memory to the world, with all its grief and truth. Or bind them to the lighthouse, where no one can erase them again, but no one can fully carry them home.</p><button onclick="arc2End(\'release\')">Release the memories to the living</button><button onclick="arc2End(\'archive\')">Preserve them within the lighthouse</button>');
}
window.arc2End=function(choice){
const a=arc();if(!a||a.chapter!==8||!a.bosses.leviathanDefeated||a.choices.ending)return;
a.choices.ending=choice;state.gold+=2200;state.inv.leviathancore=(state.inv.leviathancore||0)+12;
const ending=choice==='release'?
'Every household in Tidehaven remembers. Some embrace long-lost names; others mourn a second time. Mayor Corven opens the registry to all. The harbor’s bells ring at sunrise without a hand to move them.':
'The lighthouse becomes an archive no tide can erase. Families visit to hear voices of the lost, while the living choose which memories to carry. Keeper Vael lights the lamp for his daughter, and for every stranger who never made it home.';
scene('Arc II Complete — '+(choice==='release'?'The Names We Carry':'The Lighthouse of Memory'),'<p>'+ending+'</p><p>Your companions watch the dawn. Brann laughs through tears. Selene finally sheathes her sword. Pippa sings a new verse about those who survived.</p><p>In the far horizon, a figure with your face closes a book marked <i>Timeline Zero</i>.</p><p><b>Rewards:</b> 2200 gold, 12 Leviathan Memory Cores. The Leviathan can be challenged again after leaving and returning.</p>');
render();autoSave();
};
const oldDraw=draw;
draw=function(){
if(!state||!NEW_ZONES.includes(state.zone)){oldDraw();return}
const z=state.zone,p=A.places[z],time=Date.now()*.001;
ctx.clearRect(0,0,640,416);
const base=z==='tidehaven'?['#4b8191','#568f99','#507c88']:z==='sunshore'?['#d4b780','#e5cb93','#b7b382']:z==='saltcave'?['#294f66','#315c70','#3d6175']:['#162e56','#203c67','#25395e'];
for(let y=0;y<13;y++)for(let x=0;x<20;x++){
const r=rand(x+11,y+29),c=base[Math.floor(r*base.length)];
ctx.fillStyle=c;ctx.fillRect(x*32,y*32,32,32);
if(z==='sunshore'&&y<3){ctx.fillStyle=['#307eaa','#3991b8','#5ba6c2'][Math.floor(r*3)];ctx.fillRect(x*32,y*32,32,32)}
if(z==='tidehaven'&&((x===10)||(y===6))){ctx.fillStyle='#b2a28b';ctx.fillRect(x*32+2,y*32+2,28,28)}
if(z==='saltcave'||z==='abyssalheart'){if(r>.88){ctx.fillStyle=z==='saltcave'?'#7bb8c4':'#667ad2';ctx.beginPath();ctx.moveTo(x*32+8,y*32+29);ctx.lineTo(x*32+16,y*32+4);ctx.lineTo(x*32+25,y*32+29);ctx.fill()}}
if(z==='sunshore'&&r>.92&&y>3){ctx.font='17px sans-serif';ctx.fillText('🐚',x*32+6,y*32+24)}
}
if(z==='tidehaven'){
for(const [x,y,icon] of [[4,3,'🏠'],[10,3,'🏛️'],[15,3,'🏠'],[3,9,'🏠'],[17,2,'🗼'],[18,10,'⛵']]){ctx.font='27px sans-serif';ctx.fillText(icon,x*32,y*32+28)}
for(const [x,y,icon] of [[10,5,'👑'],[6,4,'🧝'],[14,4,'⚒️'],[6,9,'🛡️'],[12,9,'⚔️'],[16,9,'🎤'],[17,3,'🕯️']]){ctx.font='22px sans-serif';ctx.fillText(icon,x*32+4,y*32+26)}
}
if(z==='sunshore'||z==='saltcave'||z==='abyssalheart'){
const markers=z==='sunshore'?[[15,5,'🦞']]:z==='saltcave'?[[15,7,'🔱'],[6,3,'🔮'],[10,4,'🔮'],[14,9,'🔮']]:[[16,6,'🐉']];
for(const [x,y,icon] of markers){ctx.font='25px sans-serif';ctx.fillText(icon,x*32+3,y*32+26)}
ensureMobs(z);for(const m of state.worldMobs[z]){const data=A.enemies[m.type];ctx.font='22px sans-serif';ctx.fillText(data?.icon||'👾',m.x*32+3,m.y*32+26)}
}
ctx.fillStyle='#192b55';ctx.fillRect(state.x*32+7,state.y*32+18,18,12);
ctx.fillStyle='#f4cdb0';ctx.fillRect(state.x*32+10,state.y*32+7,12,12);
ctx.fillStyle='#f3c678';ctx.fillRect(state.x*32+9,state.y*32+4,14,5);
ctx.fillStyle='#fff';ctx.fillRect(state.x*32+12,state.y*32+12,3,3);
ctx.font='bold 12px sans-serif';ctx.fillStyle='#fff0c0';ctx.fillText(p.name,12,19);
ctx.font='11px sans-serif';ctx.fillStyle='#e5f7ff';ctx.fillText('← Exit',5,6*32-13);ctx.fillText('Next →',576,6*32-13);
};
window.arc2OpenJournal=function(){
const a=arc();if(!a)return;
const chapters=a.journal.map(j=>'<section class="arc2-journal-entry"><h4>Chapter '+esc(j.title)+'</h4><p>'+esc(j.scene)+'</p></section>').join('');
const choices=Object.entries(a.choices).filter(([k])=>['festival','compact','ending'].includes(k)||k.startsWith('side_')).map(([k,v])=>'<p><b>'+esc(k.replace(/_/g,' '))+':</b> '+esc(v)+'</p>').join('');
const bonds=A.characters.map(c=>'<p>'+esc(c.icon+' '+c.name)+': '+(a.recruited[c.id]?'Recruited':'Not yet recruited')+' · '+esc(c.story)+'</p>').join('');
scene('The Tidebound Chronicle','<p>“Every name remembered is another light kept alive.”</p>'+chapters+'<h3>Decisions That Remain</h3>'+(choices||'<p>Your decisions have yet to be written.</p>')+'<h3>Companions of the Coast</h3>'+bonds);
};
const oldRender=render;
render=function(){
if(!state)return;
const a=arc();oldRender();
if(!a)return;
if(A.places[state.zone])document.getElementById('location').textContent=A.places[state.zone].name;
let journal=document.getElementById('arc2Journal');
if(!journal){journal=document.createElement('section');journal.id='arc2Journal';document.getElementById('quests').after(journal)}
const c=A.chapters[Math.max(0,a.chapter-1)];
journal.innerHTML='<h4>🌊 The Tidebound Saga</h4><p>'+(!ready()?'Complete the Moonfall crypt to unlock the coastal arc.':a.choices.ending?'Arc II complete — '+(a.choices.ending==='release'?'Memories Freed':'Memories Preserved'):c?'Chapter '+a.chapter+': '+esc(c.title):'Follow the coastal trail east of Whisperleaf Forest (19,10).')+'</p>'+(c&&!a.choices.ending?'<p>'+esc(c.objective)+'</p>':'')+'<p><small>Side stories completed: '+Object.values(a.side).filter(v=>v===3).length+'/'+A.sideStories.length+' · New companions: '+Object.keys(a.recruited).length+'/3</small></p><button onclick="arc2OpenJournal()">📖 Read Saga Journal</button>';
const q=document.getElementById('quests');if(q&&ready()&&!a.chapter)q.innerHTML+='<p>🌊 A Letter Written in Salt: Find the coastal trail in Whisperleaf Forest (19,10).</p>';
const map=document.getElementById('travelMap');if(map){const extra=document.createElement('p');extra.className='arc2-map-note';extra.textContent='Coastal routes: Forest → Tidehaven → Sunshore → Saltglass Cavern → Drowned Heart. Travel only to places already discovered.';map.appendChild(extra)}
};
const oldNewGame=newGame;
newGame=function(){oldNewGame();arc();render();autoSave()};
if(state){arc();render()}
})();