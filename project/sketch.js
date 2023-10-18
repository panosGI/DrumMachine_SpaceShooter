const gameWindowWidth = 800;
const gameWindowHeight = 550;
const drumMachineWidth = 800;
const drumMachineHeight = 200;

let button        //retry Button
let escape_count=0 // μετρητής για το πόσες φορές πατάμε espape 
let imgBackground;
let imgStart;
let imgPlayer;
let imgGrandma;
let imgBulletPan;
let imgCop;
let imgLevelUp;
let imgRadio;
let imgBoss;
let imgWin;
let imgWin2;
let imgOver;
let imgLife;
let imgNote;
let imgDonut;
let imgSoundWave;
let backgroundMusic;
let imgTut1;
let imgTut2;

let poly;
let sfx_bassDrum;
let sfx_floorTom;
let sfx_hiHat;
let sfx_snareDrum;
let sfx_explosion;
let combo2sound;
let combo3sound;
let combo4sound;

let player;
let drumMachine;
const projectiles = [];
const EnemyBullets =[];
const Enemies=[];
const Enemies2=[];
const Enemies3=[];

let drumMachineTimer = 0;
const drumMachineLines = 4;
const drumMachineColumns = 8;

let wave=0;       //wave flag
let deadGrandmas=0;
let deadCops=0;
let deadRadios=0;
let timer=0;
let gShoot=0;
let copshoot=0;
let rshoot=0;
let bossShoot=0;
let chance;
let availiableNotes=3;
let playsong=1;
let timeforsong=0;




const projectileDiameter = 20;

const shotFlag = [];
for (let i = 0; i < drumMachineColumns; i++) {
  shotFlag[i] = false;
}

