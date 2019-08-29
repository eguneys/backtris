import * as co from '../colors';
import * as u from '../util';

import * as cu from '../ctrl/util';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const nbCols = cu.cols,
        nbRows = cu.rows;

  const tilesWidth = height * 0.8;

  const tileWidth = tilesWidth / nbRows,
        tileGap = tileWidth * 0.07;

  const tilesX = (width - tilesWidth) * 0.2,
        tilesY = (height - tilesWidth) * 0.5;

  const nextX = tilesX + tilesWidth + tileGap * 4,
        nextY = tilesY;

  const shapeHeight = tileWidth * 3.5;

  const coTile = co.shifter(co.Palette.SwanWhite);
  const coBg = co.shifter(co.Palette.CrocTooth);

  const renderNextDrag = (ctrl) => {

    

  };

  const renderNext = (ctrl, nextI) => {
    const tileCtrl = ctrl.play.tiles;
    const next = tileCtrl.data.next[nextI];

    g.transform({
      translate: [nextX, 
                  nextY + shapeHeight * nextI]
    }, () => {
      
      next.tiles.forEach(pos => {
        renderTile(ctrl, {
          x: pos[0] * (tileWidth + tileGap),
          y: pos[1] * (tileWidth + tileGap)
        });
      });

    });

  };

  const renderTile = (ctrl, { x, y }) => {

    const color = co.css(coTile.alp(0.1));

    g.rect({
      x,
      y,
      width: tileWidth,
      height: tileWidth
    }, color);
  };

  const renderTiles = ctrl => {
    g.transform({
      translate: [tilesX, tilesY]
    }, () => {

      cu.allPos.forEach(pos => {

        renderTile(ctrl, {
          x: pos[0] * (tileWidth + tileGap),
          y: pos[1] * (tileWidth + tileGap)
        });
      });
    });
  };

  this.render = ctrl => {

    g.rect({
      x: 0, 
      y: 0, 
      width, 
      height
    }, co.css(coBg.alp(0.2)));

    renderNext(ctrl, 0);
    renderNext(ctrl, 1);
    renderNext(ctrl, 2);

    renderNextDrag(ctrl);

    renderTiles(ctrl);
  };

}
