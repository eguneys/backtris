import { objFilter } from '../util2';

import Pool from '../pool';

import * as u from '../util';

import makeHero from './hero';

import makeBlock from './block';


export default function tiles(ctrl, g) {

  const { width, height } = ctrl.data.game;

  this.edges = new Pool(id => new makeEdge(ctrl), {
    warnLeak: 10000
  });


  this.hero = new makeHero(ctrl, g);


  this.blocks = new Pool(id => new makeBlock(ctrl));
  

  this.init = d => {
    this.data = {};

    this.hero.init();
  };

  const maybeSpawnEdges = delta => {
    if (this.edges.alives() < 50) {
      for (let i = 0; i < 10; i++) {
        this.edges.acquire(_ => _.init({
          speed: u.rand(0, 1),
          theta: u.rand(0, u.TAU),
          z: -width*0.78
        }));
      }
    }
  };

  const maybeSpawnBlock = u.withDelay(_ => {
    this.blocks.acquire(_ => _.init({
      theta: u.rand(0, u.TAU)
    }));
  }, 1000);

  const updateCollisions = delta => {

    this.blocks.each(block => {
      const { z , theta } = block.data;

      this.hero.bullets.each(bullet => {
        const { z: z2, theta: theta2 } = bullet.data;

        if (Math.abs(z - z2) < 50) {
          if (Math.abs(theta - theta2) < 0.02) {

            this.hero.bullets.release(bullet);
            this.blocks.release(block);
            console.log("hit");

          }
        }

      });
    });

  };


  this.update = delta => {

    maybeSpawnEdges(delta);
    maybeSpawnBlock(delta);

    updateCollisions(delta);

    this.edges.each(_ => _.update(delta));

    this.blocks.each(_ => _.update(delta));

    this.hero.update(delta);
  };
 
}


function makeEdge(ctrl) {

  const { camera } = ctrl;

  const { width, height, holeRadius } = ctrl.data.game;

  const tilesCtrl = ctrl.play.tiles;

  this.init = (d) => {
    this.data = { 
      yOffset: u.rand(0, holeRadius * 0.4),
      xOffset: u.rand(0, holeRadius * 0.4),
      zSpeed: u.rand(0, 1),
      ...d };
  };

  const updateProject = () => {

    const { tick } = ctrl.data;

    let length = 10-this.data.alpha * this.data.alpha * 5;
    
    // length *= u.usin(Math.cos(tick * 0.001));
    length *= this.data.zSpeed* 0.5;

    let p1 = camera.project([this.data.x,
                      this.data.y,
                      this.data.z - length]);

    let p2 = camera.project([this.data.x,
                      this.data.y,
                      this.data.z + length]);

    if (Math.abs(p1[0] - p2[0]) > 100) {
      // debugger;
    }
    
    this.data.projects = [
      p1, p2
    ];

  };

  const updatePos = delta => {

    this.data.theta += delta * 0.01 * 0.1;

    this.data.z += delta * 0.05 + this.data.zSpeed * delta * 0.1;

    this.data.x = Math.cos(this.data.theta) * holeRadius + this.data.xOffset;
    this.data.y = Math.sin(this.data.theta) * holeRadius + this.data.yOffset;

    this.data.alpha = u.smoothstep(-width*0.8, -width*0.5, this.data.z);

  };

  const maybeKillEdge = () => {
    if (this.data.z > -width*0.5) {
      tilesCtrl.edges.release(this);
    }
  };

  this.update = delta => {

    updatePos(delta);
    updateProject();

    maybeKillEdge();

  };
}
