/* Collectible story CGs and title screen. Saved separately from adventure progress. */
(function(){
'use strict';
const KEY='elaria-cg-gallery-v1';
const cast={
kael:['Kael','Moonlit Promise','#374967','#d7a66d'],
lilia:['Lilia','Moonflower Oath','#bdc6f0','#ec9bc5'],
seren:['Seren','A Song for Tomorrow','#b96b9a','#f5d39a'],
brann:['Brann','Harbor Hearts','#956f51','#f4b775'],
selene:['Selene','Silver Sea Confession','#b6c4ed','#92b9ec'],
pippa:['Pippa','Sunset Serenade','#ed91b3','#ffd4a2']
};
const entries=[
...Object.entries(cast).flatMap(([id,[name,title]])=>[
{id:id+'-date',name:name+' · '+title,category:'Romance',character:id,match:new RegExp('^'+name+' — A Day Beyond the Battle$')},
{id:id+'-confession',name:name+' · Two Hearts, One Journey',category:'Romance',character:id,match:new RegExp('^'+name+' — Two Hearts, One Journey$')},
{id:id+'-friendship',name:name+' · Unbreakable Friendship',category:'Side Story',character:id,match:new RegExp('^'+name+' — (A Friendship Beyond Fate|The Unbroken Oath|A Promise of Friendship)$')}
]),
{id:'fallen-star',name:'The Star That Wept',category:'Main Story',match:/Chapter One: The Star That Wept|fallen star.*forest/i},
{id:'moonfall',name:'The Moonfall Warden',category:'Main Story',match:/Moonfall Warden|Moonfall Ruins|Warden.*defeat/i},
{id:'drowned-heart',name:'The Drowned Heart',category:'Main Story',match:/Drowned Heart|Abyssal Herald|Leviathan of Forgotten Years/i},
{id:'festival',name:'Lanterns of the Festival',category:'Main Story',match:/Festival Epilogue|Festival of|festival finale/i},
{id:'harbor',name:'First Light at Tidehaven',category:'Side Story',match:/Tidehaven Harbor|arriv.*harbor/i},
{id:'crypt',name:'Secrets Beneath the Crypt',category:'Side Story',match:/Crypt Archive|crypt.*secret/i},
{id:'shore',name:'The Sunshore Sunset',category:'Side Story',match:/Sunshore Beach|beach.*sunset/i}
];
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function unlocked(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function mark(id){const all=unlocked();if(all[id])return false;all[id]=Date.now();localStorage.setItem(KEY,JSON.stringify(all));return true}
function sceneArt(entry){
const c=cast[entry.character],romance=entry.category==='Romance',main=entry.category==='Main Story';
const hair=c?.[2]||'#d5e4fa',accent=c?.[3]||'#b1e1ff';
const sky=main?'#172b66':romance?'#4a315c':'#254b67';
const moon=romance?'#ffdcbb':'#d4f0ff';
const figure=(x,y,hairColor,coat,flip=false)=>'<g transform="translate('+x+' '+y+') scale('+(flip?'-1':'1')+' 1)"><path d="M-58 196Q-76 75 -32 64L33 64Q79 90 66 196Z" fill="'+coat+'" stroke="#e2d7e6" stroke-opacity=".4" stroke-width="2"/><path d="M-38 95Q-65 45 -43 -3Q-25 -62 18 -52Q76 -38 48 45L42 115Q28 138 8 100Z" fill="'+hairColor+'"/><ellipse cx="0" cy="4" rx="42" ry="52" fill="#f3c8b5"/><path d="M-46 0Q-52 -53 -9 -59Q39 -65 48 -9L24 -34 3 -18 -18 -35 -43 14Z" fill="'+hairColor+'"/><path d="M-23 5Q-13 -2 -4 6M13 6Q23 -2 31 5" stroke="#414269" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M-4 33Q8 39 17 31" stroke="#bc7180" stroke-width="2.5" fill="none"/><ellipse cx="-30" cy="22" rx="11" ry="6" fill="#e88f9c" opacity=".4"/><path d="M-34 84 3 125 36 84" fill="#fff0dd" opacity=".7"/></g>';
const stars=Array.from({length:42},(_,i)=>{const x=(i*193+73)%960,y=(i*79+31)%290,r=i%4===0?2.3:1.2;return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff5df" opacity="'+(.25+(i%5)*.14)+'"/>'}).join('');
const city=Array.from({length:24},(_,i)=>{const x=i*43,h=35+(i*29)%90;return '<path d="M'+x+' 435v-'+h+'h33v'+h+'" fill="#122b4b"/><rect x="'+(x+11)+'" y="'+(435-h+18)+'" width="5" height="9" fill="#f6d28d"/>'}).join('');
const scenery=entry.id==='drowned-heart'||entry.id==='crypt'?'<path d="M0 460Q120 240 210 380Q300 180 420 365Q550 160 690 355Q810 205 960 400V540H0Z" fill="#143451" opacity=".85"/><path d="M150 430V155h56v275M680 430V100h70v330" stroke="#8ab7d4" stroke-width="20" opacity=".5"/>':entry.id==='fallen-star'?'<path d="M0 430 250 315 410 430 650 300 960 430V540H0Z" fill="#173d53"/><path d="m480 85-65 210 85-55 32 120 45-190-80 30Z" fill="#a3e5ff" opacity=".85"/>':'<path d="M0 390Q160 330 310 405T640 390T960 405V540H0Z" fill="#284d67"/>'+city;
const characters=main?figure(465,260,'#b9c6ed','#314978'):romance?figure(345,285,'#333c64','#334d79')+figure(615,275,hair,'#765c86',true):figure(385,295,'#343e64','#42688a')+figure(610,285,hair,'#725c88',true);
const petals=Array.from({length:15},(_,i)=>'<ellipse cx="'+((i*97+31)%960)+'" cy="'+((i*131+65)%510)+'" rx="9" ry="4" transform="rotate('+(i*27)+' '+((i*97+31)%960)+' '+((i*131+65)%510)+')" fill="'+accent+'" opacity=".65"/>').join('');
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="#a56f82"/></linearGradient><radialGradient id="glow"><stop stop-color="'+moon+'" stop-opacity=".55"/><stop offset="1" stop-color="'+moon+'" stop-opacity="0"/></radialGradient></defs><rect width="960" height="540" fill="url(#sky)"/>'+stars+'<circle cx="740" cy="140" r="165" fill="url(#glow)"/><circle cx="740" cy="140" r="65" fill="'+moon+'"/>'+scenery+'<path d="M0 452Q230 420 480 456T960 446V540H0Z" fill="#102943" opacity=".7"/>'+characters+petals+'<rect y="450" width="960" height="90" fill="#09192c" opacity=".75"/><text x="480" y="488" text-anchor="middle" fill="#ffe8bd" font-family="Georgia,serif" font-size="28">'+safe(entry.name).replace(/&/g,'&amp;')+'</text><text x="480" y="517" text-anchor="middle" fill="#d9e8f7" font-family="Georgia,serif" font-size="15">ELARIA · ECHOES OF THE FALLEN STAR</text></svg>';
return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
/* Prefer the generated anime CG image files; retain SVG art as an offline fallback. */
const CG_BASE='assets/cg/';
function artSource(entry){return CG_BASE+entry.id+'.svg'}
function artImg(entry){return '<img src="'+artSource(entry)+'" data-fallback="'+sceneArt(entry)+'" onerror="this.onerror=null;this.src=this.dataset.fallback" alt="'+safe(entry.name)+'">'}
window.elariaCGArt=sceneArt;
window.elariaCGImage=artSource;
let filter='All';
function gallery(){
const got=unlocked(),list=entries.filter(e=>(filter==='All'||e.category===filter));
let overlay=document.getElementById('elariaGallery');
if(!overlay){overlay=document.createElement('div');overlay.id='elariaGallery';overlay.className='elaria-screen';document.body.appendChild(overlay)}
overlay.innerHTML='<div class="elaria-gallery-panel"><div class="cg-toolbar"><h2>✦ Memory Gallery</h2><button onclick="elariaCloseGallery()">Close</button></div><p>Collected '+entries.filter(e=>got[e.id]).length+' / '+entries.length+' illustrated memories. Unlocked scenes remain in the gallery even after starting a new adventure.</p><div class="cg-filters">'+['All','Main Story','Side Story','Romance'].map(f=>'<button class="'+(filter===f?'active':'')+'" onclick="elariaGalleryFilter(\''+f+'\')">'+f+'</button>').join('')+'</div><div class="cg-grid">'+list.map(e=>'<button class="cg-card" '+(got[e.id]?'onclick="elariaShowCG(\''+e.id+'\')"':'disabled')+'>'+(got[e.id]?artImg(e):'<div class="cg-locked">✦<small>Locked Memory</small></div>')+'<span>'+safe(got[e.id]?e.name:'???')+'</span></button>').join('')+'</div></div>';
}
window.elariaGalleryFilter=f=>{filter=f;gallery()};
window.elariaCloseGallery=()=>document.getElementById('elariaGallery')?.remove();
window.elariaGallery=gallery;
window.elariaShowCG=id=>{
const entry=entries.find(e=>e.id===id);if(!entry||!unlocked()[id])return;
const view=document.createElement('div');view.id='elariaCGView';view.className='elaria-screen cg-view';view.innerHTML='<div class="cg-view-inner">'+artImg(entry)+'<h2>'+safe(entry.name)+'</h2><button onclick="document.getElementById(\'elariaCGView\').remove()">Return to Gallery</button></div>';
document.getElementById('elariaCGView')?.remove();document.body.appendChild(view);
};
function unlockFrom(html){
const holder=document.createElement('div');holder.innerHTML=html;
if(holder.querySelector('.character-hub')||holder.querySelector('.cg-view'))return;
const title=holder.querySelector('h2')?.textContent?.trim()||'';
const plain=holder.textContent||'';
const matches=entries.filter(e=>e.match?.test(title)||(e.category!=='Romance'&&e.match?.test(plain)));
for(const entry of matches){const first=mark(entry.id);if(first)showCollected(entry);const dialog=document.getElementById('dialog');if(dialog&&!dialog.querySelector('.cg-scene-art')){const visual=document.createElement('div');visual.className='cg-scene-art';visual.innerHTML=''+artImg(entry)+'<span>✦ COLLECTIBLE MEMORY · '+safe(entry.name)+'</span>';dialog.prepend(visual)}}
}
function showCollected(entry){
const notice=document.createElement('div');notice.className='cg-notice';notice.innerHTML=''+artImg(entry)+'<div><b>✦ New Memory Collected!</b><small>'+safe(entry.name)+'</small><button>View Illustration</button></div>';
notice.querySelector('button').onclick=()=>{notice.remove();window.elariaShowCG(entry.id)};
document.body.appendChild(notice);
setTimeout(()=>notice.remove(),9000);
}
const originalModal=modal;
modal=function(html){originalModal(html);if(state)unlockFrom(html)};
function mainMenu(){
let el=document.getElementById('elariaMainMenu');
if(!el){el=document.createElement('div');el.id='elariaMainMenu';el.className='elaria-screen elaria-menu';document.body.appendChild(el)}
const hasSave=!!localStorage.getItem('elaria-save-v1');
el.innerHTML='<div class="elaria-menu-content"><span class="menu-kicker">✧ A STORY WRITTEN IN STARS ✧</span><h1>Elaria</h1><p>Echoes of the Fallen Star</p><div class="elaria-menu-actions"><button onclick="elariaStartNew()">New Game</button><button '+(!hasSave?'disabled':'')+' onclick="elariaContinue()">Continue</button><button onclick="elariaGallery()">Gallery</button><button onclick="elariaExit()">Exit</button></div><small>Memories are preserved separately from your saved adventure.</small></div>';
}
window.elariaMainMenu=mainMenu;
window.elariaStartNew=()=>{
if(localStorage.getItem('elaria-save-v1')&&!confirm('Start a new adventure? Your current save will be replaced when you create your hero. Gallery memories will remain.'))return;
document.getElementById('elariaMainMenu')?.remove();if(typeof showCreate==='function')showCreate();
};
window.elariaContinue=()=>{
const raw=localStorage.getItem('elaria-save-v1');if(!raw)return;
try{const loaded=JSON.parse(raw);if(!loaded?.hero||!loaded?.inv)throw Error('bad save');state=loaded;battle=null;document.getElementById('elariaMainMenu')?.remove();closeModal();render()}catch(e){alert('Your save could not be loaded.')}
};
window.elariaExit=()=>{if(state)autoSave();document.getElementById('elariaGallery')?.remove();mainMenu()};
const header=document.querySelector('header');
if(header){const btn=document.createElement('button');btn.textContent='☰ Menu';btn.onclick=()=>{if(state)autoSave();mainMenu()};header.querySelector('div')?.prepend(btn)}
// Replace the automatic load/create overlay with the title screen.
closeModal();mainMenu();
})();