'use strict'

class Tower {
  // issue#1 use preloaded images
  constructor( cost, tImg, bImg, ability) {
    this.loc = vector2d(0, 0);
    this.placed = false;
    this.visible = false;
    this.cost = cost;
    this.bulletImg = bImg;
    this.towImg = tImg;
    this.towAngle = 0;
    this.lastTime = Date.now();
    this.coolDown = 500;
    towerGame.bankValue = towerGame.bankValue- this.cost;
    this.enemies=towerGame.enemies
    this.range=200

    switch(ability){
      case "freeze":
        this.coolDown = 3000;
        break;
      case "normal":
        this.coolDown = 2000;
        break;
      case "explosive":
        this.coolDown = 2000;
        break;
      case "fast":
          this.coolDown = 180;
          break;
      default:
        this.coolDown = 2000;
    }

    console.log(ability);

    this.ability = ability;
    this.target=null
    this.enemy=null
  }

  run() {
    this.render();
    this.update();
  }
  render() {
    var ctx = towerGame.context;
    ctx.save();
      ctx.translate(this.loc.x, this.loc.y);
      ctx.rotate(this.towAngle + Math.PI/2);
      if (this.visible) { //  not visible when first created
        ctx.drawImage(this.towImg, -this.towImg.width/2,-this.towImg.height/2);
        }
    ctx.restore();
  }
  update() {
    //  Rotate turret to follow mouse
    this.enemy=this.findEnemy()
    if(this.enemy) {
      this.target=this.enemy.loc
    }else{
      this.target=vector2d(towerGame.canvas.mouseX,towerGame.canvas.mouseY)
    }
    let dx = this.loc.x - this.target.x;
    let dy = this.loc.y - this.target.y;
    this.towAngle = Math.atan2(dy, dx) - Math.PI;
    this.checkEnemies();
  }

  checkEnemies(){
    let dx = this.loc.x - this.target.x;
    let dy = this.loc.y - this.target.y;
    let dist = vector2d(dx,dy).length();
    let millis = Date.now();
     if(this.placed &&
      dist < this.range &&
      (millis-this.lastTime > this.coolDown ) && towerGame.enemies.length != 0 && this.target.x != towerGame.canvas.mouseX){          // reset lastTime to current time
          this.lastTime = millis;
          let bulletLocation = vector2d(this.loc.x, this.loc.y);
          let b = new Bullet(bulletLocation , this.bulletImg, this.towAngle);
          towerGame.bullets.push(b);

    }
  }
  findEnemy(){
    for(let i=0;i<this.enemies.length;i++){
      if(this.enemies[i]){
        if(this.enemies[i].loc.dist(this.loc)<this.range){
          return this.enemies[i]
        }
      }
    }
  }

}//  end Tower class +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
