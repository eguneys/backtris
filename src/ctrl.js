import * as u from './util';

import Pool from './pool';

import makeCamera from './camera';

import makePlay from './ctrl/play';

export default function ctrl(state, g) {
  const defaults = () => ({
    tick: 0,
    draggable: {}
  });

  this.data = { ...defaults(), ...state };

  this.camera = new makeCamera(this);

  this.play = new makePlay(this, g);

  this.play.init(this);

  this.pressKey = key => {
    if (key === 'up') {
      this.play.tiles.move([0, -1]);
    } else if (key === 'down') {
      this.play.tiles.move([0, 1]);
    } else if (key === 'left') {
      this.play.tiles.move([-1, 0]);
    } else if (key === 'right') {
      this.play.tiles.move([1, 0]);
    }
  };

  this.releaseKey = key => {
    if (key === 'up') {
      this.play.tiles.stop([0, -1]);
    } else if (key === 'down') {
      this.play.tiles.stop([0, 1]);
    } else if (key === 'left') {
      this.play.tiles.stop([-1, 0]);
    } else if (key === 'right') {
      this.play.tiles.stop([1, 0]);
    }    
  };


  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);
    
    // this.camera.update(delta);
  };
}
