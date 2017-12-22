let obstacles=[];
let obstacleN=6;
let obstacleH=300;
let obstacleW=20;

function hitObstacles(rocketPos){
    for(let ob of obstacles){
        if(hit(rocketPos,ob)){
            return true;
        }
    }
    return false;
}

function createObstacles(){
    for(let i=0; i<obstacleN; ++i){
        obstacles.push(createVector(giveRandom(10,width-10),giveRandom(20,height-20)));
    }
}

function drawObstacles(){
    for(let o of obstacles){
        drawObstacle(o);
    }
}

function drawObstacle(o){
    fill(255,0,0,150);
    push();
    translate(o.x,o.y);
    rectMode(CENTER);
    rect(0,0,obstacleW,obstacleH);
    pop();
}

function hit(rocketPos,o){
    if(dist(o.x,0,rocketPos.x,0)<=obstacleW/2+rocketW/2){
        if(dist(0,o.y,0,rocketPos.y)<=obstacleH/2+rocketH/2){
            return true;
        }
    }
    return false;
}

function giveRandom(start, end){
    return start+(Math.random()*(end-start));
}
