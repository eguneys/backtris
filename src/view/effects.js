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

  
  const renderDot = (ctrl, dot) => {
    const sT = u.usin(ctrl.data.tick * 0.01);

    g.draw(ctx => {
      // ctx.strokeStyle = 
      //   colDot
      //   .reset()
      //   .lum(1.0 - dot.data.alpha * 0.27)
      //   .hue(-dot.data.alpha * sT)
      //   .alp(1.0 - dot.data.alpha * 0.2)
      //   .css();

      const from = dot.data.projects[0],
            to = dot.data.projects[1];
      
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.closePath();
      ctx.stroke();

    }, { x: 0, y: 0, width, height });
  };

  function renderHero(ctrl) {
    const tilesCtrl = ctrl.play.tiles;
    const heroCtrl = tilesCtrl.hero;

    let view = heroCtrl.project();

    g.draw(ctx => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(view[0], view[1], 10, 0, u.TAU);
      ctx.fill();
      
    });

  }

  function renderBlock(ctrl, block) {

    let { view, lines } = block.geometry();

    g.draw(ctx => {

      lines.forEach(line => {

        let v1 = view[line[0]],
            v2 = view[line[1]];

        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        //ctx.stroke();
        ctx.stroke();
      });
      
    });

  }

  function renderEdge(ctrl, edge) {

    let { view, lines } = edge.geometry();

    g.draw(ctx => {

      lines.forEach(line => {

        let v1 = view[line[0]],
            v2 = view[line[1]];

        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        //ctx.stroke();
        ctx.stroke();
      });
      
    });
  }

  this.render = ctrl => {

    const tilesCtrl = ctrl.play.tiles;

    g.draw(ctx => {

      g.raw(ctx => {
        ctx.strokeStyle = colDot;
      });

      tilesCtrl.edges.each(_ => renderEdge(ctrl, _));

      tilesCtrl.blocks.each(_ => renderBlock(ctrl, _));

      renderHero(ctrl);


    }, { x: 0, y: 0, width, height }, transform);

  };
}
