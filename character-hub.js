/* Character hub: one place for roster, growth, equipment and enhancement. */
(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected='hero',tab='overview';
function roster(){return typeof allCharacters==='function'?allCharacters():[state.hero,...(state.party||[])];}
function get(){return roster().find(p=>p.id===selected)||state.hero;}
function portrait(p){return window.elariaPortraitTag?.(p.id,p.gender,p.race,p.name,'character-portrait')||'';}
function gearItems(){return Object.entries(state.inv||{}).filter(([id,n])=>n>0&&['weapon','armor','accessory'].includes(items[id]?.type));}
function slots(p){return ['weapon','armor','accessory'].map(slot=>{const id=p.gear?.[slot],it=items[id];return '<div class="ch-slot"><b>'+slot.toUpperCase()+'</b><span>'+esc(it?.name||'Empty')+'</span>'+(id?'<button onclick="characterUnequip(\''+esc(p.id)+'\',\''+slot+'\')">Unequip</button>':'')+'</div>'}).join('');}
function details(p){const s=stats(p);setupProgress(p);return '<div class="ch-stats"><span>❤️ HP <b>'+p.hp+'/'+s.maxhp+'</b></span><span>⚔ ATK <b>'+s.atk+'</b></span><span>🛡 DEF <b>'+s.def+'</b></span><span>⚡ SPD <b>'+s.spd+'</b></span><span>✨ Energy <b>'+p.energy+'/100</b></span><span>EXP <b>'+p.exp+'/'+p.level*70+'</b></span></div>';}
function attributes(p){
ensureAttributes(p);
let html='<h3>Attribute Points</h3><p>Available: <b>'+p.attributePoints+'</b> points. Earn 3 points per level.</p>';
for(const key of ATTRIBUTE_KEYS){
html+='<div class="ch-item"><span><b>'+esc(ATTRIBUTE_LABELS[key])+' · '+attributeValue(p,key)+'</b><small>'+esc(ATTRIBUTE_HINTS[key])+'</small></span><button '+(battle||p.attributePoints<1?'disabled':'')+' onclick="characterAddStat('+JSON.stringify(p.id).replace(/"/g,"'")+','+JSON.stringify(key).replace(/"/g,"'")+')">+1</button></div>';
}
return html;
}
function growth(p){setupProgress(p);const material=p.ascensionMaterial||'cryptcore',cost=typeof ASCENSION_COST!=='undefined'?ASCENSION_COST[p.levelCap]:undefined;
let html='<h3>Character Experience</h3><p>Level '+p.level+' / '+p.levelCap+' · EXP '+p.exp+'/'+(p.level*70)+'</p>';
for(const id of ['expnote','expfolio','expchronicle'])if(items[id])html+='<div class="ch-item"><span>'+esc(items[id].name)+' ×'+count(id)+'</span><button '+(battle||!count(id)||p.level>=p.levelCap?'disabled':'')+' onclick="characterExp(\''+esc(p.id)+'\',\''+id+'\')">Use EXP</button></div>';
html+='<h3>Ascension</h3><p>Required material: '+esc(items[material]?.name||material)+' · Owned '+count(material)+' / '+(cost??'MAX')+'</p><button '+(battle||!cost||p.level<p.levelCap||count(material)<cost?'disabled':'')+' onclick="characterAscend(\''+esc(p.id)+'\')">Ascend Character</button>';
return html;}
function equipment(p){let html='<h3>Equipped Gear</h3>'+slots(p)+'<h3>Available Equipment</h3>';
const available=gearItems();if(!available.length)html+='<p>No spare equipment in inventory.</p>';
for(const [id,n] of available){const it=items[id];html+='<div class="ch-item"><span>'+esc(it.name)+' ×'+n+' · '+esc(it.type)+'</span><button '+(battle?'disabled':'')+' onclick="characterEquip(\''+esc(p.id)+'\',\''+esc(id)+'\')">Equip</button></div>'}
return html;}
function enhancements(){if(typeof forgeSetup==='function')forgeSetup();let html='<h3>Equipment Enhancement</h3><p>Golem Temper Shards: '+count('golemshard')+' · Gold: '+state.gold+' · Maximum upgrade +15</p>';
const list=[];for(const [id,n] of Object.entries(state.inv||{}))if(n>0&&items[id]?.instance)list.push([id,'Inventory']);
for(const p of roster())for(const id of Object.values(p.gear||{}))if(items[id]?.instance)list.push([id,p.name]);
if(!list.length)html+='<p>No upgradeable equipment yet.</p>';
for(const [id,owner] of list){const it=items[id],cost=it.upgrade>=10?3:it.upgrade>=5?2:1;html+='<div class="ch-item"><span><b>'+esc(it.name)+' +'+it.upgrade+'</b><small>'+esc(owner)+' · '+Object.entries(it.substats||{}).map(([k,v])=>esc(k)+' +'+v).join(' · ')+'</small></span><button '+(battle||it.upgrade>=15||count('golemshard')<cost||state.gold<cost*20?'disabled':'')+' onclick="characterUpgrade(\''+esc(id)+'\')">'+(it.upgrade>=15?'MAX':'Upgrade '+cost+' shards / '+cost*20+' G')+'</button></div>'}
return html;}
function overview(p){return details(p)+'<h3>Equipment</h3>'+slots(p)+'<div class="ch-actions"><button onclick="characterTab(\'growth\')">EXP & Ascension</button><button onclick="characterTab(\'equipment\')">Manage Equipment</button><button onclick="characterTab(\'upgrade\')">Enhance Gear</button></div>';}
function hub(){
if(!state)return;
const p=get();selected=p.id;setupProgress(p);
const tabs=[['overview','Overview'],['growth','EXP & Ascension'],['equipment','Equipment'],['upgrade','Upgrades'],['attributes','Stats +']];
const body=tab==='growth'?growth(p):tab==='equipment'?equipment(p):tab==='upgrade'?enhancements():tab==='attributes'?attributes(p):overview(p);
modal('<div class="character-hub"><div class="ch-header"><h2>✦ Characters</h2><button onclick="closeModal()">✕ Close</button></div><div class="ch-roster">'+roster().map(c=>'<button class="'+(c.id===selected?'selected':'')+'" onclick="characterSelect(\''+esc(c.id)+'\')">'+portrait(c)+'<span>'+esc(c.name)+'</span></button>').join('')+'</div><div class="ch-profile">'+portrait(p)+'<div><h2>'+esc(p.name)+'</h2><p>'+esc(p.race||'')+' · '+esc(p.cl)+' · Level '+p.level+'</p><p>'+((state.activeParty||[]).includes(p.id)?'Active party':'Reserve character')+'</p></div></div><div class="ch-tabs">'+tabs.map(([id,label])=>'<button class="'+(tab===id?'selected':'')+'" onclick="characterTab(\''+id+'\')">'+label+'</button>').join('')+'</div><div class="ch-content">'+body+'</div><div class="ch-footer"><button '+(battle?'disabled':'')+' onclick="characterParty()">Manage Active Party</button>'+(p.id!=='hero'&&window.elariaBondMenu?'<button onclick="elariaBondMenu(\''+esc(p.id)+'\')">Talk & Affection</button>':'')+'<button onclick="closeModal()">Back to Game</button></div></div>');
}
window.openCharacters=hub;
window.characterSelect=id=>{selected=id;tab='overview';hub()};
window.characterTab=id=>{tab=id;hub()};
window.characterEquip=(pid,id)=>{if(battle)return;equip(pid,id);hub()};
window.characterUnequip=(pid,slot)=>{if(battle)return;unequip(pid,slot);hub()};
window.characterExp=(pid,id)=>{if(battle)return;useExpItem(pid,id);hub()};
window.characterAscend=pid=>{if(battle)return;ascendCharacter(pid);hub()};
window.characterUpgrade=id=>{if(battle)return;forgeUpgrade(id);hub()};
window.characterAddStat=(pid,key)=>{
if(!state||battle||!ATTRIBUTE_KEYS.includes(key))return;
const p=roster().find(c=>c.id===pid);if(!p)return;
ensureAttributes(p);if(p.attributePoints<1)return;
p.attributes[key]++;p.attributePoints--;
p.hp=Math.min(p.hp,stats(p).maxhp);
note(p.name+' invested 1 point in '+ATTRIBUTE_LABELS[key]+'.');
render();autoSave();hub();
};
window.characterParty=()=>{if(!battle)partyManagerDialog()};
const originalRender=render;
render=function(){
if(!state)return;originalRender();
const party=document.getElementById('party');
if(party){const parent=party.closest('.panel');if(parent){parent.classList.add('character-legacy-panel');parent.querySelector('h3').textContent='Characters';party.style.display='none';let button=parent.querySelector('#characterHubButton');if(!button){button=document.createElement('button');button.id='characterHubButton';button.textContent='👤 Open Characters';button.onclick=hub;parent.insertBefore(button,party)}let hp=parent.querySelector('#heroQuickHP');
if(!hp){hp=document.createElement('div');hp.id='heroQuickHP';parent.insertBefore(hp,button)}
const protagonist=state.hero,max=Math.max(1,stats(protagonist).maxhp),current=Math.max(0,protagonist.hp);
hp.innerHTML='<div class="quick-hp-heading"><b>❤️ '+esc(protagonist.name)+' HP</b><strong>'+current+' / '+max+'</strong></div><div class="quick-hp-track"><span style="width:'+Math.min(100,100*current/max)+'%"></span></div>';
const rest=[...parent.querySelectorAll('button')].find(b=>b!==button&&b.textContent.includes('Rest at Inn'));if(rest)rest.style.display='';}}
const gear=document.getElementById('gear');if(gear){const parent=gear.closest('.panel');if(parent){parent.classList.add('character-legacy-panel');parent.querySelector('h3').textContent='Equipment & Upgrades';gear.style.display='none';let button=parent.querySelector('#characterGearButton');if(!button){button=document.createElement('button');button.id='characterGearButton';button.textContent='⚒ Manage Equipment';button.onclick=()=>{tab='equipment';hub()};parent.insertBefore(button,gear)}}}
const forge=document.getElementById('forgePanel');if(forge)forge.style.display='none';
};
if(state)render();
})();