import * as u from './util';

const left = [[-1, 0],
              [-2, 0], 
              [-3, 0]],
      right = [[1, 0],
               [2, 0],
               [3, 0]],
      up = [[0, -1],
            [0, -2],
            [0, -3]],
      down = [[0, 1],
              [0, 2],
              [0, 3]],
      upleft = [[-1, -1],
                [-2, -2],
                [-3, -3]],
      upright = [[1, -1],
                 [2, -2],
                 [3, -3]],
      downleft = [[-1, 1],
                  [-2, 2],
                  [-3, 3]],
      downright = [[1, 1],
                   [2, 2],
                   [3, 3]];

// const allVectors = [
//   left, right, up, down, upleft, upright, downleft, downright
// ];

const allVectors = (() => {
  // up, left, down, right
  const dirs = [[0, 1],
                [-1, 0],
                [0, -1],
                [1, 0]];

  function sum(a, b) {
    return [a[0] + b[0],
            a[1] + b[1]];
  }

  function reverse(dir) {
    switch (dir) {
    case 0:
      return 2;
    case 1:
      return 3;
    case 2:
      return 0;
    case 3:
      return 1;
    }
    return 0;
  };

  let res = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (reverse(i) === j) continue;
      for (let k = 0; k < 4; k++) {
        if (reverse(j) === k) continue;

        let first = dirs[i];
        let second = sum(dirs[i], dirs[j]);
        let third = sum(second, dirs[k]);

        res.push([first,
                  second,
                  third]);
      }
    }
  }

  return res;
})();


function diffKey(fromKey, d) {
  const fromPos = u.key2pos(fromKey);

  const toPos = [fromPos[0] + d[0],
                 fromPos[1] + d[1]];

  if (toPos[0] < 0 || toPos[0] > u.cols ||
      toPos[1] < 0 || toPos[1] > u.rows) {
    return null;
  }

  return u.pos2key(toPos);
}

export const movementVector = (from) => {
  return allVectors.map(dirVector =>
    dirVector.map(_ => diffKey(from, _)))
    .filter(_ => _.length === 3);
};
