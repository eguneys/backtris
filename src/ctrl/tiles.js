import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';
import * as geo from '../geometry';
import makeMesh from '../mesh';

import makePhysics from '../physics';

export default function tiles(ctrl, g) {

  const { camera } = ctrl;
  
  const { width, height } = ctrl.data.game;

  this.explosion = new makeExplosion(ctrl, g);
  this.explosion.init({});

  this.init = d => {
    this.data = {};
  };

  this.move = dir => {
  };


  this.update = delta => {

    this.explosion.update(delta);

    // this.hero.update(delta);
  };
 
}

function makeExplosion(ctrl, g) {

  const { camera } = ctrl;

  const width = 100;

  let geometry = geo.cubeGeometry(width);
  this.mesh = new makeMesh(camera, geometry, {
    width: width,
    height: width
  });

  this.physics = new makePhysics({
    width,
    height: width
  });
  
  this.init = d => {
    this.data = { ...d };
  };

  const updateModel = delta => {
    this.mesh.updateModel(this.physics.values());
  };

  const updatePhysics = delta => {
    this.physics.update(delta);
  };
  
  this.update = delta => {

    updatePhysics();
    updateModel();

  };
  
}
