/* Elaria — Arc II: The Tide That Remembers. Narrative and world data. */
window.ARC2={
places:{
tidehaven:{name:'Tidehaven Harbor',biome:'town',entry:[2,6],mapColor:'#426b80',icon:'⚓'},
sunshore:{name:'Sunshore Beach',biome:'beach',entry:[2,6],mapColor:'#4b99b7',icon:'🏖️'},
saltcave:{name:'Saltglass Cavern',biome:'cave',entry:[2,6],mapColor:'#426a78',icon:'🪸'},
abyssalheart:{name:'The Drowned Heart',biome:'deep',entry:[2,6],mapColor:'#152b58',icon:'🌊'}
},
chapters:[
{title:'VIII — A Letter Written in Salt',scene:'The sea carries a letter to Asteria with no sender, only a royal seal burned into its wax. Elder Mira recognizes the mark of the Tidebound Compact, the fleet that sailed away before Elaria fell. Its ships were never seen again. Yet the letter is dated tomorrow.',objective:'Reach Tidehaven Harbor by taking the southern coastal trail from Whisperleaf Forest.',voice:'The voice that sounds like your own whispers: “We found them too late in my world.”'},
{title:'IX — The Harbor That Forgot Its Dead',scene:'Tidehaven is a town built from wreckage. Each dawn the tide brings back the same broken ships, and each dusk their names disappear from the harbor registry. Mayor Corven claims the sea is simply cruel. The keeper of the lighthouse says the town made a bargain and forgot the price.',objective:'Speak to Mayor Corven, then inspect the tide ledger at the harbor.',voice:'A line in the ledger has your handwriting. You have never been here.'},
{title:'X — Three Oaths at the Waterline',scene:'Brann, a boisterous Beastkin guardian, challenges you to protect fishers from the Reefbreaker. Selene, an Elf swordswoman with the calm of winter, searches for the officer who abandoned her crew. Pippa, a cheerful Human idol, sings for the names the town refuses to remember. Their stories disagree about who started the curse.',objective:'Earn the trust of Brann, Selene and Pippa. Defeat the Reefbreaker field boss on Sunshore Beach.',voice:'The sea answers Pippa’s song with three voices, one of them yours.'},
{title:'XI — The Festival of Borrowed Names',scene:'The Moonwake Festival begins. Every lantern bears a name of someone lost at sea, but several lanterns bear the names of living townsfolk. Mayor Corven orders them extinguished. Pippa refuses; Selene recognizes the names as soldiers from a battle that never occurred; Brann remembers a ship that history says never existed.',objective:'Choose whether to expose the mayor’s ledger or protect the townspeople from panic.',voice:'“There are timelines where the town never existed,” your reflection says in a rain-filled window.'},
{title:'XII — The Cave of Singing Glass',scene:'Beneath Sunshore Beach, saltglass formations preserve sounds as if they were trapped insects. The cave repeats the last words of sailors lost centuries ago. Selene finds a command in her own voice, ordering a fleet to sail into the storm. The order was given before she was born.',objective:'Enter Saltglass Cavern and recover three Echo Pearls from the cave’s guardians.',voice:'The deeper you descend, the more often your other self finishes your sentences.'},
{title:'XIII — The Compact Beneath the Waves',scene:'The pearls reveal the truth: the Tidebound Compact did not flee Elaria. It tried to carry thousands of refugees beyond the falling star’s reach. A sea spirit offered safe passage in exchange for their memories. The Compact accepted, and the sea has collected the debt from every generation since.',objective:'Confront the lighthouse keeper’s testimony and decide what truth the town deserves.',voice:'“I made the opposite choice,” the other you confesses. “That is why my ocean has no shore.”'},
{title:'XIV — The Door That Opens at Low Tide',scene:'At the deepest cave, a black cathedral lies upside down beneath a ceiling of water. The field boss’s shattered shell is a key. The sea spirit’s herald waits among the drowned banners, offering to return every stolen memory if you surrender the names of your companions.',objective:'Defeat the Abyssal Herald and open the way to the Drowned Heart.',voice:'You hear yourself pleading from beyond the door: “Do not let it learn our true name.”'},
{title:'XV — The Tide That Remembers',scene:'The Leviathan of Forgotten Years rises from the abyss, not as a beast but as a living archive of every life the sea has taken. The names it carries include people you have never met, battles that never happened, and versions of yourself who failed. It calls you the Unmoored: a soul that persists when timelines break. The sea demands an ending.',objective:'Defeat the Leviathan, then choose whether to free the stolen memories or bind them safely in the lighthouse.',voice:'In the final wave you see another you on a distant shore, watching the same stars. Neither of you looks away.'}
],
sideStories:[
{id:'lantern',name:'The Lantern Without a Name',npc:'pippa',start:3,steps:['A blank lantern drifts into Pippa’s hands. She asks you to find who it belongs to.','The keeper claims it belongs to a child erased from the registry. Mayor Corven insists no such child existed.'],choices:[['Give the lantern to the lighthouse','Return the lantern to the family']],ends:['The lighthouse shines brighter, but a family forgets why they were grieving.','A mother remembers her daughter’s laugh. The lighthouse grows a little darker.']},
{id:'anchor',name:'An Anchor for the Living',npc:'brann',start:3,steps:['Brann’s old ship anchor has been found buried beneath a fisher’s home.','The anchor belonged to a ship that sailed in a timeline Brann cannot remember.'],choices:[['Keep the anchor as evidence','Melt it into protective charms']],ends:['Brann vows to discover who rewrote his voyage.','Brann distributes charms to the fishing crews, who survive the next storm.']},
{id:'duel',name:'The Blade That Never Drew',npc:'selene',start:3,steps:['Selene challenges a shadow on the water to a duel.','The shadow bears her insignia and remembers an order she never gave.'],choices:[['Confront the phantom','Lay the blade at the memorial']],ends:['Selene accepts the burden of an alternate self’s mistake.','Selene refuses to let a borrowed memory define her honor.']},
{id:'medicine',name:'A Cure in Bitter Water',npc:'merchant',start:2,steps:['The apothecary needs salt moss for a cure.','The medicine works, but its patients remember dreams that belong to other people.'],choices:[['Distribute the medicine freely','Study its strange memories first']],ends:['The town recovers quickly, and the dreams spread.','The cure takes longer, but the apothecary learns to filter the echoes.']},
{id:'bells',name:'The Bells Under the Sand',npc:'mayor',start:4,steps:['At low tide the buried church bells ring without moving.','The bells mark the hour the Tidebound Compact made its bargain.'],choices:[['Ring them openly','Bury them once more']],ends:['The town gathers and begins telling its forgotten history.','The town sleeps peacefully, unaware of the warning.']},
{id:'coral',name:'The Smith and the Singing Ore',npc:'smith',start:5,steps:['A strange metal sings when struck by a hammer.','The smith discovers the ore remembers the shape of weapons from other timelines.'],choices:[['Forge a ceremonial blade','Forge shields for the harbor']],ends:['The blade is placed in the town archive as a warning.','The harbor watch receives shields made from the singing ore.']},
{id:'choir',name:'A Song for the Unreturned',npc:'pippa',start:6,steps:['Pippa hears an invisible choir beneath the surf.','Its final verse is missing, and every attempt to sing it changes the weather.'],choices:[['Complete the song','Let the final verse remain silent']],ends:['The missing sailors are remembered in every household.','The choir fades, and the sea grows calm for a single night.']},
{id:'oath',name:'The Captain Who Stayed',npc:'brann',start:6,steps:['Brann finds the last orders of his vanished captain.','The orders commanded the crew to save the refugees even at the cost of their ship.'],choices:[['Honor the captain publicly','Keep the captain’s sacrifice private']],ends:['A new generation swears to defend Tidehaven.','Brann keeps the captain’s memory alive among those who sailed with him.']}
],
characters:[
{id:'brann',name:'Brann',race:'Beastkin',cl:'Guardian',gender:'Male',hp:175,atk:15,def:20,spd:75,role:'Tank',icon:'🛡️',intro:'“HAHA! A real adventurer! I’m Brann, and no wave in this world has ever knocked me down twice!”',story:'Brann was captain of the Wavebreaker, a ship the harbor records insist never existed. He laughs loudly because silence brings back the sound of his crew drowning. His personal quest asks whether heroism means remembering every loss or protecting the people still alive.'},
{id:'selene',name:'Selene',race:'Elf',cl:'Duelist',gender:'Female',hp:115,atk:25,def:11,spd:133,role:'Warrior',icon:'⚔️',intro:'“Do not mistake quiet for mercy. I came here for an answer, not applause.”',story:'Selene served as an honor guard to a queen whose name appears only in damaged timelines. Her sword knows techniques she has never trained. She seeks the truth of a fleet she may have doomed in another life.'},
{id:'pippa',name:'Pippa',race:'Human',cl:'Idol',gender:'Female',hp:104,atk:12,def:9,spd:126,role:'Support',icon:'🎤',intro:'“Hey, new friends! If the ocean can sing, then so can we. And we’re going to be louder!”',story:'Pippa performs at the Moonwake Festival, singing the names of missing sailors. Her songs make forgotten people briefly visible. She fears that if she stops singing, her own older brother will vanish from everyone’s memory.'}
],
enemies:{
crab:{name:'Shellback Crab',hp:105,atk:20,def:15,spd:72,icon:'🦀',drops:['shellplate','brinescale']},
gull:{name:'Stormwing Gull',hp:90,atk:24,def:7,spd:155,icon:'🪽',drops:['windfeather','brinescale']},
siren:{name:'Saltwater Siren',hp:125,atk:27,def:10,spd:123,icon:'🧜',drops:['echopearl','tidecloth']},
coralgolem:{name:'Coral Golem',hp:235,atk:31,def:24,spd:65,icon:'🪸',drops:['coralheart','shellplate']},
eelhunter:{name:'Abyss Eel',hp:145,atk:32,def:12,spd:143,icon:'🐍',drops:['abyssfang','echopearl']},
reefbreaker:{name:'Reefbreaker Colossus',hp:580,atk:40,def:25,spd:88,icon:'🦞',drops:['reefcrest','shellplate']},
herald:{name:'Abyssal Herald',hp:790,atk:48,def:27,spd:120,icon:'🔱',drops:['abyssfang','echopearl']},
leviathan:{name:'Leviathan of Forgotten Years',hp:1250,atk:57,def:32,spd:135,icon:'🐉',drops:['leviathancore','echopearl']}
},
materials:{
shellplate:'Shellplate',brinescale:'Brine Scale',windfeather:'Storm Feather',echopearl:'Echo Pearl',tidecloth:'Tidewoven Cloth',coralheart:'Coral Heart',abyssfang:'Abyss Fang',reefcrest:'Reefbreaker Crest',leviathancore:'Leviathan Memory Core'
},
gear:{
tidalblade:{name:'Tideguard Cutlass',type:'weapon',atk:17,set:'Tideguard'},
tidalcoat:{name:'Tideguard Mantle',type:'armor',def:13,hp:25,set:'Tideguard'},
tidalring:{name:'Tideguard Ring',type:'accessory',spd:19,set:'Tideguard'},
sirenstaff:{name:'Siren Songstaff',type:'weapon',atk:21,set:'Moonwake'},
moonrobe:{name:'Moonwake Vestments',type:'armor',hp:48,def:7,set:'Moonwake'},
mooncharm:{name:'Moonwake Pendant',type:'accessory',atk:9,spd:12,set:'Moonwake'},
abyssblade:{name:'Abyssal Fangblade',type:'weapon',atk:29,set:'Abyssal'},
abyssplate:{name:'Abyssal Shellplate',type:'armor',def:19,hp:50,set:'Abyssal'},
abysscrown:{name:'Abyssal Memory Crown',type:'accessory',atk:13,spd:20,set:'Abyssal'}
},
potions:{
salttonic:{name:'Saltwind Tonic',type:'item',description:'Restore 90 HP',price:65},
tideelixir:{name:'Tide Elixir',type:'item',description:'Restore 60 HP and 40 Energy',price:115},
guarddraught:{name:'Guardian Draught',type:'item',description:'Temporary +15 DEF for one battle',price:140},
swiftbrew:{name:'Stormstep Brew',type:'item',description:'Temporary +25 SPD for one battle',price:140}
}
};