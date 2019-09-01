import makeMesh from './mesh';
import * as geo from './geometry';
import makePhysics from './physics';
import makeLife from './life';

import * as u from './util';

import Pool from './pool';


export default function makeEntity(ctrl, mesh, onDie) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;
  
  const physics = new makePhysics({
    width: mesh.width,
    height: mesh.height
  });

  let life = new makeLife(() => {
    // hero.bullets.release(this);
  });

  this.physics = physics;

  this.init = d => {
    this.data = { ...d };
  };
  
  const updateModel = delta => {
    mesh.updateModel(physics.values());
  };

  const updatePhysics = delta => {
    physics.update(delta);
  };
  
  this.update = delta => {

    updatePhysics(delta);
    updateModel();

    life.update(delta);
  };

}
