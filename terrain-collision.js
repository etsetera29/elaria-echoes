/* Shared terrain collision. The same tile tests are used for movement and roaming mobs. */
(function(){
'use strict';
const previousWalls=walls;
const gates={forest:[[0,6],[19,10],[16,3]],tidehaven:[[1,6],[18,6]],sunshore:[[1,6],[18,6],[15,5]],saltcave:[[1,6],[18,6],[15,7],[6,3],[10,4],[14,9]],abyssalheart:[[1,6],[16,6]]};
function nearGate(zone,x,y){return (gates[zone]||[]).some(([a,b])=>Math.abs(x-a)+Math.abs(y-b)<=1)}
function terrainBlocked(zone,x,y){
if(x<0||y<0||x>=W||y>=H)return true;
if(nearGate(zone,x,y))return false;
if(zone==='forest'){
// Forest trees are painted by draw() whenever rand(x,y) > .79.
return rand(x,y)>.79;
}
if(zone==='village'){
// Paths and buildings remain accessible; the outer fence is handled by previousWalls.
return false;
}
if(zone==='sunshore')return y<3; // Deep water, unlike the walkable beach.
if(zone==='saltcave'||zone==='abyssalheart')return rand(x+11,y+29)>.88; // Sharp crystals visible on the floor.
return false;
}
walls=function(x,y){
if(previousWalls(x,y))return true;
return terrainBlocked(state.zone,x,y);
};
const previousMove=move;
move=function(dx,dy){
if(!state||battle)return;
const x=state.x+dx,y=state.y+dy;
if(walls(x,y))return;
previousMove(dx,dy);
};
const previousMobCell=mobCell;
mobCell=function(zone,used){
for(let i=0;i<400;i++){
const x=1+Math.floor(Math.random()*18),y=1+Math.floor(Math.random()*11);
if(terrainBlocked(zone,x,y)||used.some(m=>m.x===x&&m.y===y))continue;
if(zone===state.zone&&Math.abs(x-state.x)+Math.abs(y-state.y)<4)continue;
if(zone==='moonfall'&&Math.abs(x-15)+Math.abs(y-5)<3)continue;
return {x,y};
}
return previousMobCell(zone,used);
};
roamMobs=function(){
if(!state||battle||!MOB_ZONES.includes(state.zone))return;
ensureMobs(state.zone);
const mobs=state.worldMobs[state.zone];
for(const m of mobs){
const distance=Math.abs(m.x-state.x)+Math.abs(m.y-state.y);
let options=[];
if(distance<=3){
const dx=Math.sign(state.x-m.x),dy=Math.sign(state.y-m.y);
options=Math.abs(state.x-m.x)>=Math.abs(state.y-m.y)?[[dx,0],[0,dy]]:[[0,dy],[dx,0]];
}else{
options=[[1,0],[-1,0],[0,1],[0,-1],[0,0]].sort(()=>Math.random()-.5);
}
for(const [dx,dy] of options){
const x=m.x+dx,y=m.y+dy;
if(x<1||x>18||y<1||y>11||terrainBlocked(state.zone,x,y)||mobs.some(other=>other!==m&&other.x===x&&other.y===y))continue;
m.x=x;m.y=y;break;
}
}
const contact=mobs.find(m=>m.x===state.x&&m.y===state.y||Math.abs(m.x-state.x)+Math.abs(m.y-state.y)<=1);
if(contact){
const type=contact.type,idx=mobs.indexOf(contact);
mobs.splice(idx,1);
const cell=mobCell(state.zone,mobs);
mobs.push({...cell,type:mobType(state.zone),uid:'mob'+Math.floor(Math.random()*1e9)});
startBattle(type);
}
};
const previousEnsure=ensureMobs;
ensureMobs=function(zone){
previousEnsure(zone);
const mobs=state?.worldMobs?.[zone];if(!mobs)return;
for(let i=0;i<mobs.length;i++){
const m=mobs[i];
if(terrainBlocked(zone,m.x,m.y)){
const replacement=mobCell(zone,mobs.filter((_,j)=>j!==i));
m.x=replacement.x;m.y=replacement.y;
}
}
};
})();
