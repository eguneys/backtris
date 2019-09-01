import * as G from '../graphics';

import * as co from '../colors';
import * as u from '../util';

import * as path from '../paths';

export default function view(ctrl, g) {

  const { camera } = ctrl;

  const { width, height } = ctrl.data.game;

  const transform = G.makeTransform({
    translate: [width*0.0, height * 0.0]
  });


  const colB = new co.shifter(co.Palette.FluRed).css();

  const colDot = new co.shifter(co.Palette.CrocTooth).css();

  
  function renderMesh(ctrl, mesh) {

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

  this.render = ctrl => {

    const tilesCtrl = ctrl.play.tiles;

    g.draw(ctx => {

      renderMesh(ctrl, tilesCtrl.explosion.mesh);

    }, { x: 0, y: 0, width, height }, transform);

  };
}
