/* Bond-aware story variations: append personal scenes to the Tidebound saga. */
(function(){
'use strict';
const baseArcEnd=window.arc2End;
if(typeof baseArcEnd==='function')window.arc2End=function(choice){
const relationships=state?.relationships||{};
const beloved=state.party.filter(p=>relationships[p.id]?.lover);
const friends=state.party.filter(p=>relationships[p.id]?.affection>=75&&!relationships[p.id]?.lover);
baseArcEnd(choice);
if(!state?.arc2?.choices?.ending)return;
const lines=[];
if(beloved.length)lines.push(beloved.map(p=>p.name).join(' and ')+' clasp your hand at the shore. “No timeline can undo what we chose together.”');
if(friends.length)lines.push(friends.map(p=>p.name).join(' and ')+' promise to keep the names of the lost alive.');
if(!lines.length)return;
const dialog=document.getElementById('dialog');if(!dialog)return;
const p=document.createElement('p');p.className='bond-epilogue';p.textContent=lines.join(' ');
dialog.appendChild(p);
};
const baseArcFestival=window.arc2Festival;
if(typeof baseArcFestival==='function')window.arc2Festival=function(choice){
const relationships=state?.relationships||{};
const close=state.party.filter(p=>relationships[p.id]?.affection>=50);
baseArcFestival(choice);
if(!close.length)return;
const p=document.createElement('p');p.className='bond-epilogue';
p.textContent=close[0].name+' notices the fear in your eyes and stands at your side. Their trust gives you the courage to face the consequences of your decision.';
document.getElementById('dialog')?.appendChild(p);
};
})();