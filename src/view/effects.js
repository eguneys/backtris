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


  const colB = new co.shifter(co.Palette.FluRed);

  const colDot = new co.shifter(co.Palette.CrocTooth);

  
  const renderDot = (ctrl, dot) => {
    g.draw(ctx => {
      colDot.reset();

      ctx.strokeStyle = 
        colDot
        .lum(1.0 - dot.data.alpha * 0.77)
        .alp(1.0 - dot.data.alpha * 0.2)
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

  function renderBullet(ctrl, bullet) {

    let project = bullet.data.project;

    const fromP = camera.project([bullet.data.x,
                                  bullet.data.y,
                                  bullet.data.z - 5]),
          toP = camera.project([bullet.data.x,
                                bullet.data.y,
                                bullet.data.z]);

    g.draw(ctx => {
      ctx.strokeStyle = colB.css();
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(fromP[0], fromP[1]);
      ctx.lineTo(toP[0], toP[1]);
      ctx.stroke();

    }, { x: 0, y: 0, width, height });


  }

  function renderHero(ctrl) {
    const tilesCtrl = ctrl.play.tiles;
    const heroCtrl = tilesCtrl.hero;

    heroCtrl.bullets.each(_ => renderBullet(ctrl, _));

  }

  this.render = ctrl => {

    const tilesCtrl = ctrl.play.tiles;

    g.draw(ctx => {

      tilesCtrl.edges.each(_ => renderDot(ctrl, _));

      renderHero(ctrl);


    }, { x: 0, y: 0, width, height }, transform);

  };
}
