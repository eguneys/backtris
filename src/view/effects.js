import * as u from '../util';
import * as p from '../paths';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const transform = g.makeTransform({
    translate: [width*0.2, height * 0.2]
  });

  this.render = ctrl => {
    const { tick } = ctrl.data;

    let c1 = u.usin(tick * 0.005);

    g.draw(ctx => {


      p.circle(ctx, {
        radius: 100,
        c1
      });


      ctx.beginPath();
      ctx.rect(0, -height*0.5, 1, height);
      ctx.stroke();

      ctx.rect(-width*0.2, 0, width, 1);
      ctx.stroke();

    }, { x: 0, y: 0, width, height }, transform);

  };
  
}
