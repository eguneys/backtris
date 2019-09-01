import * as u from '../util';

import Pool from '../pool';

export default function hero(ctrl, g) {
 
  const { camera } = ctrl;
  const { width, height, holeRadius } = ctrl.data.game;

  this.bullets = new Pool(id => new makeBullet(ctrl, this));

  this.init = d => {
    this.data = { vTheta: 0.0, theta: 0.0, z: camera.far, ...d };
  };


  this.move = dir => {
    this.data.vTheta = dir;
  };

  this.stop = dir => {
    if (this.data.vTheta === dir) {
      this.data.vTheta = 0;
    }
  };

  const maybeSpawnBullets = u.withDelay(() => {
    this.bullets.acquireLimit(_ => _.init({
      theta: this.data.theta,
    }), 3 * 3);
  }, 50);

  const updatePos = delta => {
    const { tick } = ctrl.data;

    this.data.theta += this.data.vTheta * delta * 0.01 * 0.3;
    this.data.theta = this.data.theta % u.TAU;
  };

  this.update = delta => {

    updatePos(delta);
    maybeSpawnBullets(delta);
 
    this.bullets.each(_ => _.update(delta));
   
  };
 
}

function makeBullet(ctrl, heroCtrl) {

  const { camera } = ctrl;
  const { width, height, holeRadius } = ctrl.data.game;

  this.init = d => {
    this.data = { theta: 0.0, z: camera.far, ...d };
  };

  const updatePos = delta => {
    // this.data.theta += delta * 0.01;

    this.data.z += -delta * 0.1 * 8.0;

    this.data.x = Math.cos(this.data.theta) * holeRadius * 1.2;
    this.data.y = Math.sin(this.data.theta) * holeRadius * 1.2;
    
  };

  const maybeKill = () => {
    if (this.data.z < camera.near * 0.9) {
      heroCtrl.bullets.release(this);
    }
  };

  this.update = delta => {
    updatePos(delta);

    maybeKill();

  };
  
}
