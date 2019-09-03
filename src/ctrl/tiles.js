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


  const frontColor = new co.shifter(co.Palette.ChileanFire);

  const stepColor = new co.shifter(co.Palette.LuckyP);

  let heroStepAlpha = new u.interpolator(0.1),
      heroStepAlpha2 = new u.interpolator(0.1);

  let frontLum = new u.interpolator(0.0);

  let frontAlpha,
      colorFace;

  this.init = d => {
    this.data = { 
      size: 30,
      ...d };

    const bWidth = this.data.size;

    let geometry;

    switch (this.data.role) {
    case 'leftwall': 
      colorFace = 'right';
      frontAlpha = new u.interpolator(0.5);

      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'rightwall': 
      colorFace = 'left';
      frontAlpha = new u.interpolator(0.5);

      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'topwall':
      colorFace = 'top';
      frontAlpha = new u.interpolator(0.5);

      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'space':
      frontAlpha = new u.interpolator(0.1);
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

  this.heroStep = (face) => {
    if (face === 'bottom') {
      heroStepAlpha2.set(0.9);
    } else {
      heroStepAlpha.set(0.6);
    }
  };

  this.bulletStep = (face) => {
    frontAlpha.set(0.9);
    if (this.data.role === 'space') {
      frontLum.set(0.1);
    } else {
      frontLum.set(0.2);
    }
  };

  const updateColors = delta => {
    frontLum.interpolate();
    frontAlpha.interpolate();
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

    this.mesh.paint('front', frontColor
                    .reset()
                    .alp(frontAlpha.get())
                    .hue(frontLum.get())
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
