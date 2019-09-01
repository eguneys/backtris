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
    if (key === 'left') {
      this.play.tiles.hero.move(1);
    } else if (key === 'right') {
      this.play.tiles.hero.move(-1);
    }
  };

  this.releaseKey = key => {
    if (key === 'left') {
      this.play.tiles.hero.stop(1);
    } else if (key === 'right') {
      this.play.tiles.hero.stop(-1);
    }
  };

  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);

    this.camera.update(delta);
  };
}
