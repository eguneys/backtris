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


  let colorFace;
  
  this.init = d => {
    this.data = { 
      size: 30,
      ...d };

    const bWidth = this.data.size;

    let geometry;

    switch (this.data.role) {
    case 'leftwall': 
      colorFace = 'right';
      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'rightwall': 
      colorFace = 'left';
      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'topwall':
      colorFace = 'top';
      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'space':
      geometry = geo.planeGeometry(bWidth);
      break;
    default:
      throw new Error("Bad tile role " + this.data.role);
    }
    this.mesh = new makeMesh(camera, geometry, {
      width: bWidth,
      height: bWidth
    });
  };

  const stepColor = new co.shifter(co.Palette.LuckyP);

  let heroStepAlpha = new u.interpolator(0.1),
      heroStepAlpha2 = new u.interpolator(0.1);

  this.heroStep = (face) => {
    if (face === 'bottom') {
      heroStepAlpha2.set(0.9);
    } else {
      heroStepAlpha.set(0.6);
    }
  };

  const updateColors = delta => {
    heroStepAlpha.interpolate();
    heroStepAlpha2.interpolate();

    this.mesh.paint('bottom', stepColor
                    .reset()
                    .alp(heroStepAlpha2.get())
                    .css());

    this.mesh.paint(colorFace, stepColor
                    .reset()
                    .lum(heroStepAlpha.get())
                    .css());    
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
    updateColors(delta);
  };
  

}
