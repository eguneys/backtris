import * as G from '../graphics';

import * as co from '../colors';
import * as u from '../util';

import * as p from '../paths';

import * as text from '../text';

export default function view(ctrl, g, assets) {

  const { width, height, tilesWidth } = ctrl.data.game;

  function renderTile(ctrl, tile) {
    const { role } = tile.data;

    switch (role) {
    case 'wall':
      renderMesh(ctrl, g, tile.mesh);
      break;
    }
  }

  function renderHero(ctrl, hero) {

    renderMesh(ctrl, g, hero.mesh);
    
  }

  this.render = ctrl => {
    const playCtrl = ctrl.play;

    playCtrl.tiles.each(_ => renderTile(ctrl, _));

    renderHero(ctrl, playCtrl.hero);

  };

}

function renderMesh(ctrl, g, mesh) {

  let { view, lines } = mesh.geometry();

  g.draw(ctx => {

    lines.forEach(line => {

      let v1 = view[line[0]],
          v2 = view[line[1]];

      ctx.beginPath();
      ctx.moveTo(v1[0], v1[1]);
      ctx.lineTo(v2[0], v2[1]);
      ctx.stroke();
    });
    
  });
}
