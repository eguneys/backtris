import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';

import makeExplosion from './explosion';

export default function tiles(ctrl, g) {

  const { camera } = ctrl;
  
  const { width, height } = ctrl.data.game;

  this.explosion = new makeExplosion(ctrl, g);

  this.init = d => {
    this.data = {};

    this.explosion.init({});
  };

  this.move = dir => {
  };


  this.update = delta => {

    this.explosion.update(delta);

    // this.hero.update(delta);
  };
 
}
