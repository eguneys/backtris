import * as u from './util';


export default function defaults(width, height) {

  const ratio = height / width;

  const holeRadius = width * 0.03;

  const game = {
    state: u.States.Over,
    highscore: 0,
    width,
    height,
    ratio,
    holeRadius
  };

  return {
    game
  };
 
}
