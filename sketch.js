let bestRocket;

let population;
let number=800;
let generations;
let generationP;
let lifespan=500;
let year=0;
let p;
let dest;
let src;
let srcSize=40;
let destSize=srcSize;
let maxFitP;
let mutationRate=0.005;
let maxForce=0.2;
let rocketH=6;
let rocketW=20;

let genIndex=0;
let bestIndex=0;
let bestTimer;
timesWantBest=lifespan/10;

function setup() {
	createCanvas(windowWidth-20,windowHeight-110);

	dest=createVector(giveRandom(50,width-50),50);
	src=createVector(giveRandom(50,width-50),height-100);
	generations=0;
	bestTimer=0;
	p=createP();
	generationP=createP("Generations : ");
	maxFitP=createP("MaxFit : ");
	createObstacles();
	population=new Population();

}

function drawSrcDest(){
	fill(0,255,0,150);
	push();
	rectMode(CENTER);
	rect(dest.x,dest.y,srcSize,srcSize);
	rect(src.x,src.y,destSize,destSize);
	pop();
}

function draw() {
	background(250);
	drawSrcDest();
	drawObstacles();
	population.run();

	year++;
	if(year>lifespan){
		generations++;
		year=0;
		//population=new Population();
		population.evaluate();
		if(bestRocket){
			bestRocket.pos=createVector(src.x,src.y,0);
		}
		population.selection();
	}
	p.html("Year : "+year);
	generationP.html("Generations : "+generations);
	if(bestTimer>timesWantBest){
		population.findBest();
		bestTimer=0;
	}
	bestTimer++;
	push();
	stroke(0,0,255);
	line(dest.x,dest.y,population.rockets[bestIndex].pos.x,population.rockets[bestIndex].pos.y);
	stroke(255,0,0);
	line(dest.x,dest.y,population.rockets[genIndex].pos.x,population.rockets[genIndex].pos.y);
	pop();
	//console.log("Best : "+bestIndex+" : "+population.rockets[bestIndex].pos);
}

function Rocket(pos,vel,dna){
	this.done=false;
	this.isCrashed=false;
	this.pos=pos||createVector();
	this.vel=vel||createVector();
	this.startVel=vel||this.vel;
	this.acc=createVector();
	this.dna=dna||new Dna();

	this.applyForce= function(force){
		this.acc.add(force);
	}

	this.update=function(){
		if(!this.done&&!this.isCrashed){
			this.applyForce(this.dna.genes[year]);
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);

			if(dist(dest.x,0,this.pos.x,0)<=destSize){
		        if(dist(0,dest.y,0,this.pos.y)<=destSize){
		            this.done=true;
		        }
		    }
			if(this.pos.x>width||this.pos.x<0||this.pos.y>height||this.pos.y<0){
				this.isCrashed=true;
			}
			if(hitObstacles(this.pos)){
				this.isCrashed=true;
			}
		}
	}

	this.draw=function(isBest){
		push();
		if(!isBest){
			fill(0,100,200,120);
			translate(this.pos.x,this.pos.y);
			rotate(this.vel.heading());
			rectMode(CENTER);
			triangle(0,-rocketH/2,0,rocketH/2,rocketW,0);
		}else{
			fill(0,250,0);
			translate(this.pos.x,this.pos.y);
			rotate(this.vel.heading());
			rectMode(CENTER);
			triangle(0,-rocketH,0,rocketH,2*rocketW,0);
		}
		pop();
	}

	this.calcFitness=function(){
		let d= dist(this.pos.x,this.pos.y,dest.x,dest.y);
		this.fitness=map(this.fitness,0,width,1,0);
		this.fitness=1/d;
		this.fitness=pow(this.fitness,4);
		if(this.done){
			this.fitness*=100;
		}
		if(this.isCrashed){
			this.fitness/=10;
		}
	}
}


