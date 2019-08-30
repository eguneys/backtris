import { objFilter } from '../util2';

import Pool from '../pool';

import * as cu from './util';
import * as u from '../util';

import * as finder from './finder';

export default function tiles(ctrl, g) {

  this.falling = new Pool(id => new makeFalling(this));

  this.init = d => {
    this.data = {
      tiles: {},
      next: [
        shapeToPosInfo(cu.getShape(cu.randomShapeKey())),
        shapeToPosInfo(cu.getShape(cu.randomShapeKey())),
        shapeToPosInfo(cu.getShape(cu.randomShapeKey())),
      ]
    };
  };

  this.commitTile = () => {
    const nextI = ctrl.data.draggable.current.nextIndex;

    if (this.data.placeTiles) {
      this.data.placeTiles.forEach(({ key, tileI }) => {
        this.data.tiles[key] = {
          color: this.data.next[nextI].color,
          letter: this.data.next[nextI].letters[tileI]
        };
      });

      this.data.next[nextI] = shapeToPosInfo(cu.getShape(cu.randomShapeKey()));
    } else {
      
      let {shape} = this.data.next[nextI];

      //shape = cu.rotateShape(shape);
      //this.data.next[nextI].shape = shape;
      //this.data.next[nextI].tiles = cu.shapeToPosMap(shape);
      this.data.next[nextI] = shapeToPosInfo(cu.getShape(cu.randomShapeKey()));

    }
  };

  const shapeToPosInfo = (shape) => {
    return {
      shape,
      color: shape.color,
      letters: cu.shapeToPosMap(shape).map(cu.randomLetter),
      tiles: cu.shapeToPosMap(shape)
    };
  };

  const updateDragInfo = delta => {
    
    const cur = ctrl.data.draggable.current;

    delete this.data.placeTiles;

    if (cur && cur.tiles) {
      if (cur.tiles.every(canPlaceTile)) {
        this.data.placeTiles = cur.tiles;
      }
    }
  };

  const canPlaceTile = tile => {
    if (!tile) return false;

    if (this.data.tiles[tile.key]) {
      return false;
    }
    return true;
  };

  const maybeRemoveTiles = delta => {

    const bs = Object.keys(
      objFilter(this.data.tiles, (k, v) => v.letter === 'b'));

    bs.forEach(b => {
      finder.movementVector(b)
        .forEach(mvs => {

          let fulls = mvs.map(_ => this.data.tiles[_])
            .filter(_ => !!_);

          if (fulls.length === 3) {
              // &&
              // fulls[0].letter === 'a' &&
              // fulls[1].letter === 'c' &&
              // fulls[2].letter === 'k') {
           
            let fallingKeys = [b, ...mvs];

            let falling = fallingKeys.map(_ => ({
              key: _,
              ...this.data.tiles[_]
            }));

            fallingKeys.forEach(_ => delete this.data.tiles[_]);


            this.falling.acquire(_ => _.init({
              falling
            }));

            ctrl.data.score++;
          }
        });
    });

  };

  this.update = delta => {

    updateDragInfo(delta);
    maybeRemoveTiles(delta);

    this.falling.each(_ => _.update(delta));

  };
 
}


function makeFalling(ctrl) {
  
  this.init = (d) => {
    this.data = { ...defaults(), ...d };
  };


  this.update = delta => {
    const dt = delta * 0.01;

    this.data.mergeT += dt * 0.1;

    if (this.data.mergeT > 1.0) {
      this.data.mergeT = 0.0;
      this.data.merge++;

      if (this.data.merge === 3) {
        ctrl.falling.release(this);
      }
    }
  };

  const defaults = () => ({
    merge: 0,
    mergeT: 0
  });
  
}
