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
const previousRoam=roamMobs;
roamMobs=function(){
if(!state||battle)return;
const zone=state.zone;
if(!state.worldMobs?.[zone]){previousRoam();return}
const mobs=state.worldMobs[zone];
const before=mobs.map(m=>({x:m.x,y:m.y}));
previousRoam();
for(const m of mobs){
const original=before.find((_,i)=>mobs[i]===m);
if(original&&terrainBlocked(zone,m.x,m.y)){m.x=original.x;m.y=original.y}
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
