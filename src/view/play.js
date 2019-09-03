import * as G from '../graphics';

import * as co from '../colors';
import * as u from '../util';

import { renderMesh } from './util';

export default function view(ctrl, g, assets) {

  const { width, height, tilesWidth } = ctrl.data.game;

  function renderTile(ctrl, tile) {
    renderMesh(ctrl, g, tile.mesh);
  }

  function renderBlock(ctrl, block) {
    renderMesh(ctrl, g, block.mesh);
  }

  function renderHero(ctrl, hero) {

    renderMesh(ctrl, g, hero.mesh);

    hero.bullets.each(_ => renderMesh(ctrl, g, _.mesh));
  }

  function renderExplosion(ctrl, explosion) {
    explosion.particles.each(_ => renderMesh(ctrl, g, _.mesh));
  }

  this.render = ctrl => {
    const playCtrl = ctrl.play;

    playCtrl.tiles.each(_ => renderTile(ctrl, _));

    playCtrl.blocks.each(_ => renderBlock(ctrl, _));

    playCtrl.explosions.each(_ => renderExplosion(ctrl, _));

    renderHero(ctrl, playCtrl.hero);

  };

}
