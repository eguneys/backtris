import * as co from '../colors';
import * as u from '../util';

import * as path from '../paths';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const transform = g.makeTransform({
    translate: [width*0.0, height * 0.0]
  });

  const renderDot = (ctrl, dot) => {
    g.draw(ctx => {
      const colDot = new co.shifter(co.Palette.CrocTooth);

      ctx.strokeStyle = 
        colDot.lum(1.0 - dot.data.alpha * 0.77)
        .alp(1.0 - dot.data.alpha)
        .css();

      const from = dot.data.projects[0],
            to = dot.data.projects[1];
      
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.closePath();
      ctx.stroke();

    }, { x: 0, y: 0, width, height });
  };

  this.render = ctrl => {

    const tilesCtrl = ctrl.play.tiles;

    const { tick } = ctrl.data;

    g.draw(ctx => {

      tilesCtrl.edges.each(_ => renderDot(ctrl, _));
      


      renderLines(ctx);

    }, { x: 0, y: 0, width, height }, transform);

  };

  function renderLines(ctx) {
    ctx.beginPath();
    ctx.rect(0, -height*0.5, 1, height);
    ctx.stroke();

    ctx.rect(-width*0.2, 0, width, 1);
    ctx.stroke();
  }
  
}
