import makeMesh from './mesh';
import * as geo from './geometry';
import makePhysics from './physics';
import makeLife from './life';

import * as u from './util';

import Pool from './pool';

import * as v from './vector';

const { vec3 } = v;

export default function makeEntity(ctrl, mesh, onDie, liveSecs, gravity = vec3(0.0, 10, 0.0)) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;
  
  const physics = new makePhysics({
    width: mesh.width,
    height: mesh.height,
    gravity
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
