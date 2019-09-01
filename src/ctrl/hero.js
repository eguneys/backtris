import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeEntity from '../entity';

import * as u from '../util';

import Pool from '../pool';

export default function hero(ctrl) {
 
  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  this.bullets = new makeBullet(ctrl, this);

  this.init = d => {
    this.data = { ...d };

    this.bullets.init({});
  };

  this.update = delta => {
   
    this.bullets.update(delta);
  };
 
}

function makeBullet(ctrl) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  let bWidth = 10;

  let geometry = geo.cubeGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {
    
  });

  let phy = this.entity.physics;


  this.init = d => {
    this.data = { ...d };

    phy.pos({ x: -width*0.5 });
    phy.acc({ y: -100 });
    phy.vel({ x: 100 });
  };

  this.update = delta => {
    this.entity.update(delta);
  };

}
