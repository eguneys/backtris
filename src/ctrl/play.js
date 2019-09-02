import { objForeach, objMap } from '../util2';
import * as u from '../util';
import Pool from '../pool';

import * as levels from '../levels';

import makeTile from './tiles';

import makeHero from './hero';

export default function ctrl(ctrl, g) {

  const { width, height, tileWidth } = ctrl.data.game;

  this.tiles = new Pool(id => new makeTile(ctrl), {
    warnLeak: 1000
  });

  this.hero = new makeHero(ctrl);

  const tilePos2WorldPos = pos => {
    return {
      x: -width * 0.45 + pos[1] * tileWidth,
      y: -height * 0.44 + pos[0] * tileWidth
    };
  };

  const worldPos2TilePos = pos => {
    return [
      Math.floor((pos.y + height * 0.44) / tileWidth),
      Math.floor((pos.x + width * 0.45) / tileWidth)
    ];
  };

  this.init = d => {
    this.data = {
      tiles: levels.make(),
      ...d
    };

    this.tiles.releaseAll();

    objForeach(this.data.tiles, (key, tile) => {
      const pos = levels.key2pos(key);

      this.tiles.acquire(_ => _.init({
        ...tilePos2WorldPos(pos),
        ...tile
      }));
    });
  };

  const collisions = (dims) => {
    let collTiles = { 'lefttop': [dims.left, dims.top],
                     'leftbottom': [dims.left, dims.bottom],
                     'righttop': [dims.right, dims.top],
                     'rightbottom': [dims.right, dims.bottom]
                   };

    collTiles = objMap(collTiles, (_, pos) => {
      const key = levels.pos2key(
        worldPos2TilePos({ x: pos[0], y: pos[1] }));

      const tile = this.data.tiles[key];

      return tile.role === 'wall';
    });

    return {
      left: collTiles['lefttop'] && collTiles['leftbottom'],
      top: collTiles['lefttop'] && collTiles['righttop'],
      right: collTiles['lefttop'] && collTiles['rightbottom'],
      bottom: collTiles['rightbottom'] && collTiles['leftbottom']
    };
  };

  const updateHeroPhysics = delta => {
    const { before, after } = this.hero.dimensions(delta);

    const afterCollisions = collisions(after);

    this.hero.applyPhysics(delta, afterCollisions);
  };

  this.update = delta => {
    this.tiles.each(_ => _.update(delta));

    updateHeroPhysics(delta);

    this.hero.update(delta);
  };
}
