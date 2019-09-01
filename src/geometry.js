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

export function cubeGeometry(width, height = width, depth = width) {
  const vertices = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, height, 0]);
  vertices.push([width, 0, 0]);
  vertices.push([width, height, 0]);

  vertices.push([0, 0, depth]);
  vertices.push([0, height, depth]);
  vertices.push([width, 0, depth]);
  vertices.push([width, height, depth]);

  const lines = [];

  lines.push([0, 1]);
  lines.push([1, 3]);
  lines.push([3, 2]);
  lines.push([2, 0]);

  lines.push([0, 4]);
  lines.push([1, 5]);
  lines.push([2, 6]);
  lines.push([3, 7]);

  lines.push([4, 5]);
  lines.push([5, 7]);
  lines.push([7, 6]);
  lines.push([6, 4]);
  

  return { vertices, lines };
}
