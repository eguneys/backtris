import * as u from './util';

import Pool from './pool';

import makePlay from './ctrl/play';

export default function ctrl(state, g) {
  const defaults = () => ({
    tick: 0,
    draggable: {}
  });

  this.data = { ...defaults(), ...state };

  this.play = new makePlay(this, g);

  this.play.init(this);

  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);
  };
}
