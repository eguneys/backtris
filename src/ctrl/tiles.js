import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';

import makeExplosion from './explosion';

import makeHero from './hero';

export default function tiles(ctrl) {

  const { camera } = ctrl;
  
  const { width, height } = ctrl.data.game;

  this.explosion = new Pool(id => new makeExplosion(ctrl, this));

  this.hero = new makeHero(ctrl);

  this.init = d => {
    this.data = {};

    this.hero.init({});
  };

  this.move = dir => {
    this.hero.move(dir);
  };

  this.stop = dir => {
    this.hero.stop(dir);
  };

  this.explode = (x, y, z) => {
    this.explosion.acquire(_ => _.init({
      x, y, z
    }));
  };


  this.update = delta => {

    if (Math.random() < 0.3) 
    this.explode(u.rand(-width*0.5, width*0.5),
                 u.rand(-height*0.5, height*0.5),
                 0);

    this.explosion.each(_ => _.update(delta));

    this.hero.update(delta);
  };
 
}
