/* Tidebound Saga: companion combat identity, potion effects, set bonuses, boss presentation. */
(function(){
'use strict';
if(!window.ARC2)return;
const A=window.ARC2;
const baseStats=stats;
stats=function(p){
const s=baseStats(p),sets={};
for(const id of Object.values(p.gear||{})){const item=items[id];if(item?.set)sets[item.set]=(sets[item.set]||0)+1}
if(sets.Tideguard>=2)s.def+=12;if(sets.Tideguard>=3)s.maxhp+=65;
if(sets.Moonwake>=2)s.spd+=20;if(sets.Moonwake>=3)s.atk+=13;
if(sets.Abyssal>=2)s.atk+=19;if(sets.Abyssal>=3)s.spd+=24;
if(battle&&p.guardDraught)s.def+=15;
if(battle&&p.swiftBrew)s.spd+=25;
if(battle&&p.idolInspiration)s.atk+=p.idolInspiration;
return s;
};
const baseHit=hit;
hit=function(attacker,target,multiplier){
const before=target.hp;
const result=baseHit(attacker,target,multiplier);
if(target.guardBarrier&&attacker.id.startsWith('enemy')){
const absorbed=Math.min(target.guardBarrier,before-target.hp);
target.hp=Math.min(stats(target).maxhp,target.hp+absorbed);
target.guardBarrier-=absorbed;
note(target.name+' absorbs '+absorbed+' damage behind Brann’s shield!');
}
if(attacker.type==='leviathan'&&target.hp>0){
if(Math.random()<.24){target.energy=Math.max(0,target.energy-20);note('The Leviathan’s memory tide drains 20 Energy from '+target.name+'.')}
}
return result;
};
const baseAction=act;
act=function(kind){
if(!battle)return;
const p=members().find(m=>m.id===battle.turn);
if(!p||!['Guardian','Duelist','Idol'].includes(p.cl)){baseAction(kind);return}
const e=selectedEnemy();if(!e)return;
if(kind==='basic'){
hit(p,e,1);battle.points=Math.min(5,battle.points+1);p.energy=Math.min(100,p.energy+25);
}else if(kind==='skill'){
if(battle.points<1)return;battle.points--;
if(p.cl==='Guardian'){
members().filter(m=>m.hp>0).forEach(m=>m.guardBarrier=(m.guardBarrier||0)+Math.max(14,Math.round(stats(p).def*1.6)));
note(p.name+' casts Breakwater Wall: barriers protect the party.');
}else if(p.cl==='Duelist'){
hit(p,e,.95);if(e.hp>0)hit(p,e,.95);
note(p.name+' uses Moonlit Crosscut.');
}else if(p.cl==='Idol'){
members().filter(m=>m.hp>0).forEach(m=>{m.hp=Math.min(stats(m).maxhp,m.hp+32);m.energy=Math.min(100,m.energy+12)});
note(p.name+' sings Bright Chorus, healing and restoring Energy.');
}
p.energy=Math.min(100,p.energy+35);
}else if(kind==='ultimate'){
if(p.energy<100)return;p.energy=0;
if(p.cl==='Guardian'){
livingEnemies().forEach(m=>hit(p,m,1.7));
members().filter(m=>m.hp>0).forEach(m=>m.guardBarrier=(m.guardBarrier||0)+Math.round(stats(p).def*3));
note(p.name+' unleashes Tidal Bastion!');
}else if(p.cl==='Duelist'){
for(let i=0;i<4&&e.hp>0;i++)hit(p,e,1.05);
note(p.name+' performs Fourfold Moonfall!');
}else if(p.cl==='Idol'){
members().filter(m=>m.hp>0).forEach(m=>{m.hp=Math.min(stats(m).maxhp,m.hp+100);m.energy=Math.min(100,m.energy+35);m.idolInspiration=12});
note(p.name+' performs Starlit Encore! The party is healed and inspired.');
}
}
if(finishEnemyWave())return;
nextTurn();render();autoSave();
};
const baseUltimate=ultimate;
ultimate=function(pid){
if(!battle||battle.turn!==pid)return;
const p=members().find(m=>m.id===pid);
if(p&&['Guardian','Duelist','Idol'].includes(p.cl)){act('ultimate');return}
baseUltimate(pid);
};
const baseUltimateName=currentUltimateName;
currentUltimateName=function(p){
if(p?.cl==='Guardian')return 'Tidal Bastion';
if(p?.cl==='Duelist')return 'Fourfold Moonfall';
if(p?.cl==='Idol')return 'Starlit Encore';
return baseUltimateName(p);
};
window.arc2UsePotion=function(id){
if(!state||battle||!A.potions[id]||count(id)<1)return;
const p=state.hero;consume(id);
if(id==='salttonic')p.hp=Math.min(stats(p).maxhp,p.hp+90);
if(id==='tideelixir'){p.hp=Math.min(stats(p).maxhp,p.hp+60);p.energy=Math.min(100,p.energy+40)}
if(id==='guarddraught')p.guardDraught=true;
if(id==='swiftbrew')p.swiftBrew=true;
note('Used '+A.potions[id].name+' on '+p.name+'.');render();autoSave();
};
const baseRender=render;
render=function(){
if(!state)return;
baseRender();
let panel=document.getElementById('arc2Potions');
if(!panel){panel=document.createElement('section');panel.id='arc2Potions';document.getElementById('party').after(panel)}
panel.innerHTML='<h4>🧪 Coastal Remedies</h4><p>Consumables apply to your hero. Guardian and Stormstep brews last until the next battle ends.</p>'+Object.entries(A.potions).map(([id,p])=>'<button onclick="arc2UsePotion(\''+id+'\')" '+(battle||count(id)<1?'disabled':'')+'>'+p.name+' ×'+count(id)+' — '+p.description+'</button>').join('');
if(battle){
const actor=members().find(m=>m.id===battle.turn),root=document.getElementById('battleActions');
if(actor&&root&&['Guardian','Duelist','Idol'].includes(actor.cl)){
const buttons=root.querySelectorAll('button');
if(buttons[1])buttons[1].textContent=actor.cl==='Guardian'?'Breakwater Wall (1 SP)':actor.cl==='Duelist'?'Moonlit Crosscut (1 SP)':'Bright Chorus (1 SP)';
}
}
};
const baseVictory=victory;
victory=function(){const active=battle?.arc2Type;baseVictory();
if(active&&state){for(const p of allCharacters()){p.guardDraught=false;p.swiftBrew=false;p.guardBarrier=0;p.idolInspiration=0}render();autoSave()}
};
const baseDefeat=defeat;
defeat=function(){baseDefeat();if(state){for(const p of allCharacters()){p.guardDraught=false;p.swiftBrew=false;p.guardBarrier=0;p.idolInspiration=0}}};
const baseBossContact=checkBossContact;
checkBossContact=function(){
if(state?.zone==='sunshore'&&arc().chapter===3&&Object.keys(arc().recruited).length<3&&Math.abs(state.x-15)+Math.abs(state.y-5)<=2){note('Gather Brann, Selene and Pippa before challenging the Reefbreaker.');return}
baseBossContact();
};
const baseDraw=draw;
draw=function(){
baseDraw();
if(!state||!A.places[state.zone])return;
const t=Date.now()*.001;
const isBeach=state.zone==='sunshore',isDeep=state.zone==='abyssalheart';
ctx.save();
ctx.globalAlpha=.12;
ctx.fillStyle=isBeach?'#e7ffff':isDeep?'#83b7ff':'#e0f8ff';
for(let i=0;i<13;i++){
const y=(i*47+Math.sin(t+i*.8)*3)%416;
ctx.fillRect(0,y,640,1.2);
}
ctx.globalAlpha=.3;
for(let i=0;i<8;i++){
const x=(i*97+Math.sin(t*.65+i)*10+640)%640,y=(i*73+t*8)%416;
ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fill();
}
ctx.restore();
};
let lastFrame=0;
function animate(timestamp){
if(timestamp-lastFrame>125){lastFrame=timestamp;if(state&&A.places[state.zone]&&!battle)draw()}
requestAnimationFrame(animate);
}
if(typeof requestAnimationFrame==='function')requestAnimationFrame(animate);
if(state)render();
})();