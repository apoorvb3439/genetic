let foodNo=10;
let foods=[];

function Food(p){
    this.pos=p;
    this.size=10;
    this.draw=function(){
        fill(0,250,0);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}

function createFood(){
    for(let i=0;i<foodNo;i++){
        foods.push(new Food(new Pos(Math.random()*width,Math.random()*height)));
    }
}

function drawFood(){
    for(let food of foods){
        food.draw();
    }
}
