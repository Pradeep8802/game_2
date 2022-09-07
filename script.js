var can=document.querySelector("canvas");
can.width=window.innerWidth;
can.height=window.innerHeight;
var c=can.getContext("2d");
/////////////////
// score and coins
var score=0;
var coins=0;
document.getElementById("score").value=score
document.getElementById("coins").value=coins
/////////////

// constants
const PLAYERBALLRADIUS=5;
const WIDTHOFPLAYER=30;
const HEIGHTOFPLAYER=60;
const LENGHTOFBULLET=10;
const PLATFORM=600;
const PLATFORMHEIGHT=100;
const PLATFORMWIDTH=can.width;
const BULLETVELOCITYX=4;
const BULLETVELOCITYY=4;
const HEIGHTOFBULLET=5;
let a=PLATFORM-HEIGHTOFPLAYER;
let b=a;


const imageOfEnemies=new Image();
imageOfEnemies.src='img1game2.jpg';
    
    

var playerPosition={
    x:100,
    y:a
}

var ballCenter={
    x:playerPosition.x+WIDTHOFPLAYER,
    y:b
}

function pointInRectangle(x,y,X,Y,W,H){
    let inside=false;
    if(x>X && x-X<W && y>Y && y-Y<H){
        inside=true;
        //console.log("alert");
    }
    return inside;
}

function twoIntersectingRectangles(x1,y1,w1,h1,x2,y2,w2,h2){
    var intersecting=false;
    if(pointInRectangle(x1,y1,x2,y2,w2,h2)==true || 
        pointInRectangle(x1+w1,y1,x2,y2,w2,h2)==true ||
        pointInRectangle(x1+w1,y1+h1,x2,y2,w2,h2)==true ||
        pointInRectangle(x1,y1+h1,x2,y2,w2,h2)==true ||
        pointInRectangle(x2,y2,x1,y1,w1,h1)==true || 
        pointInRectangle(x2+w2,y2,x1,y1,w1,h1)==true ||
        pointInRectangle(x2+w2,y2+h2,x1,y1,w1,h1)==true ||
        pointInRectangle(x2,y2+h2,x1,y1,w1,h1)==true){
            
            intersecting=true;
        }
        return intersecting;
    }

// ENEMIES

const WIDTHOFENEMY=30;
const HEIGHTOFENEMY=30;
const VELOCITYOFENEMY=0.5;

// variables
var clicked=false;
var bulletArray=[];
var bulletsAttackingPoint=[];

//
// PLAYER 
var upKey=false;
var rightKey=false;
var leftKey=false;
var downKey=false;
const XVELOCITY=5;
const YVELOCITY=5;

document.addEventListener('keydown', (event) => {
    if(machineGun==false){

        if(event.key=='w'){
            upKey=true;
        }
        else if(event.key=='d'){
            rightKey=true;
        }
        else if(event.key=='s' && playerPosition.y+HEIGHTOFPLAYER>=PLATFORM){
            downKey=true;
        }
        else if(event.key=='a'){
            leftKey=true;
                }
        
    }//alert(event.key);
    //var code = event.code;
    // Alert the key name and key code on keydown
   // alert(`Key pressed ${name}`);
  }, false);

function updatePlayer(){
    
    ballCenter.x=playerPosition.x+WIDTHOFPLAYER;
    ballCenter.y=playerPosition.y;
    
    //console.log(upKey,downKey,leftKey,rightKey);
    //console.log(playerPosition);
    if(upKey==true){
        playerPosition.y=playerPosition.y-YVELOCITY;upKey=false;
    }
    else if(downKey==true){
        playerPosition.y=playerPosition.y+YVELOCITY;downKey=false;
    }
    else if(leftKey==true){
        playerPosition.x=playerPosition.x-XVELOCITY;leftKey=false;
    }
    else if(rightKey==true){
        playerPosition.x=playerPosition.x+XVELOCITY;rightKey=false;
    }
    
}


function mouseOnClick(event){
    clicked=true;
    // shootingPoint.x = event.clientX;
    // shootingPoint.y  = event.clientY;
    var distination={
        x : event.clientX,
        y : event.clientY

    }
    var newBullet={
        x:ballCenter.x,
        y:ballCenter.y
    }
    bulletsAttackingPoint.push(distination);
    bulletArray.push(newBullet);
}

var enemiesArray=[];
var enemiesVelocities=[];
// var enemiesArray=[];

function enemyGenerator(){
    let totalPossiblePositions=1000;
    let verticalEnemy = Math.floor(50+Math.random()*totalPossiblePositions);
    // var location={
    //     x:0,
    //     y:verticalEnemy
    // }
    var a=verticalEnemy;
    var b=10;

    return [a,b];
}
function angleBetweenPoint(location,playerPosition){
    return Math.atan2(location[1]-playerPosition.y,location[0]-playerPosition.x);
}

