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

  const nextX = tilesX + tilesWidth + tileGap * nbCols,
        nextY = tilesY;

  const shapeHeight = tileWidth * 3.5;

  const coTile = co.shifter(co.Palette.SwanWhite);
  const coBg = co.shifter(co.Palette.CrocTooth);

  const renderNextDrag = (ctrl) => {
    const tileCtrl = ctrl.play.tiles;

    const cur = ctrl.data.draggable.current;

    let vTiles = [];

    if (cur) {
      const { nextIndex, epos } = cur,
            next = tileCtrl.data.next[nextIndex];

      const transform = g.makeTransform({
        translate: [epos[0] - tileWidth * 2,
                    epos[1] - tileWidth * 2],
        scale: [1.0, 1.0]
      });

      const color = co.css(coTile.alp(0.5));

      next.tiles.forEach((pos, i) => {
        const x = pos[0] * (tileWidth + tileGap),
              y = pos[1] * (tileWidth + tileGap);

        renderTile(ctrl, {
          x, 
          y,
          transform
        }, color);

        g.draw(ctx => {
          let bounds = {
            i: i,
            x,
            y,
            width: tileWidth,
            height: tileWidth
          };

          applyTransform(bounds, ctx.currentTransform);

          vTiles.push(bounds);
        }, transform);

      });
      
      
    }

    return vTiles;
  };

  const renderNext = (ctrl, nextI, hits) => {
    const tileCtrl = ctrl.play.tiles;
    const next = tileCtrl.data.next[nextI];

    const transform = g.makeTransform({
      translate: [nextX, 
                  nextY + shapeHeight * 0.6 * nextI],
      scale: [0.6, 0.6]
    });

    let views = [];

    let alpha = 0.3;

    let curDrag = ctrl.data.draggable.current;
    
    if (curDrag && curDrag.nextIndex === nextI) {
      alpha = 0.1;
    }

    const color = co.css(coTile.alp(alpha));

    next.tiles.forEach(pos => {
      const x = pos[0] * (tileWidth + tileGap),
            y = pos[1] * (tileWidth + tileGap);

      renderTile(ctrl, {
        x, 
        y,
        transform
      }, color);

      g.draw(ctx => {

        let bounds = {
          x,
          y,
          width: tileWidth,
          height: tileWidth
        };

        applyTransform(bounds, ctx.currentTransform);

        views.push(bounds);
        
      }, transform);
    });

    return views;
  };

  const renderTile = (ctrl, { x, y, transform }, color) => {

    g.rect({
      x,
      y,
      width: tileWidth,
      height: tileWidth,
      transform
    }, color);
  };

  const renderTiles = ctrl => {
    const tileCtrl = ctrl.play.tiles;


    const transform = g.makeTransform({
      translate: [tilesX, tilesY]
    });

    let vTiles = {};

    let placeTiles = tileCtrl.data.placeTiles;

    cu.allPos.forEach(pos => {
      const key = cu.pos2key(pos);

      let color = coTile.alp(0.1);

      if (placeTiles && placeTiles.some(_ => _.key === key)) {
        color = coTile.hue(0.2);
      }

      const x = pos[0] * (tileWidth + tileGap),
            y = pos[1] * (tileWidth + tileGap);

      renderTile(ctrl, {
        x,
        y,
        transform
      }, co.css(color));

      g.draw(ctx => {

        let bounds = {
          x, y,
          width: tileWidth,
          height: tileWidth
        };

        applyTransform(bounds, ctx.currentTransform);

        vTiles[key] = bounds;
      }, transform);
    });

    return vTiles;
  };

  const renderRestart = ctrl => {

    const x = nextX + tileWidth,
          y = height * 0.8;

    let alpha = 0.1;
    if (ctrl.data.draggable.restart) {
      alpha = 0.3;
    }

    const color = co.css(coTile.alp(alpha));

    g.rect({
      x,
      y,
      width: tileWidth * 4,
      height: tileWidth
    }, color);

    let views = {
      x,
      y,
      width: tileWidth * 4,
      height: tileWidth
    };

    return views;
  };

  this.render = ctrl => {

    let views = {
      next: []
    };

    g.rect({
      x: 0, 
      y: 0, 
      width, 
      height
    }, co.css(coBg.alp(0.2)));


    views.next[0] = renderNext(ctrl, 0);
    views.next[1] = renderNext(ctrl, 1);
    views.next[2] = renderNext(ctrl, 2);

    views.restart = renderRestart(ctrl);

    views.nextDrag = renderNextDrag(ctrl);

    views.tiles = renderTiles(ctrl);

    return views;
  };

}

function applyTransform(bounds, ct) {
  bounds.x = ct.e + bounds.x * ct.a;
  bounds.y = ct.f + bounds.y * ct.d;
  bounds.width = bounds.width * ct.a;
  bounds.height = bounds.height * ct.d;
}
