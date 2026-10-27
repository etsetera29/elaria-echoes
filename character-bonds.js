/* Relationship expansion: party conversations, gifts, romance/friendship routes and battle synergy. */
(function(){
'use strict';
const cast={
kael:{name:'Kael',gender:'Male',likes:'training',gift:'warriorcrest',favorite:'Sparring Crest',story:'Kael has always believed that a promise is stronger than any sword. He worries that protecting you might mean losing the courage to follow his own path.'},
lilia:{name:'Lilia',gender:'Female',likes:'flowers',gift:'moonflower',favorite:'Moonflower Bouquet',story:'Lilia heals everyone she can reach, but she cannot mend the letter she never sent to her family. She keeps it folded beneath her prayer book.'},
seren:{name:'Seren',gender:'Female',likes:'music',gift:'musicbox',favorite:'Silver Music Box',story:'Seren remembers songs from places that have never existed. Sometimes the melody ends with the sound of a door shutting in another timeline.'},
brann:{name:'Brann',gender:'Male',likes:'food',gift:'feastbox',favorite:'Harbor Feast',story:'Brann hides his fear of another lost crew behind laughter. Every meal he shares is a promise that someone will be there for breakfast.'},
selene:{name:'Selene',gender:'Female',likes:'books',gift:'starbook',favorite:'Astral Poetry',story:'Selene carries the weight of a betrayal committed by another version of herself. She wants to be known for the choices she makes here.'},
pippa:{name:'Pippa',gender:'Female',likes:'music',gift:'musicbox',favorite:'Silver Music Box',story:'Pippa sings so the sea cannot erase another name. She is learning that being loved does not mean she must perform every moment.'}
};
const gifts={warriorcrest:{name:'Sparring Crest',cost:95},moonflower:{name:'Moonflower Bouquet',cost:90},musicbox:{name:'Silver Music Box',cost:110},feastbox:{name:'Harbor Feast',cost:90},starbook:{name:'Astral Poetry',cost:105},seaglass:{name:'Sea Glass Charm',cost:55}};
Object.entries(gifts).forEach(([id,g])=>items[id]={name:g.name,type:'item'});
const escapeHtml=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const hero=()=>state?.hero;
function relationships(){if(!state)return null;state.relationships||={};return state.relationships}
function relation(id){const all=relationships();if(!all)return null;all[id]||={affection:0,talkAt:0,scenes:{},gifts:0,battles:0};return all[id]}
function member(id){return state?.party?.find(p=>p.id===id)}
function romance(id){const h=hero(),c=cast[id];return !!(h&&c&&((h.gender==='Male'&&c.gender==='Female')||(h.gender==='Female'&&c.gender==='Male')))}
function stage(points){return points>=100?'Unbreakable Bond':points>=75?'Devoted':points>=50?'Trusted':points>=25?'Close Friend':points>=10?'Acquaintance':'New Companion'}
function gainAffection(id,amount,why){const r=relation(id);if(!r)return;const previous=r.affection;r.affection=Math.min(100,Math.max(0,r.affection+amount));if(previous<25&&r.affection>=25)note(cast[id].name+' trusts you more. A new bond story is available.');if(previous<50&&r.affection>=50)note(cast[id].name+' has opened up to you.');if(previous<75&&r.affection>=75)note(cast[id].name+' wants to spend a special day with you.');if(previous<100&&r.affection>=100)note(cast[id].name+' has reached maximum affection!');if(why)note(cast[id].name+' affection +'+(r.affection-previous)+' ('+why+').');autoSave()}
function scene(id,title,paragraphs,actions=''){
const c=cast[id],p=member(id);if(!c||!p)return;
const portrait=window.elariaPortraitTag?.(id,c.gender,p.race,c.name,'dialogue-portrait')||'';
modal('<div class="bond-scene"><div class="bond-scene-hero">'+portrait+'<div><small>✦ COMPANION STORY ✦</small><h2>'+escapeHtml(title)+'</h2><p>'+escapeHtml(c.name)+' · '+escapeHtml(stage(relation(id).affection))+'</p></div></div>'+paragraphs.map(text=>'<p>'+escapeHtml(text)+'</p>').join('')+'<div class="bond-actions">'+(actions||'<button onclick="closeModal()">Continue</button>')+'</div></div>');
}
function talk(id){
if(battle||!member(id)||!cast[id])return;
const r=relation(id),c=cast[id],now=Date.now();
const topics={
kael:['“The way you move in battle is changing,” Kael says, adjusting the strap on his sword. “I notice these things.”','“When this is over, I want to see the world without a sword drawn,” he admits.'],
lilia:['Lilia tucks a loose strand of hair behind her ear. “Healing is easier than asking for help. I am trying to learn the second one.”','“The moonflowers only bloom when someone keeps a promise,” she says, offering you one.'],
seren:['Seren hums a song with no known composer. “Sometimes I think the stars are listening to us.”','“A good song needs someone willing to hear its unfinished verse,” she says.'],
brann:['“HA! A meal tastes twice as good when the crew is all here!” Brann offers you the largest portion.','Brann falls quiet. “You ever think the bravest thing is to admit you are afraid?”'],
selene:['“I do not speak much,” Selene says, polishing her blade. “But I listen to every word you say.”','“I am tired of being compared to a person I never became,” Selene admits.'],
pippa:['“I wrote a new chorus!” Pippa beams. “You are in it, but I promise I used a flattering rhyme!”','“When the crowd goes home, I sometimes forget how to be quiet,” Pippa says. “Thanks for staying.”']
};
const idx=r.affection>=50?1:0;
if(now-r.talkAt>120000){r.talkAt=now;gainAffection(id,3,'conversation')}
else note('You have already shared a meaningful conversation recently.');
scene(id,c.name+' — A Moment Together',[topics[id][idx],r.affection>=75?'The trust between you changes the meaning of every pause.':'There is still much you have not learned about each other.'],'<button onclick="elariaBondMenu(\''+id+'\')">More interactions</button><button onclick="closeModal()">Leave</button>');
}
function buyGift(id){const g=gifts[id];if(!g||!state||battle||state.gold<g.cost){note('Not enough gold for this gift.');return}state.gold-=g.cost;state.inv[id]=(state.inv[id]||0)+1;note('Purchased '+g.name+'.');render();autoSave();window.elariaGiftShop()}
function gift(id,giftId){if(!member(id)||!gifts[giftId]||count(giftId)<1||battle)return;consume(giftId);const c=cast[id],bonus=c.gift===giftId?16:giftId==='seaglass'?6:9;gainAffection(id,bonus,'gift');scene(id,c.name+' — A Thoughtful Gift',[c.gift===giftId?'Their eyes brighten. “You remembered what I like. I did not think anyone noticed.”':'They accept your present with a warm smile. “You thought of me. That means more than the gift.”','Affection +'+bonus+'.']);render();autoSave()}
window.elariaGiftShop=function(){
if(!state||battle)return;
modal('<div class="bond-scene"><h2>🎁 Gift Boutique</h2><p>Purchase gifts using gold, then give them to companions through their relationship menu.</p>'+Object.entries(gifts).map(([id,g])=>'<button onclick="elariaBuyGift(\''+id+'\')">'+escapeHtml(g.name)+' — '+g.cost+' G</button>').join('')+'<button onclick="closeModal()">Close</button></div>');
};
window.elariaBuyGift=buyGift;
window.elariaGift=gift;
function routeScene(id,kind){
const c=cast[id],r=relation(id);if(!c||!member(id)||battle)return;
const isRomance=romance(id);
const p=hero();
const settings={kael:'the training field beneath the evening stars',lilia:'a moonflower garden behind the chapel',seren:'the festival stage after the lanterns are extinguished',brann:'a quiet fishing pier with a table set for two',selene:'the cliffs where moonlight turns the sea silver',pippa:'the empty festival stage beneath a canopy of paper stars'};
if(kind==='bond1'){
if(r.affection<25||r.scenes.bond1)return;
r.scenes.bond1=true;gainAffection(id,5);
scene(id,c.name+' — The First Promise',[c.story,'You listen without interrupting. '+c.name+' realizes that you see a person, not simply a useful fighter.','“Thank you for staying,” they say.']);render();return;
}
if(kind==='bond2'){
if(r.affection<50||!r.scenes.bond1||r.scenes.bond2)return;
r.scenes.bond2=true;gainAffection(id,5);
scene(id,c.name+' — What the Stars Remember',['A strange echo of the fallen star reveals a life in which your paths never crossed.',c.name+' turns away from the vision. “I do not want a future chosen for me by an echo. I choose the people standing beside me.”',isRomance?'Their hand brushes yours. Neither of you pulls away.':'You clasp hands as comrades, sealing a promise to protect one another.']);render();return;
}
if(kind==='date'){
if(!isRomance||r.affection<75||!r.scenes.bond2||r.scenes.date)return;
r.scenes.date=true;gainAffection(id,7);
scene(id,c.name+' — A Day Beyond the Battle',['You invite '+c.name+' to '+settings[id]+'.','For once, neither of you needs to fight, lead or save anyone. You speak about ordinary things: favorite foods, childhood dreams, the place you might call home.','As evening falls, '+c.name+' smiles. “I could get used to days like this. Especially with you.”']);render();return;
}
if(kind==='friendship'){
if(isRomance||r.affection<75||!r.scenes.bond2||r.scenes.friendship)return;
r.scenes.friendship=true;gainAffection(id,7);
scene(id,c.name+' — A Friendship Beyond Fate',['You spend a peaceful afternoon with '+c.name+' at '+settings[id]+'.','“There are people you fight beside,” they say, “and people who make the fight worth surviving. You are both.”','Together you vow to remain friends, whatever timelines may bring.']);render();return;
}
if(kind==='confession'){
if(!isRomance||r.affection<100||!r.scenes.date||r.scenes.confession)return;
scene(id,c.name+' — Words Under the Stars',['The sea is still. '+c.name+' asks to speak with you alone.','“When the world was falling apart, you became the one place I wanted to return to. I love you. Not because fate demanded it, but because I choose you.”','Your answer will define this relationship.'],'<button onclick="elariaConfess(\''+id+'\',true)">“I love you too.”</button><button onclick="elariaConfess(\''+id+'\',false)">“I treasure you as a friend.”</button>');return;
}
if(kind==='friendReward'){
if(isRomance||r.affection<100||!r.scenes.friendship||r.scenes.reward)return;
r.scenes.reward=true;
const itemId='bondrelic_'+id;
items[itemId]={name:c.name+'’s Oath Relic',type:'accessory',atk:10,def:8,spd:12};
state.inv[itemId]=(state.inv[itemId]||0)+1;
scene(id,c.name+' — The Unbroken Oath',['“Whatever comes next, you can count on me,” '+c.name+' says, placing a keepsake in your hands.','Friendship reward: '+items[itemId].name+' (ATK +10, DEF +8, SPD +12).']);
render();autoSave();return;
}
}
window.elariaBondScene=routeScene;
window.elariaConfess=function(id,accept){
const r=relation(id);if(!r||!romance(id)||r.affection<100||!r.scenes.date||r.scenes.confession)return;
r.scenes.confession=true;r.lover=!!accept;
scene(id,accept?cast[id].name+' — Two Hearts, One Journey':cast[id].name+' — A Promise of Friendship',[accept?'“Then let the stars remember this moment,” '+cast[id].name+' whispers. “We face every tomorrow together.”':'“Thank you for telling me the truth,” '+cast[id].name+' says. “Our friendship is precious, too.”',accept?'When your lover is in the active party, the whole party gains +8% ATK and +8% DEF.':'Your bond remains strong, though it is not romantic.']);
render();autoSave();
};
function menu(id){
if(!state||battle||!member(id)||!cast[id])return;
const c=cast[id],r=relation(id),p=member(id),isRomance=romance(id);
const image=window.elariaPortraitTag?.(id,c.gender,p.race,c.name,'bond-portrait')||'';
const options=Object.keys(gifts).filter(key=>count(key)>0).map(key=>'<button onclick="elariaGift(\''+id+'\',\''+key+'\')">Give '+escapeHtml(gifts[key].name)+' ×'+count(key)+'</button>').join('');
const story=(r.affection>=25&&!r.scenes.bond1?'<button onclick="elariaBondScene(\''+id+'\',\'bond1\')">First Bond Story</button>':'')+(r.affection>=50&&r.scenes.bond1&&!r.scenes.bond2?'<button onclick="elariaBondScene(\''+id+'\',\'bond2\')">Trust Story</button>':'')+(r.affection>=75&&r.scenes.bond2&&!r.scenes.date&&!r.scenes.friendship?'<button onclick="elariaBondScene(\''+id+'\',\''+(isRomance?'date':'friendship')+'\')">'+(isRomance?'Date Story':'Friendship Story')+'</button>':'')+(r.affection>=100&&isRomance&&r.scenes.date&&!r.scenes.confession?'<button onclick="elariaBondScene(\''+id+'\',\'confession\')">Confession Story</button>':'')+(r.affection>=100&&!isRomance&&r.scenes.friendship&&!r.scenes.reward?'<button onclick="elariaBondScene(\''+id+'\',\'friendReward\')">Claim Friendship Reward</button>':'');
modal('<div class="bond-scene"><div class="bond-scene-hero">'+image+'<div><small>✦ RELATIONSHIP ✦</small><h2>'+escapeHtml(c.name)+'</h2><p>'+escapeHtml(p.race||'')+' · '+escapeHtml(p.cl||'')+'</p><p>'+escapeHtml(stage(r.affection))+(r.lover?' 💗 Lover':'')+'</p><div class="bond-meter"><span style="width:'+r.affection+'%"></span></div><small>Affection '+r.affection+'/100 · '+(isRomance?'Romance possible':'Friendship route')+'</small></div></div><p>'+escapeHtml(c.story)+'</p><div class="bond-actions"><button onclick="elariaBondTalk(\''+id+'\')">💬 Talk</button><button onclick="elariaGiftShop()">🎁 Buy Gifts</button>'+story+options+'<button onclick="closeModal()">Close</button></div></div>');
}
window.elariaBondMenu=menu;window.elariaBondTalk=talk;
window.elariaPartyTalk=function(){
if(!state||battle)return;
const companions=(state.party||[]).filter(p=>cast[p.id]);
modal('<div class="bond-scene"><h2>💞 Companions & Bonds</h2><p>Speak to companions while exploring, offer gifts and unlock their personal stories. Fighting together builds affection.</p><div class="bond-roster">'+companions.map(p=>'<button onclick="elariaBondMenu(\''+p.id+'\')">'+(window.elariaPortraitTag?.(p.id,cast[p.id].gender,p.race,p.name,'bond-roster-portrait')||'')+'<span>'+escapeHtml(p.name)+'<small>'+relation(p.id).affection+'/100 · '+escapeHtml(stage(relation(p.id).affection))+'</small></span></button>').join('')+'</div><button onclick="elariaGiftShop()">🎁 Gift Boutique</button><button onclick="closeModal()">Close</button></div>');
};
const baseVictory=victory;
victory=function(){
const active=battle?members().filter(p=>p.id!=='hero'&&p.hp>0&&cast[p.id]).map(p=>p.id):[];
baseVictory();
if(!state)return;
for(const id of active){const r=relation(id);r.battles++;gainAffection(id,2,'fought together')}
};
const baseStats=stats;
stats=function(p){
const s=baseStats(p);
if(!state||!p||!members().some(x=>x.id===p.id))return s;
const lovers=members().filter(x=>x.id!=='hero'&&x.hp>0&&relation(x.id)?.lover);
if(lovers.length){s.atk=Math.round(s.atk*1.08);s.def=Math.round(s.def*1.08)}
return s;
};
const baseRender=render;
render=function(){
if(!state)return;
baseRender();
let controls=document.getElementById('elariaBondsButton');
if(!controls){controls=document.createElement('button');controls.id='elariaBondsButton';controls.textContent='💞 Talk to Party / Affection';controls.onclick=window.elariaPartyTalk;document.getElementById('controls').appendChild(controls)}
let strip=document.getElementById('elariaTurnPortraits');
if(!strip){strip=document.createElement('div');strip.id='elariaTurnPortraits';document.getElementById('battleTitle').after(strip)}
if(battle){
const active=members().filter(p=>p.hp>0);
strip.innerHTML=active.map(p=>'<div class="turn-portrait '+(battle.turn===p.id?'turn-active':'')+'">'+(window.elariaPortraitTag?.(p.id,p.gender,p.race,p.name)||'')+'<span>'+escapeHtml(p.name)+'</span></div>').join('');
}else strip.innerHTML='';
};
const baseModal=modal;
modal=function(html){
baseModal(html);
const dialog=document.getElementById('dialog');
if(!dialog||!state)return;
if(dialog.querySelector?.('.bond-scene'))return;
const text=dialog.textContent||'';
const candidates=[...Object.values(cast).map(c=>c.name),'Elder Mira','Mayor Corven','Neriel','Orin'];
const found=candidates.find(name=>text.includes(name));
if(!found)return;
const id=Object.keys(cast).find(key=>cast[key].name===found);
const avatar=window.elariaPortraitTag?.(id||'hero',id?cast[id].gender:hero().gender,id?member(id)?.race:hero().race,found,'dialogue-portrait');
if(!avatar)return;
const wrapper=document.createElement('div');wrapper.className='anime-dialogue-header';wrapper.innerHTML=avatar+'<span>'+escapeHtml(found)+'</span>';
dialog.prepend(wrapper);
};
if(state)render();
})();