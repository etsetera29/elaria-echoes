document.getElementById('game').addEventListener('load',async function(){
const doc=this.contentDocument;if(!doc)return;
const link=doc.createElement('link');link.rel='stylesheet';link.href='character-bonds.css';doc.head.appendChild(link);
for(const path of ['character-portraits.js','character-bonds.js','bond-story-variations.js','terrain-collision.js','small-face-icons.js']){
await new Promise((resolve,reject)=>{
const el=doc.createElement('script');el.src=path;el.onload=resolve;el.onerror=reject;doc.body.appendChild(el);
});
}
});