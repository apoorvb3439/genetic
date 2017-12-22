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
let mutationRate=0.01;
let maxForce=0.2;
let rocketH=6;
let rocketW=20;

function setup() {
	createCanvas(windowWidth-20,windowHeight-100);
	dest=createVector(100,100);
	src=createVector(width-100,height-100);
	generations=0;
	p=createP();
	generationP=createP("Generations : ");
	maxFitP=createP("MaxFit : ");
	createObstacles();
	population=new Population();

}

function drawSrcDest(){
	fill(0,255,0,150);
	rect(dest.x,dest.y,srcSize,srcSize);
	rect(src.x,src.y,destSize,destSize);
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
	//	population=new Population();

		population.evaluate();
		population.selection();

	}
	p.html("Year : "+year);
	generationP.html("Generations : "+generations);
	if(year==lifespan){
	for(let r of population.rockets){
		if(r.isCrashed==false){
			console.log(r);
		}
	}
	}
}

function Rocket(pos,vel,dna){
	this.done=false;
	this.isCrashed=false;
	this.pos=pos||createVector();
	this.vel=vel||createVector();
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

			if(dist(dest.x,0,this.pos.x,0)<=destSize/2+rocketW/2){
		        if(dist(0,dest.y,0,this.pos.y)<=destSize/2+rocketH/2){
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

	this.draw=function(){
		fill(0,0,0,120);
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0,0,rocketW,rocketH);
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
	}

	this.evaluate=function(){
		for(let i=0; i<this.popSize; ++i){
			this.rockets[i].calcFitness();
			if(this.rockets[i].fitness>this.maxFit){
				this.maxFit=this.rockets[i].fitness;
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
