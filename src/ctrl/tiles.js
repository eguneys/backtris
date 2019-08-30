import { objFilter } from '../util2';

import Pool from '../pool';

import * as cu from './util';
import * as u from '../util';

import * as finder from './finder';

export default function tiles(ctrl, g) {

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

          if (fulls.length === 3 &&
              fulls[0].letter === 'a' &&
              fulls[1].letter === 'c' &&
              fulls[2].letter === 'k') {
           
            [...mvs, b].forEach(_ => delete this.data.tiles[_]);

            ctrl.data.score++;
          }
        });
    });

  };

  this.update = delta => {

    updateDragInfo(delta);
    maybeRemoveTiles(delta);


  };
 
}

