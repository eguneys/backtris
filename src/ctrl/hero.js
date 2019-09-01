import * as u from '../util';

import Pool from '../pool';

export default function hero(ctrl, g) {
 
  const { camera } = ctrl;
  const { width, height, holeRadius } = ctrl.data.game;

  this.bullets = new Pool(id => new makeBullet(ctrl, this));

  this.init = d => {
    this.data = { theta: u.PI * 0.5, 
                  z: camera.near + width * 0.2,
                  ...d };
  };


  this.project = () => {
    let vertex = [
      this.data.x,
      this.data.y,
      this.data.z
    ];
    return camera.project(vertex);
  };

  const updatePos = delta => {

    this.data.x = Math.cos(this.data.theta) * holeRadius * 2.0;
    this.data.y = Math.sin(this.data.theta) * holeRadius * 2.0;

  };

  this.update = delta => {

    updatePos(delta);
   
  };
 
}
