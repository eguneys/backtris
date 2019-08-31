import { objFilter } from '../util2';

import Pool from '../pool';

import * as cu from './util';
import * as u from '../util';

import * as finder from './finder';

export default function tiles(ctrl, g) {

  const { width, height } = ctrl.data.game;

  this.edges = new Pool(id => new makeEdge(ctrl), {
    warnLeak: 10000
  });

  this.init = d => {
    this.data = {};
  };

  const maybeSpawnEdges = delta => {
    if (this.edges.alives() < 2000) {
      for (let i = 0; i < 10; i++) {
        this.edges.acquire(_ => _.init({
          speed: u.rand(0, 1),
          theta: u.rand(0, u.TAU),
          z: -width*0.78
        }));
      }
    }
  };


  this.update = delta => {

    maybeSpawnEdges(delta);

    this.edges.each(_ => _.update(delta));

  };
 
}


function makeEdge(ctrl) {

  const { width, height, holeRadius } = ctrl.data.game;

  const tilesCtrl = ctrl.play.tiles;

  let fov = width * 0.8,
      pCX = width * 0.5 ,
      pCY = height * 0.5;
  
  this.init = (d) => {
    this.data = { ...defaults(), ...d };
  };

  const project = (v3) => {
    let pScale = fov / (fov + v3[2]);

    return [v3[0] * pScale + pCX,
            v3[1] * pScale + pCY];
  };

  const updateProject = () => {

    const { tick } = ctrl.data;

    let length = 10-this.data.alpha * this.data.alpha * 5;
    
    length *= u.usin(Math.cos(tick * 0.005));

    let p1 = project([this.data.x,
                      this.data.y,
                      this.data.z - length]);

    let p2 = project([this.data.x,
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
    this.data.z += delta * 0.1;

    this.data.x = Math.cos(this.data.theta) * holeRadius;
    this.data.y = Math.sin(this.data.theta) * holeRadius;

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

  const defaults = () => ({

  });
  
}
