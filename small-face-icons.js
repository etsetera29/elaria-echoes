/* Reuse existing anime portraits as small character face icons. */
(function(){
'use strict';
const baseRender=render;
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function refreshFaces(){
if(!state||!window.elariaPortrait)return;
const roster=members();
const panel=document.getElementById('party');
if(panel){
const old=panel.querySelector('#elariaSmallFaces');
if(old)old.remove();
const bar=document.createElement('div');bar.id='elariaSmallFaces';bar.className='elaria-small-faces';
bar.innerHTML=roster.map(p=>'<div class="elaria-small-face" title="'+escapeHtml(p.name)+'"><img src="'+window.elariaPortrait(p.id,p.gender,p.race)+'" alt="'+escapeHtml(p.name)+'" loading="lazy"><span>'+escapeHtml(p.name)+'</span></div>').join('');
panel.prepend(bar);
}
const stage=document.getElementById('combatStage');
if(stage&&battle){
stage.querySelectorAll('.fighter[data-combat-id]').forEach(f=>{
const p=roster.find(x=>x.id===f.getAttribute('data-combat-id'));
if(!p)return;
const head=f.querySelector('.head');
if(!head)return;
head.style.backgroundImage='url("'+window.elariaPortrait(p.id,p.gender,p.race)+'")';
head.style.backgroundSize='cover';
head.style.backgroundPosition='center 23%';
head.classList.add('anime-face-icon');
});
}
}
render=function(){baseRender();refreshFaces()};
if(state)refreshFaces();
})();