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

  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);
  };
}
