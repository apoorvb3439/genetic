let poisonNo=10;
let poisons=[];

function Poison(p){
    this.pos=p;
    this.size=10;
    this.draw=function(){
        fill(255,0,0);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}

function createPoison(){
    for(let i=0;i<poisonNo;i++){
        poisons.push(new Poison(new Pos(Math.random()*width,Math.random()*height)));
    }
}

function drawPoison(){
    for(let poison of poisons){
        poison.draw();
    }
}
