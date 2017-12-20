let agents=[];
let number=500;
let child=[];

function setup() {
	createCanvas(windowWidth,windowHeight);
	createFood();
	createPoison();
	createAgents(agents,number);
}

function draw() {
	background(250);

	drawFood();
	drawPoison();

	drawAgents(agents);
	drawAgents(child);
	moveAgents(agents);

	moveAgents(child);
	genetizeAgents(agents);
	balanceLength();
}


function genetizeAgents(agents){
	for(let i=0; i<agents.length; i++){
		if(agents[i].eatPoison())
			agents.splice(i,1);
			
			
				
				
				
			
		
		else if(agents[i].eatFood()){
			child.push(new Agent(new Pos(agents[i].pos.x+5,agents[i].pos.y+5),agents[i].speedx,agents[i].speedy));
		}

	}

}

function balanceLength(){
	if(agents.length>number){
		agents.pop();
	}
	if(child.length>number){
		child.pop();
	}
}


function drawAgents(agents){
	for(let a of agents){
		a.draw();
	}
}

function moveAgents(agents){
	for(let a of agents){
		a.move();
	}
}

function createAgents(agents,n){
	for(let i=0; i<n; ++i){
		let x= Math.random()*width;
		let y= Math.random()*height;
		let speedx= Math.random()*10;
		let speedy=  Math.random()*10;
		let a= new Agent(new Pos(x,y),speedx,speedy);
		agents.push(a);
	}
}
