import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';

import makeExplosion from './explosion';

import makeHero from './hero';

export default function tiles(ctrl) {

  const { camera } = ctrl;
  
  const { width, height } = ctrl.data.game;

  this.explosion = new makeExplosion(ctrl);

  this.hero = new makeHero(ctrl);

  this.init = d => {
    this.data = {};

    this.explosion.init({});
    this.hero.init({});
  };

  this.move = dir => {
  };


  this.update = delta => {

    this.explosion.update(delta);

    this.hero.update(delta);
  };
 
}
