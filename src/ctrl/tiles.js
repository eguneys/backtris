import { objFilter } from '../util2';

import Pool from '../pool';

import * as co from '../colors';

import * as u from '../util';

import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeEntity from '../entity';

export default function makeTile(ctrl, tiles) {
  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;
  
  this.init = d => {
    this.data = { 
      size: 30,
      ...d };

    const bWidth = this.data.size;

    let geometry = geo.cubeGeometry(bWidth);
    this.mesh = new makeMesh(camera, geometry, {
      width: bWidth,
      height: bWidth
    });
  };

  const stepColor = new co.shifter(co.Palette.LuckyP);

  this.heroStep = () => {
    this.mesh.paint('top', stepColor.css());
  };

  const updateModel = delta => {
    this.mesh.updateModel({
      x: this.data.x,
      y: this.data.y,
      z: 0
    });
  };


  this.update = delta => {
    updateModel(delta);
  };
  

}
