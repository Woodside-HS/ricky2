class Enemy {

  constructor(game, startCell, randomPath) {
    this.game = game;
    this.currentCell = this.game.grid[0][0];
    this.loc = this.currentCell.center.copy();
    this.randomPath = randomPath;   //boolean to randomize or not
    this.radius = 15.0;
    this.vel = 3.0;       // velocity factor
    this.targetCell = this.nextTarget();
    this.target =  this.targetCell.center;
    var targetVec = this.target.copy().sub(this.loc);
    this.velVec = targetVec.copy().normalize().scale(this.vel);      // initial velocity vector
    this.kill = false;
    this.angle=this.velVec.angle()


     this.img = Enemy.image3;


  }

  run() {
    this.update();
    this.render();
  }

  // nextTarget()
  // Return the next cell in the path to the root target
  // The parent of the current cell is always the optimal path
  // If we want some randomness in the path, choose from among all
  // the neighbor cells with a lesser distance to the root.
  nextTarget() {
    if(!this.randomPath)
        return(this.currentCell.parent);    // the parent cell is always the shortest path
    else {  // else choose from cells with a lesser distance to the root
        let candidates = [];
        for(let i = 0; i < this.currentCell.neighbors.length; i++) {
            if(this.currentCell.neighbors[i].dist < this.currentCell.dist)
                candidates.push(this.currentCell.neighbors[i]);
            }
        // randomly pick one of the candidates
        return(candidates[Math.floor(Math.random() * candidates.length)]);
        }
    }

  // render()
  // Draw the enemy at its current location
  // Enemies with a randomized path are blue and
  // enemies with an optimal path are green
  render() {
    var ctx = this.game.context
    ctx.save();

    ctx.translate(this.loc.x, this.loc.y);
    ctx.rotate(this.angle + Math.PI/2);
    ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    ctx.restore();
  }

    // update()
    // Calculate a new location for this enemy.
    // If has reached the root cell, kill it
    // If it has reached the current target along the path,
    // find a new target and rotate the velocity in the direaction
    // of the new target.
  update() {
    if(this.loc.dist(this.target) <= this.vel) {    // if we have reached the current target
        this.currentCell = this.targetCell;
        if(this.currentCell == this.game.root) {   // we have reached the end of the path
            this.kill = true;
            towerGame.health = towerGame.health - 1;
            return;
            }
        this.targetCell = this.nextTarget();                  // set a new target
        if(!this.targetCell) {
            this.kill = true;   // can happen if user blocks cells while enemies are attacking
            return;
            }
         this.target = this.targetCell.center;      // always target the center of the cell
        }
    // calculate new vector from current location to the target.
    var targetVec = this.target.copy().sub(this.loc);    // the direction we want to go
    var angleBetween = this.velVec.angleBetween(targetVec);
    if(angleBetween) {  // if there is some angle between
        if(angleBetween > 0 && angleBetween > Math.PI)  // positive and > 180 degrees
            angleBetween = angleBetween - 2*Math.PI;   // make negative and < 180 degrees
        else if(angleBetween < 0 && angleBetween < -Math.PI)   // negative and < -180 degrees
            angleBetween = angleBetween = angleBetween + 2*Math.PI;  // make positive and < 180 degrees

        // now rotate the current velocity in the direction of the targetAngle
        // a little at a time
        this.velVec.rotate(angleBetween/2);
        this.angle=this.velVec.angle();
        }
    this.loc.add(this.velVec);          // apply velocity to location
  }

} // end class ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
class Enemy1 extends Enemy {
  constructor(game, startCell, randomPath) {
    super(game, startCell, randomPath)
  }
}
class Enemy2 extends Enemy {
  constructor(game, startCell, randomPath) {
    super(game, startCell, randomPath)
  }
}
