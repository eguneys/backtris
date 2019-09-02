import makeMesh from './mesh';
import * as geo from './geometry';
import makePhysics from './physics';
import makeLife from './life';

import * as u from './util';

import Pool from './pool';


export default function makeEntity(ctrl, mesh, onDie, liveSecs) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;
  
  const physics = new makePhysics({
    width: mesh.width,
    height: mesh.height
  });

  let life = new makeLife(onDie, {
    life: liveSecs
  });

  this.physics = physics;
  this.life = life;

  this.init = d => {
    this.data = { ...d };
  };
  
  const updateModel = delta => {
    mesh.updateModel(physics.values());
  };

  this.update = delta => {

    updateModel();

    life.update(delta);
  };

}