let noteY;

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Player {
  constructor(x,y,w,h,life) {
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.life=life;
    this.justgothit=0;
  }
  checkBounds() {
    if (this.x >= gameWindowWidth - this.w) {
      this.x = gameWindowWidth - this.w;
    }
  }
  checkIfHit(bulletx,bullety,dmg){
    if(bulletx<this.x+this.w && bulletx>this.x && bullety <this.y+this.h && bullety >this.y){
      this.life-=dmg;
      return true;
      }
  }
  IsDead(){
    if (this.life<=0){return true;}
    return false;    
  }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class Enemy{
  constructor(x,y,w,h,speed,life){       
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;    
    this.speed=speed;
    this.life=life;                       //life 0->dead 
    this.GaveNote=0;
    this.tempspeed=speed;
    this.Createbullet=1;                  //Ενα όρισμα που αν είναι 1 συνεχίζουνε τα enemies και δημιουργούνε
                                          //bullets.
    this.tempheight=y;
    }   
  IsDead(){
    if (this.life<=0){return true;}
    return false;    
  }
  move() {
    if(this.x >= gameWindowWidth - this.w){                         //grandma bounds
      this.speed=-this.speed;
      this.tempspeed=this.speed;    //Κρατάμε κάθε φόρα την αλλαγή της μεταβλητής speed σε περίπτωση pause.
    }
    else if(this.x<0){
      this.speed=-this.speed;
      this.tempspeed=this.speed;    //Κρατάμε κάθε φόρα την αλλαγή της μεταβλητής speed σε περίπτωση pause.
    }
    this.x=this.x+this.speed;

    if(this.speed != 0){        // Ουσιατικά  όταν είναι (pause) σταματάμε να κουνάμε τα enemies προς τα ΄κάτω.
      this.y+=0.05;
      this.tempheight=this.y;
    }
    
  }
  DontMove(){
    this.speed=0;
    

  }
  checkIfHit(bulletx,bullety,dmg){
    if(bulletx<this.x+this.w && bulletx>this.x && bullety <this.y+this.h && bullety >this.y){
      this.life-=dmg;
      return true;
      }
  }
  checkBounds() {                                //Με σκοπό τα enemies να μην κατεβαίνουν κάτω από την μέση της 
                                                //οθόνης.
    if (this.y >= gameWindowHeight - this.y) {
      this.y = gameWindowHeight - this.y;
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class EnemyBullet{
  constructor(x,y,w,h,dmg){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.dmg=dmg;
    this.StopMode=1;
    this.tempY=y;              // Ένα όρισμα για να κράταμε το ύψος σε περίπτωση που κάνουμε pause το game, 
                              // για να γνωρίζει το game όταν ξανααρχίσει σε ποιο ύψος θα ζωγραφίσει το bullet.
  }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class DrumMachine {
  constructor(lines,columns) {
    this.lines = lines;
    this.columns = columns;
    this.note = new Array(lines);
    for (let i = 0; i < lines; i++) {
      this.note[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        this.note[i][j] = false;
      }
    }
    this.DrumMachineFlag=1;
  }
}

class Projectile {
  constructor(x,y,c,dmg) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.dmg=dmg;
  }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//creating player and drum machine

player = new Player(0,gameWindowHeight - 60,40,40,5);
drumMachine = new DrumMachine(drumMachineLines, drumMachineColumns);

//---------------------------------CreateTheEnemies---------------------------------------------------------------

function Create(){
//creating grandmas for wave 1
  for(let i=0;i<=5;i++){
    enemy = new Enemy(Math.floor(Math.random() * 750),Math.floor(Math.random() * 30) + 10,50,50,2,3);
    Enemies.push(enemy);
    }
  //creating cops for wave 2
  for(let i=0;i<=5;i++){
    enemy2 = new Enemy(Math.floor(Math.random() * 750),Math.floor(Math.random() * 100) + 20,50,50,3,5);
    Enemies2.push(enemy2);
    }
  //creating radios for wave 3
  for(let i=0;i<=5;i++){
    enemy3 = new Enemy(Math.floor(Math.random() * 750),Math.floor(Math.random() * 150) + 40,50,50,4,8);
    Enemies3.push(enemy3);
    }
  //creating boss
  boss=new Enemy(200,50,200,250,3,20);
}
//---------------------------------ClearTheEnemies-----------------------------------------------------------------
function Clear(){
  for (En in Enemies){
    Enemies.splice(projectiles.indexOf(En)); 
  }
  for (En in Enemies2){
    Enemies1.splice(projectiles.indexOf(En)); 
  }
  for (En in Enemies3){
    Enemies3.splice(projectiles.indexOf(En)); 
  }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function preload() {

  //images
  imgBackground = loadImage('80s-Retro-Wallpapers.jpg');
  imgStart=loadImage('start.png');
  imgTut1=loadImage('tut1.png');
  imgTut2=loadImage('tut2.png');
  imgPlayer = loadImage('vcr.png');
  imgGrandma=loadImage('grandma.png');
  imgBulletPan=loadImage('pan.png');
  imgCop=loadImage('cop.png');
  imgLevelUp=loadImage('levelup.png');
  imgRadio=loadImage('radio.png');
  imgBoss=loadImage('radio.png');
  imgWin=loadImage('win.png');
  imgWin2=loadImage('win2.png');
  imgOver=loadImage('over.png');
  imgLife=loadImage('heart.png');
  imgNote=loadImage('note.png');
  imgDonut=loadImage('donut.png');
  imgSoundWave=loadImage('soundWave.png');

 //sounds    
  backgroundMusic=loadSound("sounds/The Buggles - Video Killed The Radio Star (Official Music Video).mp3");

  sfx_bassDrum=loadSound("sounds/Bass-Drum.mp3");
  sfx_floorTom=loadSound("sounds/Floor-Tom.mp3");
  sfx_hiHat=loadSound("sounds/Hi-Hat.mp3");
  sfx_snareDrum=loadSound("sounds/Snare-Drum.mp3");
  sfx_explosion=loadSound("sounds/explosion.mp3");
  combo2sound=loadSound("sounds/combo2Sound.mp3");
  combo3sound=loadSound("sounds/combo3Sound.mp3");
  combo4sound=loadSound("sounds/combo4Sound.mp3");
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function setup() {
  createCanvas(gameWindowWidth, gameWindowHeight + drumMachineHeight);
  poly = new Tone.PolySynth(1, Tone.Synth).toMaster();
  
  poly.set({
    oscillator:{
      type: "sawtooth"

    }
  });
  button = createButton("RETRY");       //Μια προσπάθεια για να κάνουμε Retry το game οποιαδήποτε στιγμή 
  button.mousePressed(RestartGame());   //αλλά δεν δούλεψε
  
}
//---------------------------------------------RestartTheGame---------------------------------------------------------------------------------------------------------------------------------
function RestartGame(){
  Clear();
  wave=0;
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function draw() {
  
  clear();
  
  //draw background
  image(imgBackground,0,0,gameWindowWidth,gameWindowHeight);

  //draw life
  for(let i=0;i<player.life;i++){
    image(imgLife,750-i*40,3,35,35);
  }

  //Draw available notes
  for (let i = 0; i < availiableNotes; i++) {
    image(imgNote,5+i*30, 3, 25, 25);
  }
  //Draw the player
  if(!player.IsDead()){
    player.x = mouseX;
    player.checkBounds();
    image(imgPlayer,player.x,player.y,player.w,player.h);
  } 
  else{
    wave=-1;
  }
  //Draw players life

  //draw game over
  if(wave===-1){
    image(imgOver,120,100,500,300);
  }
  //draw entry screen  
  if (wave===0){
    if(millis()<=1000||millis()>2000&&millis()<=3000||millis()>4000&&millis()<5000||millis()>6000&&millis()<7000){    //patenta gia na anabosbhnei to start
      image(imgStart,120,100,500,300);
    }
    if(millis()<8000){
      image(imgTut1,5,5,800,100);
      image(imgTut2,5,450,800,100);
    }
    if((millis()>8000) && ((escape_count%2)===0)){
      Create();
      wave=1;
    }
  }
  //Draw Enemy------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
  //to repeat music
  if(timeforsong>195600){
    timeforsong=0;
    playsong=1;
  }
  timeforsong+=deltaTime;
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  if(wave===1){
  deadGrandmas=0;
  
  for(let enemy of Enemies){
    if(!enemy.IsDead()){
      enemy.checkBounds();
      image(imgGrandma,enemy.x,enemy.y,enemy.w,enemy.h);
      enemy.move();  
      //create bullet

      if(gShoot>6000 && enemy.Createbullet===1){
        b=new EnemyBullet(enemy.x,enemy.y,50,50,1);
        EnemyBullets.push(b);
        gShoot=random(0,1000);
      }
      gShoot+=deltaTime;
    }
    if(enemy.IsDead()){
      
      deadGrandmas++;
      chance=random(0,100);     //random chance of getting note
      if(enemy.GaveNote==0){
        sfx_explosion.play();
        if(chance<20){
          availiableNotes++;              //used in mouse released()
          enemy.GaveNote=1;
        }
      }
    }
  }
  //draw & update enemy bullets
  for(let b of EnemyBullets){
    if(b.StopMode===1){                    //Ελέγχουμε τις σφαίρες που έχουν δημιουργηθεί και αν έχουν StopMode=1
      b.y+=deltaTime;                     //συνεχίζουμε και τις ζωγραφίζουμε αυ΄ξάνοντας το ύψος (b.y+=deltaTime),
      b.tempY=b.y;                       //και το κρατάμε και στο όρισμα b.tempY σε περίπτωση (pause).
      image(imgBulletPan,b.x,b.y,b.w,b.h); 
    }else{
      b.y=b.tempY;
      image(imgBulletPan,b.x,b.y,b.w,b.h);
    }
  }
  if(deadGrandmas===6){
    wave=2;
  }
}
//------------------------------------------------------------------------------------------------------------------------>
if(wave===2){
  timer+=deltaTime;
  if(timer<3000){                             //show level up for 3 secs
    image(imgLevelUp,120,100,500,300); 
  }   
  else{
    deadCops=0;  
    for(let enemy of Enemies2){
      if(!enemy.IsDead()){
        enemy.checkBounds();
        image(imgCop,enemy.x,enemy.y,enemy.w,enemy.h);
        enemy.move();  
        //create bullet  
        if(copshoot>6000 && enemy.Createbullet===1){
          b=new EnemyBullet(enemy.x,enemy.y,50,50,1);
          EnemyBullets.push(b);
          copshoot=random(0,1000);
        }
        copshoot+=deltaTime;
      }
      if(enemy.IsDead()){
        
        deadCops++;
        chance=random(0,100);     //random chance of getting note
        if(enemy.GaveNote==0){
          sfx_explosion.play();
          if(chance<15){
            availiableNotes++;              //used in mouse released()
            enemy.GaveNote=1;
          }
        }
      }
    }
    //draw & update enemy bullets
    for(let b of EnemyBullets){
      if(b.StopMode===1){                    //Ελέγχουμε τις σφαίρες που έχουν δημιουργηθεί και αν έχουν StopMode=1
        b.y+=deltaTime;                     //συνεχίζουμε και τις ζωγραφίζουμε αυ΄ξάνοντας το ύψος (b.y+=deltaTime),
        b.tempY=b.y;                       //και το κρατάμε και στο όρισμα b.tempY σε περίπτωση (pause).
        image(imgDonut,b.x,b.y,b.w,b.h); 
      }else{
        b.y=b.tempY;
        image(imgDonut,b.x,b.y,b.w,b.h);
      }
    }
   if(deadCops===6){
     wave=3;
     timer=0;           //reset timer
   }
  }
}
if (wave===3){
  timer+=deltaTime;
  if(timer<3000){                             //show level up for 3 secs
    image(imgLevelUp,120,100,500,300); 
  } else{
    deadRadios=0;  
    for(let enemy of Enemies3){
      if(!enemy.IsDead()){
        enemy.checkBounds();
        image(imgRadio,enemy.x,enemy.y,enemy.w,enemy.h);
        enemy.move();  
        //create bullet  
        if(rshoot>6000 && enemy.Createbullet===1){
          b=new EnemyBullet(enemy.x,enemy.y,50,50,1);
          EnemyBullets.push(b);
          rshoot=random(0,1000);
        }
        rshoot+=deltaTime;
      }
      if(enemy.IsDead()){
        
        deadRadios++;
        chance=random(0,100);     //random chance of getting note
        if(enemy.GaveNote==0){
          sfx_explosion.play();
          if(chance<10){
            availiableNotes++;              //used in mouse released()
            enemy.GaveNote=1;
          }
        }
      }
    }
    //draw & update enemy bullets
    for(let b of EnemyBullets){
      if(b.StopMode===1){                    //Ελέγχουμε τις σφαίρες που έχουν δημιουργηθεί και αν έχουν StopMode=1
        b.y+=deltaTime;                     //συνεχίζουμε και τις ζωγραφίζουμε αυ΄ξάνοντας το ύψος (b.y+=deltaTime),
        b.tempY=b.y;                       //και το κρατάμε και στο όρισμα b.tempY σε περίπτωση (pause).
        image(imgSoundWave,b.x,b.y,b.w,b.h); 
      }else{
        b.y=b.tempY;
        image(imgSoundWave,b.x,b.y,b.w,b.h);
      }
    }
   if(deadRadios===6){
     wave=4;
     timer=0;           //reset timer (for level up)
   }
  } 
}
if (wave===4){
  timer+=deltaTime;
  if(timer<3000){                             //show level up for 3 secs
    image(imgLevelUp,120,100,500,300); 
  } 
  else{
      if(!boss.IsDead()){
        boss.checkBounds();
        image(imgBoss,boss.x,boss.y,boss.w,boss.h);
        boss.move();  
        //create bullet  
        if(bossShoot>1500 && boss.Createbullet===1){
          b=new EnemyBullet(boss.x+65,boss.y+130,70,70,2);
          EnemyBullets.push(b);
          bossShoot=random(0,1000);
        }
        bossShoot+=deltaTime;
      }
    //draw & update enemy bullets
    for(let b of EnemyBullets){
      if(b.StopMode===1){                    //Ελέγχουμε τις σφαίρες που έχουν δημιουργηθεί και αν έχουν StopMode=1
        b.y+=deltaTime;                     //συνεχίζουμε και τις ζωγραφίζουμε αυ΄ξάνοντας το ύψος (b.y+=deltaTime),
        b.tempY=b.y;                       //και το κρατάμε και στο όρισμα b.tempY σε περίπτωση (pause).
        image(imgSoundWave,b.x,b.y,b.w,b.h); 
      }else{
        b.y=b.tempY;
        image(imgSoundWave,b.x,b.y,b.w,b.h);
      }
    }
    if(boss.IsDead()){
      wave=5;
    }
  }
}
if(wave===5){
  image(imgWin,120,100,500,300); 
  image(imgWin2,5,450,800,100);
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //check bullet/projectile collisions 
  if(wave===1){
    for(let p of projectiles){
      for (let enemy of Enemies){
        if(enemy.checkIfHit(p.x,p.y,p.dmg)){
          projectiles.splice(projectiles.indexOf(p));           //remove projectile from array
        };
      }
    }
    for(let b of EnemyBullets){
      if(player.checkIfHit(b.x,b.y,b.dmg)){
        EnemyBullets.splice(EnemyBullets.indexOf(b));
      }
    }
  }


  //check for wave 2
  if(wave===2){
    for(let p of projectiles){
      for (let enemy of Enemies2){
        if(enemy.checkIfHit(p.x,p.y,p.dmg)){
          projectiles.splice(projectiles.indexOf(p));           //remove projectile from array
        };
      }
    }
    for(let b of EnemyBullets){
      if(player.checkIfHit(b.x,b.y,b.dmg)){
        EnemyBullets.splice(EnemyBullets.indexOf(b));
      }
    }
  }
    //check for wave 3
    if(wave===3){
      for(let p of projectiles){
        for (let enemy of Enemies3){
          if(enemy.checkIfHit(p.x,p.y,p.dmg)){
            projectiles.splice(projectiles.indexOf(p));           //remove projectile from array
          };
        }
      }
      for(let b of EnemyBullets){
        if(player.checkIfHit(b.x,b.y,b.dmg)){
          EnemyBullets.splice(EnemyBullets.indexOf(b));
        }
      }
    }
    //check for wave 4
    if(wave===4){
      for(let p of projectiles){
          if(boss.checkIfHit(p.x,p.y,p.dmg)){
            projectiles.splice(projectiles.indexOf(p));           //remove projectile from array
          };
        }
        for(let b of EnemyBullets){
          if(player.checkIfHit(b.x,b.y,b.dmg)){
            EnemyBullets.splice(EnemyBullets.indexOf(b));
          }
        }
    }
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //draw Drum machine

  for (let i = 0; i < drumMachine.lines; i++) {
    for (let j = 0; j < drumMachine.columns; j++) {

      
      if (drumMachine.note[i][j] === true) {
        switch(i) {
          case 0:
            fill('blue');
            break;
          case 1:
            fill('green');
            break;
          case 2:
            fill('purple');
            break;
          case 3:
            fill('yellow');
            break;
          default:
            break;
        } 
      } else {
        noFill();
      }

      rect(j * drumMachineWidth / drumMachine.columns,gameWindowHeight + i*drumMachineHeight/drumMachine.lines,drumMachineWidth/drumMachine.columns,drumMachineHeight/drumMachine.lines); 
    }
  }

  line(drumMachineTimer % width, gameWindowHeight, drumMachineTimer % width, height);
  if (drumMachine.DrumMachineFlag===1){        //Όσο το DrumMachineFlag=1,
    drumMachineTimer+= deltaTime/4;           // αυξάνουμε το drumMachineTimer ώστε να προχώραει η γραμμή κάθετα
                                              // στο drumMachine μας 
  }else{                                      //Αν πατήσουμε (Esc) για (pause) του DrumMachine flag γίνεται -1,
    drumMachineTimer=drumMachineTimer;        //με αποτέλεσμα να μένει ακήνητη η γραμμ΄ή του DrumMachine.
  }


  noteY = floor((drumMachineTimer % width) / (drumMachineWidth/drumMachine.columns));
  for (let i = 0; i < drumMachine.lines; i++) {
    let combo=0;
    if (drumMachine.note[i][noteY] === true && shotFlag[noteY] === false) {
      let p;
      switch(i) {
        case 0:

          

          if(drumMachine.note[1][noteY]&&!drumMachine.note[2][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(0,64,128),2);                  //blue & green
            combo=2;
            break;
          }
          if(drumMachine.note[2][noteY]&&!drumMachine.note[1][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(25,43,128),2);             //blue & purple
            combo=2;
            break;
          }
          if(drumMachine.note[3][noteY]&&!drumMachine.note[1][noteY]&&!drumMachine.note[2][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(180,255,180),2);           //blue & yellow
            combo=2;
            break;
          }
          if(drumMachine.note[1][noteY]&&drumMachine.note[2][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(25,43,128),3);             //blue & green & purple
            combo=3;
            break;
          }
          if(drumMachine.note[1][noteY]&&drumMachine.note[2][noteY]&&drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(25,143,128),4);           //blue & green & purple & yellow
            combo=4;
            break;
          }
          if(drumMachine.note[1][noteY]&&!drumMachine.note[2][noteY]&&drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(225,143,128),3);           //blue & green  & yellow
            combo=3;
            break;
          }
          if(!drumMachine.note[1][noteY]&&drumMachine.note[2][noteY]&&drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(225,243,128),3);           //blue & purple & yellow
            combo=3;
            break;
          }
          if(!drumMachine.note[1][noteY]&&!drumMachine.note[2][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(0,0,255),1);            //blue 
            break;
          }
        case 1:

           

          if(!drumMachine.note[2][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(0,255,0),1);                  //green
            break;
          }
          if(drumMachine.note[2][noteY]&&!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(238,130,238),2);                  //green & purple
            combo=2;
            break;
          }
          if(!drumMachine.note[2][noteY]&&drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(38,64,65),2);                  //green & yellow
            combo=2;
            break;
          }
          if(drumMachine.note[2][noteY]&&drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(249,255,79),3);                  //green & purple & yellow
            combo=3;
            break;
          }
        case 2:

          

          if(!drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(75,0,130),1);                  //purple
          }
          if(drumMachine.note[3][noteY]){
            p = new Projectile(player.x + player.w / 2, player.y,color(165,128,65),2);                  //purple & yellow
            combo=2;
          }
          break;
        case 3:

          

          p = new Projectile(player.x + player.w / 2, player.y,color(255,255,0),1);        //yellow
          break;
        default:
          break;
      }
      if(combo===0){
        if (i==0) {sfx_bassDrum.play();}
        if (i==1) {sfx_hiHat.play();} 
        if (i==2) {sfx_floorTom.play();}
        if (i==3) {sfx_snareDrum.play();}  
      }
      if(combo===2){
        combo2sound.play();
      }
      if(combo===3){
        combo3sound.play();
      }
      if(combo===4){
        combo4sound.play();
      }

      projectiles.push(p);
      shotFlag[noteY] = true;
      
    }
  }
  
  if (noteY === 0) {
    shotFlag[drumMachineColumns - 1] = false;
  } else {
    shotFlag[noteY - 1] = false;
  }
  for (let p of projectiles) {
    if(wave!=-1){
      fill(p.c);
      p.y -= deltaTime;
      circle(p.x,p.y, projectileDiameter);
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function mouseReleased() {
  if (mouseX <= drumMachineWidth && mouseX > 0 && mouseY <= height && mouseY > gameWindowHeight&&availiableNotes>0 && drumMachine.note[floor((mouseY - gameWindowHeight)/(drumMachineHeight/drumMachine.lines))][floor(mouseX / (drumMachineWidth/drumMachine.columns))] === false) {
    drumMachine.note[floor((mouseY - gameWindowHeight)/(drumMachineHeight/drumMachine.lines))][floor(mouseX / (drumMachineWidth/drumMachine.columns))] = true;
    availiableNotes--;
  } else if (mouseX <= drumMachineWidth && mouseX > 0 && mouseY <= height && mouseY > gameWindowHeight && drumMachine.note[floor((mouseY - gameWindowHeight)/(drumMachineHeight/drumMachine.lines))][floor(mouseX / (drumMachineWidth/drumMachine.columns))] === true) {
    drumMachine.note[floor((mouseY - gameWindowHeight)/(drumMachineHeight/drumMachine.lines))][floor(mouseX / (drumMachineWidth/drumMachine.columns))] = false;
    availiableNotes++;
  }
}
function mousePressed(){
  if(backgroundMusic.isLoaded()&&playsong===1){
    backgroundMusic.setVolume(0.2);
    backgroundMusic.play();
    playsong=0;
  }
}
let isPaused=0;
//---------------------------------------------PausePressed(Esc/ctrl)---------------------------------------------------------------------------------------------------------------------------------
function keyPressed(){
  if (keyCode === ESCAPE){
    escape_count=escape_count+1;
    drumMachine.DrumMachineFlag=-drumMachine.DrumMachineFlag; 
    //Ενναλάζουμε την τιμή DrumMachineFlag σε 1 και -1 ώστε σε περίπτωση (pause) να μένει ακίνητη η γραμμή
    //του drumMachine μας.                                                          
    for(let enemy of Enemies){
      enemy.Createbullet=-enemy.Createbullet; //Ενναλάζουμε την τιμή του ορίσματος Createbullet,ώστε στην περίπτωση 
                                              //που ΄κάνουμε pause να μην δημιουργούντε καινο΄΄΄΄΄΄΄΄υργιες σφαίρες.
      if (enemy.speed != 0){
      enemy.y=enemy.tempheight;
      enemy.DontMove();    //Καλούμε την DontMove() ώστε τα enemies να σταματήσουν να κουνιούνται.
      
      }
      else{
        enemy.speed=enemy.tempspeed;  // Σε περίπτωση που ξαναπατάμε (Esc) για να επανέλθουμε στο game,
                                     //  επαναφέρουμε το παλαιό speed με την σωστή κατεύθυνση.
        enemy.move();
      }
    }

    //Για τα Enemies του wave 2

    for(let enemy of Enemies2){
      enemy.Createbullet=-enemy.Createbullet;
      if (enemy.speed != 0){
        enemy.y=enemy.tempheight;
        enemy.DontMove();    //Καλούμε την DontMove() ώστε τα enemies να σταματήσουν να κουνιούνται.
      }
      else{
        enemy.speed=enemy.tempspeed;  // Σε περίπτωση που ξαναπατάμε (Esc) για να επανέλθουμε στο game,
                                     //  επαναφέρουμε το παλαιό speed με την σωστή κατεύθυνση.
        enemy.move();
      }
    }

    //Για τα Enemies του wave 3

    for(let enemy of Enemies3){
      enemy.Createbullet=-enemy.Createbullet;
      if (enemy.speed != 0){
        enemy.y=enemy.tempheight;
        enemy.DontMove();    //Καλούμε την DontMove() ώστε τα enemies να σταματήσουν να κουνιούνται.
      }
      else{
        enemy.speed=enemy.tempspeed;  // Σε περίπτωση που ξαναπατάμε (Esc) για να επανέλθουμε στο game,
                                     //  επαναφέρουμε το παλαιό speed με την σωστή κατεύθυνση.
        enemy.move();
      }
    }
    
    //Για το boss
    boss.Createbullet=-boss.Createbullet;
    if (boss.speed != 0){
        boss.y=boss.tempheight;
        boss.DontMove();    //Καλούμε την DontMove() ώστε τα enemies να σταματήσουν να κουνιούνται.
      }
      else{
        boss.speed=boss.tempspeed;  // Σε περίπτωση που ξαναπατάμε (Esc) για να επανέλθουμε στο game,
                                     //  επαναφέρουμε το παλαιό speed με την σωστή κατεύθυνση.
        boss.move();
      }
    
    // Οι σφαίρες όλων των enemies είναι στο EnemyBullets οπότε αρκεί το παρακάτω (for loop)

    for(let b of EnemyBullets){
      b.StopMode=-b.StopMode; //Σταμάταμε μια σφαίρα που είναι στο frame και έχει δημιουργηθεί από ένα enemy.
    }

  }
  if(keyCode===CONTROL){
    if(isPaused===0){
      backgroundMusic.pause();
      isPaused=1;
    }
    else{
      backgroundMusic.play();
      isPaused=0;
    }   
  }
}





