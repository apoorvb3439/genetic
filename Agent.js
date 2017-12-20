function Color(r,g,b,a){
    this.r=r;
    this.g=g;
    this.b=b;
    this.a=a;
}

function Pos(x, y){
    this.x=x;
    this.y=y;
}

function Agent(pos,speedx,speedy){
    this.historySize=100;
    this.history=[];
    this.pos=pos;

    this.size=12;
    this.Color=new Color(Math.random()*255,Math.random()*255,Math.random()*255,120);

    this.speedx=speedx;
    this.speedy=speedy;

    this.velocityx=this.speedx;
    this.velocityy=-this.speedy;

    this.draw=function(){
        //noStroke();
        fill(this.Color.r,this.Color.g,this.Color.b);
        ellipse(this.pos.x,this.pos.y,this.size,this.size)
    }

    this.collide=function(){
        if(this.pos.x>width||this.pos.x<0){
            this.velocityx=-this.velocityx;
        }
        if(this.pos.y>height||this.pos.y<0){
            this.velocityy=-this.velocityy;
        }
    }

    this.eatPoison=function(){
        for(let p of poisons){
            if(this.pos.x<p.pos.x+p.size/2&&this.pos.x>p.pos.x-p.size/2){
                if(this.pos.y<p.pos.y+p.size/2&&this.pos.y>p.pos.y-p.size/2){
                    return true;
                }
            }
        }
        return false;
    }

    this.eatFood=function(){
        for(let p of foods){
            if(this.pos.x<p.pos.x+p.size/2&&this.pos.x>p.pos.x-p.size/2){
                if(this.pos.y<p.pos.y+p.size/2&&this.pos.y>p.pos.y-p.size/2){
                    return true;
                }
            }
        }
        return false;
    }

    this.move=function(){
        this.pos.x+=noise(Math.random()*100)*5*this.velocityx;
        this.pos.y+=noise(Math.random()*100)*5*this.velocityy;
        this.collide();

        if(this.history.length>this.history.historySize){
            this.history.shift();
        }
        this.history.push(new Agent(this.pos,this.velocityx,this.velocityy));

    }

}
