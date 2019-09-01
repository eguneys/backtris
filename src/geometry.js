import * as u from './util';

export function ringGeometry(radius, end = u.TAU, edges = 10) {
  const vertices = [],
        lines = [];

  let lineI = 0;
  for (let a = 0; a < end; a+= u.PI / edges) {
    let c = Math.cos(a) * radius,
        s = Math.sin(a) * radius;
    vertices.push([c, s, 0]);
    if (lineI++ % 2 === 0) {
      lines.push([lineI, lineI - 1]);
    }
  }
  return { vertices, lines };
}