function Population(){
	this.rockets=[];
	this.popSize=number;
	this.matingPool=[];


	for(i=0;i<this.popSize;++i){
		let startVel=createVector();//Math.random(),Math.random());
		this.rockets[i]=new Rocket(createVector(src.x,src.y),startVel);
	}
	this.matingPool=[];
	this.maxFit=0;

	this.run=function(){
		for(i=0;i<this.popSize;++i){
			this.rockets[i].update();
			this.rockets[i].draw();
		}
		if(bestRocket){

			bestRocket.update();
			bestRocket.draw(true);
		}
	}

	this.findBest=function(){
		let bestDistance=width+height;
		for(let i=0; i<this.popSize; ++i){
			if(!this.rockets[i].isCrashed){
				if(dist(this.rockets[i].pos.x,this.rockets[i].pos.y,dest.x,dest.y)<bestDistance){
					bestDistance=dist(this.rockets[i].pos.x,this.rockets[i].pos.y,dest.x,dest.y);
					bestIndex=i;
				}
			}
		}
	}

	this.evaluate=function(){
		for(let i=0; i<this.popSize; ++i){
			this.rockets[i].calcFitness();
			if(this.rockets[i].fitness>=this.maxFit){
				this.maxFit=this.rockets[i].fitness;
				if(!this.rockets[i].isCrashed){
					genIndex=i;
				}
			}

			if(this.rockets[i].done&&bestRocket==undefined){
				let bestGenes=[];
				for(let i=0; i<this.rockets[i].dna.genes.length; i++){
					bestGenes[i]=this.rockets[i].dna.genes[i];
				}
				bestRocket=new Rocket(createVector(src.x,src.y),this.rockets[i].startVel,new Dna(bestGenes));
				bestRocket.done=false;
				bestRocket.crashed=false;
			}
		}
		maxFitP.html("MaxFit : "+this.maxFit);
		for(let i=0; i<this.popSize; ++i){
			if(Number(this.maxFit)!=0){
			this.rockets[i].fitness/=this.maxFit;
			}
		}

		for(let i=0; i<this.popSize; ++i){
			var n=this.rockets[i].fitness*100;
			for(let j=0; j<n ; j++){
				this.matingPool.push(this.rockets[i]);
			}
		}
	}

	this.selection=function(){
		let newPopulation=[];
		for(let i=0; i<this.rockets.length; ++i){
			let parentA=random(this.matingPool).dna;
			let isCrashedA=parentA.isCrashed;
			let parentB=random(this.matingPool).dna;
			let isCrashedB=parentB.isCrashed;
			let isDoneB=parentB.done;
			let isDoneA=parentA.done;
			let childDna=parentA.crossOver(parentB,isCrashedA,isCrashedB,isDoneA,isDoneB);
			childDna.mutation();
			newPopulation[i]=new Rocket(createVector(src.x,src.y),createVector(),childDna);
		}
		this.rockets=newPopulation;
	}

}

function Dna(genes){
	if(genes==undefined)
	{
		this.genes=[];
		for(let i=0; i<lifespan; ++i){
			let force=p5.Vector.random2D();
			force.setMag(maxForce);
			this.genes.push(force);
		}
	}else{
		this.genes=genes;
	}
	this.crossOver=function(partner,isCrashedA,isCrashedB,isDoneA,isDoneB){
		let newgenes=[];
		let mid=floor(random(this.genes.length));
		if(isDoneA){
				for(let i=0; i<this.genes.length; i++){
					newgenes[i]=this.genes[i];
				}
				return new Dna(newgenes);
		}
		if(isDoneB){
				for(let i=0; i<this.genes.length; i++){
					newgenes[i]=partner.genes[i];
				}
				return new Dna(newgenes);
		}
		for(let i=0; i<this.genes.length; i++){
			if(i<=mid){
				if(!isCrashedA){
					newgenes[i]=this.genes[i];
				}
				else{
					newgenes[i]=partner.genes[i];
				}
			}else
			{
				if(!isCrashedA){
					newgenes[i]=/*this.genes[i];*/partner.genes[i];
				}
				else{
					newgenes[i]=/*partner.genes[i]*/this.genes[i];
				}
			}
		}

		return new Dna(newgenes);
	}
	this.mutation=function() {
		for(let i=0; i<this.genes.length; ++i){
			if(random(1)<mutationRate){
				let v=p5.Vector.random2D();
				v.setMag(maxForce);
				this.genes[i]=v;
			}
		}
	}
}