function velocitiesOfEnemies(location){
    var direction= Math.abs(angleBetweenPoint(location,playerPosition));
    //console.log(direction);
    var a=-Math.cos(direction)*VELOCITYOFENEMY;
    var b=Math.sin(direction)*VELOCITYOFENEMY;
    // console.log(a,b);
    return [a,b];
}


function createEnemy(enemiesArray,enemiesVelocities){    
    var a=enemyGenerator();
    //console.log(a);
    enemiesArray.push(a);
    //console.log(enemiesArray);
    var len=enemiesArray.length;
    //console.log(velocitiesOfEnemies(enemiesArray[len-1]));
    var b =velocitiesOfEnemies(enemiesArray[len-1]);
    //console.log(b);
    enemiesVelocities.push(b);
}

const VELOCITYOFENEMYATXAXIS=1;

function updateEnemies(enemiesArray,enemiesVelocities){
    
    for(let i=0;i<enemiesArray.length;i++){
        if(enemiesArray[i][1]+HEIGHTOFENEMY>=PLATFORM){
            enemiesArray[i][1]=PLATFORM-HEIGHTOFENEMY;
            var directionNow;
            if(enemiesArray[i][0]>=playerPosition[0]){
                directionNow=-1;
            }
            else{
                directionNow=1;
            }
            enemiesArray[i][0]=enemiesArray[i][0]+ VELOCITYOFENEMYATXAXIS*directionNow;
        }
        else{
            enemiesArray[i][0]=enemiesArray[i][0]+ enemiesVelocities[i][0];
            enemiesArray[i][1]=enemiesArray[i][1]+ enemiesVelocities[i][1];

        }
    }
}

function drawEnemy(x,y){
    // c.fillStyle="#f00";
    // c.fillRect(x,y,WIDTHOFENEMY,HEIGHTOFENEMY);
    
c.drawImage(imageOfEnemies,x,y,WIDTHOFENEMY,HEIGHTOFENEMY);
}

function drawEnemies(enemiesArray){
    for(let i=0;i<enemiesArray.length;i++){
        drawEnemy(enemiesArray[i][0],enemiesArray[i][1]);
    }

}

//

const imageOfPlatform=new Image();
imageOfPlatform.src='img2game2.jpg';
    
const ONEBRICKSIZE=200;
function drawBackGround(){
    //c.fillStyle = "url('images.jpg')";
   for(var i=0;i<Math.floor(100+can.width/ONEBRICKSIZE);i++){
    c.drawImage(imageOfPlatform,i*ONEBRICKSIZE,PLATFORM,ONEBRICKSIZE,PLATFORMHEIGHT);
   }
    // c.drawImage(imageOfPlatform,0,PLATFORM,PLATFORMWIDTH,PLATFORMHEIGHT);
    // c.fillStyle="green";
    // c.fillRect(0,PLATFORM,PLATFORMWIDTH,PLATFORMHEIGHT);
}

function drawPlayer(playerPosition){
    c.fillStyle="pink";
    c.fillRect(playerPosition.x,playerPosition.y,WIDTHOFPLAYER,HEIGHTOFPLAYER);
    c.beginPath();
    c.arc(playerPosition.x+WIDTHOFPLAYER,playerPosition.y,PLAYERBALLRADIUS,0, 2*Math.PI, false);
    c.fillStyle = "blue";
    c.fill();
   // c.lineWidth = 5;
   // c.strokeStyle = '#003300';
    c.stroke();

}


function angleBetween(p1, p2) {
    return  Math.atan2(p2.y-p1.y, p2.x-p1.x);
}

function angleValues(target){
    var cos;var sin;
    angle=angleBetween(target,ballCenter);
    if(ballCenter.x>=target.x && ballCenter.y>=target.y){
        cos= -Math.abs(Math.cos(angle));
        sin= -Math.abs(Math.sin(angle));
    }
    else if(ballCenter.x<=target.x && ballCenter.y>=target.y){
        cos= Math.abs(Math.cos(angle));
        sin= -Math.abs(Math.sin(angle));
    }
    else if(ballCenter.x>=target.x && ballCenter.y<=target.y){
        cos= -Math.abs(Math.cos(angle));
        sin= +Math.abs(Math.sin(angle));
    }
    else if(ballCenter.x<=target.x && ballCenter.y<=target.y){
        cos= +Math.abs(Math.cos(angle));
        sin= +Math.abs(Math.sin(angle));
    }
    return [cos,sin];
}


function drawBullet(x,y,target){
    // c.fillStyle="red";
    // c.fillRect(0,0,20,20);
    var [cos,sin] = angleValues(target);
    x+=BULLETVELOCITYX*cos;
    y+=BULLETVELOCITYY*sin;
    if(target.x!=ballCenter.x && target.y!=ballCenter.y){

        c.beginPath();
        c.moveTo(x,y);
        c.lineTo(x+LENGHTOFBULLET*cos,y+LENGHTOFBULLET*sin);
        c.strokeStyle = '#f00';
        c.stroke();
    }
} 

