import * as u from './util';

export function circle(ctx, opts) {

  opts = { ... {
    radius: 40,
    c1: 1.0
  }, ...opts };

  let { c1, radius } = opts;

  let r2 = radius +  radius * c1 * 2.4;

  const path = new Path2D();
  path.arc(0, radius * 2.0, r2, 0, u.PI, false);


  const clip = new Path2D();
  clip.rect(-radius, radius * 2.0, radius * 2.0, radius);
  ctx.clip(clip);

  ctx.save();
  ctx.translate(0, -c1 * radius * 3.0);

  ctx.fill(path);

  ctx.restore();


}

//   const hb = 200,
  //       h1 = 90,
  //       h2 = -20,
  //       h3 = 60,
  //       i1 = 40,
  //       i2 = 60,
  //       c1 = 1.0;
  // const radius = 40;

export function merge(options) {
  options = { ...{
    hb: 200,
    h1: 90,
    h2: -20,
    h3: 60,
    i1: 40,
    i2: 60,
    c1: 1.0,
    radius: 40
  }, ...options };

  let {
    hb,
    h1,
    h2,
    h3,
    i1,
    i2,
    c1,
    radius
  } = options;

  h1 *= c1;
  h2 *= c1;
  h3 *= (1.0 - c1);
  i1 *= c1;
  i2 *= 1.0 - c1;

  const os = radius,
        osY = hb;

  const path = new Path2D();

  path.arc(os + 0, osY + h1, radius, 0, u.PI, false);
  path.lineTo(os + -radius, osY - hb);
  path.lineTo(os + radius, osY -hb);
  path.moveTo(os + radius, osY -hb);
  path.arc(os + radius * 2, osY -i1, radius, u.PI, u.PI*2, false);
  path.lineTo(os + radius * 3, osY -hb);
  path.moveTo(os + radius * 3, osY -hb);
  path.arc(os + radius * 4, osY + h2, radius, 0, u.PI, false);
  path.moveTo(os + radius * 5, osY + h2);
  path.lineTo(os + radius * 3, osY -hb);
  path.lineTo(os + radius * 5, osY -hb);
  path.moveTo(os + radius * 5, osY -hb);
  path.arc(os + radius * 6, osY -i2, radius, u.PI, u.PI * 2, false);
  path.lineTo(os + radius * 7, osY -hb);
  path.moveTo(os + radius * 7, osY-hb);
  path.arc(os + radius * 8, osY + h3, radius, 0, u.PI, false);
  path.moveTo(os + radius * 7, osY -hb);
  path.lineTo(os + radius * 9, osY -hb);
  path.lineTo(os + radius * 9, osY + h3);

  path.moveTo(os + radius * 3, osY -hb);
  path.arc(os + radius * 4, osY + h1 * c1, radius, 0, u.PI * 2, false);

  return path;
}
