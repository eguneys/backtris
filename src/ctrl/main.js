import * as u from '../util';

import Pool from '../pool';

import makeCamera from '../camera';

import makePlay from './play';

export default function ctrl(state, g) {
  const defaults = () => ({
    tick: 0,
    draggable: {}
  });

  this.data = { ...defaults(), ...state };

  this.camera = new makeCamera(this);

  this.play = new makePlay(this, g);

  this.play.init(this);

  let hero = this.play.hero;

  this.pressKey = key => {
    if (key === 'up') {
      hero.move([0, -1]);
    } else if (key === 'down') {
      hero.move([0, 1]);
    } else if (key === 'left') {
      hero.move([-1, 0]);
    } else if (key === 'right') {
      hero.move([1, 0]);
    }
  };

  this.releaseKey = key => {
    if (key === 'up') {
      hero.stop([0, -1]);
    } else if (key === 'down') {
      hero.stop([0, 1]);
    } else if (key === 'left') {
      hero.stop([-1, 0]);
    } else if (key === 'right') {
      hero.stop([1, 0]);
    }    
  };


  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);
    
    // this.camera.update(delta);
  };
}
