export const cols = 30;
export const rows = 20;

export const allPos = (function() {
  const res = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      res.push([i, j]);
    }
  }
  return res;
})();

export function pos2key(pos) {
  return pos[0] + '.' + pos[1];
};

export function key2pos(key) {
  return key.split('.').map(_ => parseInt(_));
}

const RoleCode = { ' ': 'space',
                   '{': 'leftwall',
                   '}': 'rightwall',
                   '_': 'topwall' };

const Role = {
  space: {
    
  },
  leftwall: {
    facing: 'right',
    block: true
  },
  rightwall: {
    facing: 'left',
    block: true
  },
  topwall: {
    facing: 'top',
    block: true
  }
};

const levels = [
  `
 ____________________________
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{                            }
{      ___                   }
{          ____              }
{                            }
{  ___                       }
{     _____      ____        }
{            _               }
{____________________________}
`
];

const makeRole = (function roleMaker() {
  let id = 1;
  return function(roleCode) {
    id++;

    const role = RoleCode[roleCode];
    return { key: id, role, ...Role[role] };
  };
})();

export const read = levelStr => {

  const lines = levelStr.split('\n');
  lines.splice(0, 1);
  lines.splice(-1);

  const emptyLine = "                    ";

  while (lines.length < rows) {
    lines.unshift(emptyLine);
  }

  let res = {};
  lines.forEach((line, row) => {
    line = line.split("");

    while (line.length < cols) {
      line.push(" ");
    }
    line.forEach((tileChar, col) => {
      let pos = [row, col];
      res[pos2key(pos)] = {
        role: makeRole(tileChar)
      };
    });
  });

  return res;
  
};

export const make = () => {
  return read(levels[0]);
};