function drawBullets(bulletArray,bulletsAttackingPoint){
    for(var i=0;i<bulletArray.length;i++){
        drawBullet(bulletArray[i].x,bulletArray[i].y,bulletsAttackingPoint[i]);

    }
}

function draw(bulletArray,bulletsAttackingPoint){
    drawBackGround();
    drawBullets(bulletArray,bulletsAttackingPoint);
    //console.log(bulletArray,bulletsAttackingPoint);
    drawPlayer(playerPosition);
    //
    drawEnemies(enemiesArray);
}

function updateBullet(x,y,target){
    var [cos,sin] = angleValues(target);
    // console.log(cos,sin);
    x=x+BULLETVELOCITYX*cos;
    y=y+BULLETVELOCITYY*sin;
    return [x,y];
} 

function updateBullets(bulletArray,bulletsAttackingPoint){
    for(let i=0;i<bulletArray.length;i++){
        //console.log(bulletArray[i]);
        [bulletArray[i].x,bulletArray[i].y]=updateBullet(bulletArray[i].x,bulletArray[i].y,bulletsAttackingPoint[i]);
        //console.log(bulletArray[i]);
    }
   // console.log(bulletArray);
}

function update(bulletArray,bulletsAttackingPoint,enemiesArray,enemiesVelocities){
    c.clearRect(0,0,can.width,can.height);
    updateBullets(bulletArray,bulletsAttackingPoint);
    updateEnemies(enemiesArray,enemiesVelocities);
    kill(bulletArray,enemiesArray,bulletsAttackingPoint);
    updatePlayer();
}


// KILL !!!

function bulletInsideEnemy(bullet,enemy){
    var inside=false;
    if(bullet.x> enemy[0] && bullet.x-enemy[0] < WIDTHOFENEMY &&
    bullet.y> enemy[1] && bullet.y-enemy[1] < HEIGHTOFENEMY ){
        inside=true;
    }
    return inside;
}

function kill(bulletArray,enemiesArray,bulletsAttackingPoint){
    var lenghtOfBulletArray=bulletArray.length;
    var lenghtOfEnemiesArray=enemiesArray.length;
    for(var i=0;i<lenghtOfBulletArray;i++){
        for(var j=0;j<lenghtOfEnemiesArray;j++){
            if(bulletInsideEnemy(bulletArray[i],enemiesArray[j])){
                // remove bullet and enemy
                // i=lastbullet;
                // j=lastenemy;
                bulletsAttackingPoint.splice(i,1);
                bulletArray.splice(i,1);
                enemiesArray.splice(j,1);
                coins=coins+1;
                document.getElementById("coins").value=coins;
                console.log(coins);
                i=i-1;
                j=j-1;
                lenghtOfBulletArray=lenghtOfBulletArray-1;
                lenghtOfEnemiesArray=lenghtOfEnemiesArray-1;
                
            }
        }
    }
}

function playerStatus(){
    var playerAlive=true;
    //console.log(enemiesArray);
    for(let i=0;i<enemiesArray.length;i++){

        if(twoIntersectingRectangles(playerPosition.x,playerPosition.y,WIDTHOFPLAYER,HEIGHTOFPLAYER,enemiesArray[i][0],enemiesArray[i][1],WIDTHOFENEMY,HEIGHTOFENEMY)==true){
            playerAlive=false;
            // console.log("hello");
            // document.getElementsByClassName("div").style.color=blue
            gameover()
            
            break;
        }
    }
    //console.log(playerAlive);
    return playerAlive;

}
function gameover(){
    // alert
     alert("gameover")
    // document.getElementsById("div").style.display="none"
//     const element = document.querySelector('#div');
// element.style.display = 'none';
// const elemen = document.querySelector('body');
// elemen.style.backgroundColor="blue"
}

var machineGun=false;

document.addEventListener("keyup", function(event) {

    // If "caps lock" is pressed, display the warning text
    if (event.getModifierState("CapsLock")) {
      machineGun=true;
    } else {
      machineGun=false;
    }
  });


const FREQUENCYOFENEMIES=100;
function main(){
    var time=new Date().getTime();
    if((time-STARTING_TIME)%40==0){
        score=score+1; 
        document.getElementById("score").value=score;

    }
    if((time-STARTING_TIME)%FREQUENCYOFENEMIES==0){
        createEnemy(enemiesArray,enemiesVelocities); 
    }
    requestAnimationFrame(main);
    update(bulletArray,bulletsAttackingPoint,enemiesArray,enemiesVelocities);
    draw(bulletArray,bulletsAttackingPoint,enemiesArray,playerPosition);
    playerStatus();
    
    // if(gameOver==true){
    //     gameEnd();
    //}
}

const STARTING_TIME = new Date().getTime();
main();

