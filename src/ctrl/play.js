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
      u.clamp(0, levels.rows - 1, 
              Math.floor((pos.y + height * 0.44) / tileWidth)),
      u.clamp(0, levels.cols - 1, 
              Math.floor((pos.x + width * 0.45) / tileWidth))
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

      tile.ctrl = this.tiles.acquire(_ => _.init({
        ...tilePos2WorldPos(pos),
        ...tile.role
      }));
    });
  };

  const collisionKeys = (dims) => {
    let collTiles = { 'lefttop': [dims.left, dims.top],
                     'leftbottom': [dims.left, dims.bottom],
                     'righttop': [dims.right, dims.top],
                     'rightbottom': [dims.right, dims.bottom]
                   };

    return objMap(collTiles, (_, pos) => 
      levels.pos2key(
        worldPos2TilePos({ x: pos[0], y: pos[1] }))
    );
  };

  const collisionsFromKeys = f => (collisions) => {
    let collTiles = objMap(collisions, (_, key) => {
      let tile = this.data.tiles[key];

      return f(tile);
    });

    return {
      left: collTiles['lefttop'] && collTiles['leftbottom'],
      top: collTiles['lefttop'] && collTiles['righttop'],
      right: collTiles['righttop'] && collTiles['rightbottom'],
      bottom: collTiles['rightbottom'] && collTiles['leftbottom']
    };
  };

  const collisionWithBlocks = collisionsFromKeys(tile => 
    tile.role.block);

  const collisionWithSpace = collisionsFromKeys(tile =>
    tile.role.role === 'space');

  const collisionsWithAll = collisionsFromKeys(tile => true);

  const updateTilesForCollisions = ({bottomF = u.noop, topF = u.noop}) => (collisionKeys, collisions) => {
    if (collisions.bottom) {
      [collisionKeys['rightbottom'],
       collisionKeys['leftbottom']]
        .map(_ => this.data.tiles[_].ctrl)
        .forEach(bottomF);
    } 
    if (collisions.top) {
      [collisionKeys['righttop'],
       collisionKeys['lefttop']]
        .map(_ => this.data.tiles[_].ctrl)
        .forEach(topF);
    }
  };

  const updateTileFacesForBlocks = updateTilesForCollisions({
    bottomF: _ => _.heroStep(),
    topF: _ => _.heroStep('bottom')
  });

  const updateTileFacesForBullets = updateTilesForCollisions({
    bottomF: _ => _.bulletStep(),
  });
  

  const updateHeroCollisions = delta => {
    const { before, after } = this.hero.entity.dimensions(delta);

    const afterCollisionKeys = collisionKeys(after);

    let afterCollisions = collisionWithBlocks(afterCollisionKeys);

    updateTileFacesForBlocks(afterCollisionKeys, afterCollisions);

    this.hero.entity.applyPhysics(delta, afterCollisions);

  };

  const updateBulletCollisions = delta => {
    this.hero.bullets.each(_ => {
      const { after } = _.entity.dimensions(delta);

      if (after.front > width * 0.1) {
        const afterCollisionKeys = collisionKeys(after);
        
        let allCollisions = collisionsWithAll(afterCollisionKeys);

        updateTileFacesForBullets(afterCollisionKeys, allCollisions);

      }
    });
  };



  this.update = delta => {
    this.tiles.each(_ => _.update(delta));

    updateHeroCollisions(delta);
    updateBulletCollisions(delta);

    this.hero.update(delta);
  };
}
