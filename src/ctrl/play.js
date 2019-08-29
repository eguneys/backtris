import * as u from '../util';

import makeTiles from './tiles';

export default function ctrl(ctrl, g) {

  this.data = ctrl.data;

  this.tiles = new makeTiles(ctrl);

  let play;
  this.init = () => {
    this.data.gameover = 0;
    this.data.score = 0;

    this.tiles.init();    
  };

  this.reset = () => {
    this.init();
  };


  const maybeUpdateScore = delta => {
    
  };

  this.update = delta => {
    maybeUpdateScore(delta);

    this.tiles.update(delta);
  };
}
