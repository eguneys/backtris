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

    let geometry;

    switch (this.data.role) {
    case 'wall': 
      geometry = geo.cubeGeometry(bWidth);
      break;
    case 'space':
      geometry = geo.planeGeometry(bWidth);
      break;
    }
    this.mesh = new makeMesh(camera, geometry, {
      width: bWidth,
      height: bWidth
    });
  };

  const stepColor = new co.shifter(co.Palette.LuckyP);

  let heroStepAlpha = 0.1,
      tHeroStepAlpha = 0.1;

  this.heroStep = () => {
    heroStepAlpha = 0.6;
  };

  const updateColors = delta => {
    heroStepAlpha = u.interpolate(heroStepAlpha, tHeroStepAlpha, 0.1);

    this.mesh.paint('top', stepColor
                    .reset()
                    .lum(heroStepAlpha)
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
