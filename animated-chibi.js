/* Distinct animated chibi sprites for dialogue and combat. Character profiles retain full anime portraits. */
(function(){
'use strict';
const looks={
hero:{hair:'#6f579f',coat:'#5c7dbb',skin:'#f1c8ae',eye:'#5376c7'},
kael:{hair:'#303750',coat:'#55789d',skin:'#e4b99d',eye:'#4d8fa9'},
lilia:{hair:'#cfd5e7',coat:'#bca6e0',skin:'#f3d2ba',eye:'#a58ad5'},
seren:{hair:'#d27799',coat:'#8b5b95',skin:'#edbba8',eye:'#6ca8bb'},
brann:{hair:'#936745',coat:'#a46a46',skin:'#c58f6f',eye:'#c29a4c'},
selene:{hair:'#c5d1eb',coat:'#526b9e',skin:'#f1cdbb',eye:'#6984cc'},
pippa:{hair:'#d6888c',coat:'#f3a0c1',skin:'#f4c9b4',eye:'#c66b9a'},
enemy:{hair:'#3e4e66',coat:'#73527c',skin:'#a4b4be',eye:'#e77694'}
};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function appearance(p){
const id=p?.id||'hero',base={...(looks[id]||(id==='hero'?looks.hero:looks.enemy))};
if(id==='hero'){
const race=p?.race||'Human',gender=p?.gender||'Female';
if(race==='Elf')base.hair=gender==='Male'?'#a7c5e1':'#b9c8ed';
if(race==='Beastkin')base.hair=gender==='Male'?'#99765b':'#d0a18b';
if(gender==='Male'&&race==='Human')base.hair='#343c5c';
if(gender==='Female'&&race==='Human')base.hair='#65416a';
if(gender==='Nonbinary'&&race==='Human')base.hair='#555c88';
}
return base;
}
function weapon(p){
const cl=p?.cl||'Warrior';
return cl==='Mage'||cl==='Witch'?'✦':cl==='Priestess'||cl==='Idol'||cl==='Bard'?'♫':cl==='Gunner'?'✹':cl==='Assassin'||cl==='Rogue'?'◆':cl==='Guardian'?'⬡':'⚔';
}
function svg(p){
const a=appearance(p),id=p?.id||'hero',beast=p?.race==='Beastkin'||id==='brann',elf=p?.race==='Elf'||id==='selene';
const ears=beast?'<path d="M37 45 19 8 52 27M89 27 108 8 93 45" fill="'+a.hair+'" stroke="#765b57" stroke-width="2"/><path d="M32 30 24 17 43 27M92 27 102 17 94 31" fill="#e7a9b0"/>':elf?'<path d="M32 67 9 52 35 54M92 54 115 52 94 67" fill="'+a.skin+'" stroke="#c1978d" stroke-width="1.5"/>':'';
const hair= id==='kael'||id==='brann'||p?.gender==='Male'?'<path d="M24 55Q19 13 59 13Q95 12 102 55L91 38 77 45 68 29 52 45 38 35Z" fill="'+a.hair+'"/>':'<path d="M23 62Q10 13 63 12Q110 12 103 65L95 104 85 89 88 40 70 29 50 47 35 39 35 88 24 103Z" fill="'+a.hair+'"/>';
const accessory=id==='pippa'?'<path d="M92 30Q110 8 112 31Q102 40 91 35" fill="#f8db76"/>':id==='lilia'?'<path d="M23 42 15 31 25 20 35 31Z" fill="#fff1ae"/>':id==='selene'?'<path d="M80 20 86 8 93 20" fill="#a3d5f7"/>':'';
const mark=weapon(p);
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 164" role="img" aria-label="Animated chibi '+safe(p?.name||id)+'"><ellipse cx="62" cy="154" rx="37" ry="6" fill="#030e28" opacity=".35"/><g class="chibi-bob"><g class="chibi-legs"><path d="M46 123 42 146 57 146 62 124M67 124 70 146 84 146 79 122" fill="#34425d" stroke="#1e2746" stroke-width="3"/><path d="M39 144Q46 138 58 145L59 151 39 151ZM68 145Q80 138 87 145L88 151 68 151Z" fill="#1d2845"/></g><g class="chibi-body"><path d="M40 96 31 118 42 124 51 110 50 136 78 136 76 109 86 124 97 117 86 96Z" fill="'+a.coat+'" stroke="#38425f" stroke-width="3"/><path d="M53 97 62 119 73 97" fill="#f2e5d7"/><path d="M58 116 63 122 68 116" fill="#e6c17c"/><g class="chibi-arm"><path d="M85 101 103 114 97 123 81 111" fill="'+a.coat+'" stroke="#38425f" stroke-width="3"/><circle cx="101" cy="120" r="6" fill="'+a.skin+'"/><text x="103" y="110" font-size="22" text-anchor="middle" fill="#ffdf91">'+mark+'</text></g><path d="M42 100 24 113 31 123 47 110" fill="'+a.coat+'" stroke="#38425f" stroke-width="3"/><circle cx="28" cy="119" r="6" fill="'+a.skin+'"/></g>'+ears+'<g class="chibi-head"><path d="M28 49Q25 20 63 20Q102 20 98 55L94 80Q86 103 63 105Q39 103 31 80Z" fill="'+a.skin+'" stroke="#9e7979" stroke-width="2.5"/><ellipse cx="44" cy="78" rx="9" ry="5" fill="#f09c9d" opacity=".55"/><ellipse cx="83" cy="78" rx="9" ry="5" fill="#f09c9d" opacity=".55"/><g class="chibi-eyes"><ellipse cx="48" cy="65" rx="9" ry="12" fill="#fff"/><ellipse cx="79" cy="65" rx="9" ry="12" fill="#fff"/><ellipse cx="49" cy="67" rx="6" ry="9" fill="'+a.eye+'"/><ellipse cx="78" cy="67" rx="6" ry="9" fill="'+a.eye+'"/><circle cx="51" cy="63" r="2.7" fill="#fff"/><circle cx="80" cy="63" r="2.7" fill="#fff"/></g><path d="M58 86Q64 92 70 86" stroke="#ad6571" stroke-width="2.2" stroke-linecap="round" fill="none"/>'+hair+accessory+'</g></g></svg>';
}
window.elariaChibiSVG=svg;
window.elariaChibiTag=(p,extra='')=>'<div class="elaria-chibi '+extra+'" aria-label="'+safe(p?.name||'Character')+' chibi">'+svg(p)+'</div>';
/* Persistent stage actors: game.html rebuilds combatStage.innerHTML on every render.
   Keep sprites as siblings of #combatStage so CSS timelines don't restart on every
   stat, action, HP, or combat-log refresh. */
let stagedBattle=null;
let rosterSignature='';
let actorNodes=new Map();
function isReducedMotion(){
  return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
function combatActors(){
  const teammates=members();
  const enemies=(Array.isArray(battle?.enemies)&&battle.enemies.length?
    battle.enemies:[battle?.enemy]).filter(Boolean);
  const seen=new Set();
  return {
    teammates,
    enemies:enemies.filter(p=>{
      const key=String(p.id||p.name||'enemy');
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    })
  };
}
function actorKey(p,enemySide,index){
  return (enemySide?'foe:':'ally:')+String(p.id||index);
}
function makeActor(p,key,enemySide,index){
  const sprite=document.createElement('div');
  sprite.className='elaria-chibi-avatar elaria-chibi '+(enemySide?'enemy-chibi':'ally-chibi');
  sprite.dataset.chibiId=key;
  sprite.innerHTML=svg(p);
  const nametag=document.createElement('span');
  nametag.className='chibi-name';
  nametag.textContent=p.name||'Enemy';
  sprite.appendChild(nametag);
  const health=document.createElement('div');
  health.className='chibi-health';
  const healthFill=document.createElement('span');
  health.appendChild(healthFill);
  sprite.appendChild(health);
  sprite.style.setProperty('--chibi-delay',(-index*.43)+'s');
  return sprite;
}
function prepareStage(stage){
  let shell=document.getElementById('elariaChibiBattleStage');
  if(!shell||!shell.contains(stage)){
    shell=document.createElement('div');
    shell.id='elariaChibiBattleStage';
    shell.className='elaria-chibi-stage';
    stage.parentNode.insertBefore(shell,stage);
    shell.appendChild(stage);
  }
  let layer=document.getElementById('elariaPersistentChibis');
  if(!layer){
    layer=document.createElement('div');
    layer.id='elariaPersistentChibis';
    layer.className='elaria-persistent-chibis';
    layer.setAttribute('aria-label','Animated combat characters');
    const party=document.createElement('div');
    party.className='chibi-combat-party';
    const foes=document.createElement('div');
    foes.className='chibi-combat-foes';
    layer.appendChild(party);
    layer.appendChild(foes);
    shell.appendChild(layer);
  }
  return layer;
}
function syncSprites(){
  if(!state||!battle)return;
  const stage=document.getElementById('combatStage');
  if(!stage||!stage.parentNode)return;
  const layer=prepareStage(stage);
  const actors=combatActors();
  const membersAll=[
    ...actors.teammates.map((p,i)=>({p,i,foe:false,key:actorKey(p,false,i)})),
    ...actors.enemies.map((p,i)=>({p,i,foe:true,key:actorKey(p,true,i)}))
  ];
  const signature=membersAll.map(a=>a.key+':'+(a.p.type||a.p.cl||'')+':'+(a.p.race||'')+':'+(a.p.gender||'')).join('|');
  if(battle!==stagedBattle||signature!==rosterSignature){
    actorNodes.clear();
    const party=layer.querySelector('.chibi-combat-party');
    const foes=layer.querySelector('.chibi-combat-foes');
    party.replaceChildren();
    foes.replaceChildren();
    for(const a of membersAll){
      const node=makeActor(a.p,a.key,a.foe,a.i);
      (a.foe?foes:party).appendChild(node);
      actorNodes.set(a.key,node);
    }
    stagedBattle=battle;
    rosterSignature=signature;
  }
  for(const a of membersAll){
    const node=actorNodes.get(a.key);
    if(!node)continue;
    node.classList.toggle('current',battle.turn===a.p.id);
    node.classList.toggle('defeated',a.p.hp<=0);
    const name=node.querySelector('.chibi-name');
    if(name&&name.textContent!==a.p.name)name.textContent=a.p.name||'Enemy';
    const fill=node.querySelector('.chibi-health span');
    if(fill){
      const max=Math.max(1,Number(a.p.maxhp)||Number(a.p.hp)||1);
      const hp=Math.max(0,Number(a.p.hp)||0);
      fill.style.width=Math.min(100,(hp/max)*100)+'%';
    }
  }
  layer.classList.toggle('motion-off',isReducedMotion());
}
function pulseActor(node,kind){
  if(!node||isReducedMotion())return;
  const classes=['chibi-striking','chibi-casting','chibi-hit-react'];
  node.classList.remove(...classes);
  // Restart an action even if the same actor makes two rapid consecutive attacks.
  void node.offsetWidth;
  const cls=kind==='hit'?'chibi-hit-react':kind==='skill'||kind==='ultimate'?'chibi-casting':'chibi-striking';
  node.classList.add(cls);
  const finish=()=>node.classList.remove(cls);
  node.addEventListener('animationend',finish,{once:true});
  setTimeout(finish,1050);
}
const baseCombatEffect=combatEffect;
combatEffect=function(actorId,kind,targetId){
  const result=baseCombatEffect(actorId,kind,targetId);
  if(!battle)return result;
  // Base attack VFX are inside the frequently refreshed battleStage;
  // the persistent layer carries the animated character action itself.
  const origin=actorNodes.get('ally:'+actorId)||actorNodes.get('foe:'+actorId);
  const target=actorNodes.get('ally:'+targetId)||actorNodes.get('foe:'+targetId);
  pulseActor(origin,kind);
  if(kind!=='heal')pulseActor(target,'hit');
  return result;
};
const baseRender=render;
render=function(){
  baseRender();
  if(state&&battle)syncSprites();
  else if(!battle){
    stagedBattle=null;
    rosterSignature='';
    actorNodes.clear();
    // Keep the two persistent sprite rows intact for the next encounter.
    // Clearing the layer itself would remove their containers and break
    // subsequent battles after the first victory.
    const layer=document.getElementById('elariaPersistentChibis');
    if(layer){
      layer.querySelector('.chibi-combat-party')?.replaceChildren();
      layer.querySelector('.chibi-combat-foes')?.replaceChildren();
    }
  }
};

const baseModal=modal;
modal=function(html){
baseModal(html);
if(!state)return;
const root=document.getElementById('dialog');
if(!root||root.querySelector('.character-hub'))return;
const bond=root.querySelector('.bond-scene');
if(bond&&root.querySelector('.bond-scene-hero')){
const title=bond.querySelector('h2')?.textContent||'';
const isStory=title.includes('—');
if(isStory){
const person=members().find(p=>title.startsWith(p.name+' —'));
const old=bond.querySelector('.bond-scene-hero .anime-portrait');
if(person&&old)old.outerHTML=window.elariaChibiTag(person,'story-chibi');
}
}
const header=root.querySelector('.anime-dialogue-header');
if(header){
const name=header.querySelector('span')?.textContent?.trim();
const person=members().find(p=>p.name===name);
const known={Kael:'kael',Lilia:'lilia',Seren:'seren',Brann:'brann',Selene:'selene',Pippa:'pippa'};
const p=person||(known[name]?{id:known[name],name,gender:known[name]==='kael'||known[name]==='brann'?'Male':'Female'}:(name?{id:'npc',name,gender:'Female'}:null));
const img=header.querySelector('.anime-portrait');
if(p&&img)img.outerHTML=window.elariaChibiTag(p,'story-chibi');
}
};
if(state)render();
})();