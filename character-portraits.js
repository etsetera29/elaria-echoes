/* Anime-inspired character portraits — SVG bust illustrations generated for each character/race/gender. */
(function(){
'use strict';
const palette={
heroNonbinaryHuman:['#3d455f','#a8a4eb','#e8c5af','#31394b'],heroNonbinaryElf:['#c0c3df','#99b2dc','#efcebb','#404b6b'],heroNonbinaryBeastkin:['#a58b77','#d8b18e','#d9b5a2','#554554'],
heroMaleHuman:['#292f4e','#79a9df','#e7c3a5','#20243c'],
heroFemaleHuman:['#5a344c','#d6a4c9','#f0c8ac','#3b304b'],
heroMaleElf:['#d2d9e8','#7ab6e0','#e8c7b5','#26374c'],
heroFemaleElf:['#bdc9ed','#7bb7e6','#eecdbb','#394367'],
heroMaleBeastkin:['#96745d','#e4b17c','#d2a486','#493629'],
heroFemaleBeastkin:['#d7aa8d','#e4c1b4','#f0c4a9','#6d4c54'],
kael:['#302b38','#73a6db','#e3c2aa','#22263e'],
lilia:['#d3d8e7','#b4a7e7','#f0d3bd','#66668e'],
seren:['#d17b96','#eab6cf','#e8bcae','#804c6d'],
brann:['#a17a54','#d9a16c','#bd9277','#4a3428'],
selene:['#b8c7e8','#89a8e8','#f0d3c9','#303b62'],
pippa:['#b77d71','#eea1bd','#f2c9b3','#70475a']
};
const encode=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
function portrait(id,gender,race){
const key=id==='hero'?'hero'+(gender==='Male'?'Male':gender==='Nonbinary'?'Nonbinary':'Female')+(race||'Human'):id;
const colors=palette[key]||palette.heroFemaleHuman,[hair,iris,skin,coat]=colors;
const beast=key.includes('Beastkin')||id==='brann',elf=key.includes('Elf')||id==='selene';
const masc=gender==='Male'||id==='kael'||id==='brann';
const ear=beast?'<path d="M47 77 31 19 83 57M160 57 196 19 182 87" fill="'+hair+'" stroke="#d8ad88" stroke-width="3"/><path d="M50 67 41 38 74 59M166 61 185 38 176 70" fill="#d6a6ad"/>':elf?'<path d="M61 126 14 96 66 104M153 104 200 96 156 126" fill="'+skin+'" stroke="#ac8d91" stroke-width="2"/>':'';
const emblem=id==='pippa'?'♫':id==='brann'?'✦':id==='selene'?'◆':id==='lilia'?'✧':id==='seren'?'♪':'✦';
const bangs=masc?'M45 97 Q35 36 88 38 L79 70 114 42 125 79 158 51 169 101 Q150 69 131 87 Q108 71 86 95Z':'M44 113 Q30 41 91 36 Q149 24 176 95 L153 78 144 104 117 68 96 99 78 76 65 116Z';
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 252" role="img" aria-label="Anime-style portrait of '+key+'"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#203854"/><stop offset="1" stop-color="#11162d"/></linearGradient><linearGradient id="hair" x2="0" y2="1"><stop stop-color="'+hair+'"/><stop offset="1" stop-color="'+coat+'"/></linearGradient><radialGradient id="glow"><stop stop-color="'+iris+'" stop-opacity=".32"/><stop offset="1" stop-color="'+iris+'" stop-opacity="0"/></radialGradient></defs><rect width="216" height="252" rx="12" fill="url(#bg)"/><circle cx="164" cy="58" r="91" fill="url(#glow)"/><path d="M0 236Q24 185 67 184L84 174 129 174 151 185Q197 185 216 236V252H0Z" fill="'+coat+'" stroke="#c9ad81" stroke-width="2"/><path d="M82 175 108 217 134 175 121 159 94 159Z" fill="#e9d9ca"/><path d="M62 78 Q66 27 112 27 Q167 29 168 93 L178 192 143 183 137 75 77 75 70 183 36 194Z" fill="url(#hair)"/>'+ear+'<path d="M62 103 Q57 64 106 57 Q159 59 159 105 L154 145 Q141 174 110 180 Q78 176 67 145Z" fill="'+skin+'" stroke="#ba968c" stroke-width="1.5"/><path d="M74 112Q88 103 102 114M121 114Q136 102 150 112" fill="none" stroke="'+coat+'" stroke-width="3" stroke-linecap="round"/><ellipse cx="88" cy="122" rx="11" ry="13" fill="#f7f6fb"/><ellipse cx="135" cy="122" rx="11" ry="13" fill="#f7f6fb"/><ellipse cx="90" cy="123" rx="7" ry="10" fill="'+iris+'"/><ellipse cx="133" cy="123" rx="7" ry="10" fill="'+iris+'"/><circle cx="92" cy="119" r="3" fill="#fff"/><circle cx="135" cy="119" r="3" fill="#fff"/><path d="M110 130 107 142 115 143" stroke="#ba8c86" stroke-width="1.6" fill="none"/><path d="M100 154 Q111 '+(id==='pippa'||id==='seren'?164:158)+' 122 153" fill="none" stroke="#a76572" stroke-width="2.2" stroke-linecap="round"/><path d="'+bangs+'" fill="url(#hair)" stroke="'+hair+'" stroke-width="2"/><path d="M68 180 86 212 108 225 92 252 50 252 30 207Z" fill="'+coat+'" stroke="#a9958d" stroke-width="2"/><path d="M149 181 131 212 108 225 126 252 165 252 184 208Z" fill="'+coat+'" stroke="#a9958d" stroke-width="2"/><circle cx="108" cy="228" r="12" fill="#e8d3a0" stroke="#8c7d7a" stroke-width="2"/><text x="108" y="234" text-anchor="middle" font-size="15" fill="#36435f">'+emblem+'</text><path d="M7 7H40M7 7V40M209 7H176M209 7V40M7 245H40M7 245V212M209 245H176M209 245V212" stroke="#e9d6a3" stroke-opacity=".7" stroke-width="2" fill="none"/></svg>';
return encode(svg);
}
window.elariaPortrait=portrait;
window.elariaPortraitTag=function(id,gender,race,label,extra=''){
const src=portrait(id,gender,race);
return '<img class="anime-portrait '+extra+'" src="'+src+'" alt="'+String(label||id).replace(/[&<>"]/g,'')+' portrait" loading="lazy">';
};
})();