import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';
import * as geo from '../geometry';

import makeHero from './hero';

import makeBlock from './block';
import makeEdge from './edge';


export default function tiles(ctrl, g) {

  const { camera } = ctrl;
  
  const { width, height } = ctrl.data.game;

  this.edges = new Pool(id => new makeEdge(ctrl), {
  });


  this.hero = new makeHero(ctrl, g);


  this.blocks = new Pool(id => new makeBlock(ctrl));

  this.init = d => {
    this.data = {};

    this.hero.init();
  };

  this.move = dir => {
    let dTheta = u.PI * 0.25 * dir;
    this.edges.each(_ => _.rotate(dTheta));
  };

  const ringGeo = geo.ringGeometry(20, u.PI);
  const maybeSpawnEdges = u.withDelay(_ => {

    this.edges.acquire(_ => _.init({}, ringGeo));

    const { tick } = ctrl.play.data;

    this.edges.each((_, i) => {
      // i = u.smoothstep(10, this.edges.alives(), i)
      //   * this.edges.alives() - 10;

      _.move(
        Math.sin(Math.sin(i * 0.1) * Math.cos(tick * 0.001))
          * 100,
        Math.sin(Math.sin(i * 0.1) * Math.cos(tick * 0.001))
          * 100);
    });

  }, 100);

  const thetas = [
    u.PI * 0.5,
    u.PI * 0.75,
    u.PI * 0.25,
    u.PI * 1.0,
    0,
  ];

  const maybeSpawnBlock = u.withDelay(_ => {
    const theta = thetas[u.randInt(0, thetas.length)];

    this.blocks.acquire(_ => _.init({
      theta,
      tTheta: theta
    }));

  }, 500);


  this.update = delta => {

    maybeSpawnEdges(delta);
    //maybeSpawnBlock(delta);

    this.edges.each(_ => _.update(delta));

    this.blocks.each(_ => _.update(delta));

    this.hero.update(delta);
  };
 
}
