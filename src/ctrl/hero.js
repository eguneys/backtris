import * as u from '../util';

import Pool from '../pool';

export default function hero(ctrl, g) {
 
  const { camera } = ctrl;
  const { width, height, holeRadius } = ctrl.data.game;

  this.bullets = new Pool(id => new makeBullet(ctrl, this));

  this.init = d => {
    this.data = { theta: 0.0, z: camera.far, ...d };
  };

  const maybeSpawnBullets = u.withDelay(() => {
    this.bullets.acquireLimit(_ => _.init({
      theta: this.data.theta
    }), 10);
  }, 100);

  const updatePos = delta => {
    this.data.theta += delta * 0.01* 0.1;
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
    // this.data.theta += delta * 0.01 * 0.03;

    this.data.z += -delta * 0.1 * 8.0;

    this.data.x = Math.cos(this.data.theta) * holeRadius ;
    this.data.y = Math.sin(this.data.theta) * holeRadius ;
  };

  const maybeKill = () => {
    if (this.data.z < camera.near) {
      heroCtrl.bullets.release(this);
    }
  };

  this.update = delta => {
    updatePos(delta);

    maybeKill();
    
  };
  
}
