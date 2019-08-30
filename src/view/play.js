import * as co from '../colors';
import * as u from '../util';

import * as cu from '../ctrl/util';

import * as text from '../text';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data.game;

  const nbCols = cu.cols,
        nbRows = cu.rows;

  const tilesWidth = height * 0.8;

  const tileWidth = tilesWidth / nbRows,
        tileGap = tileWidth * 0.07;

  const tilesX = (width - tilesWidth) * 0.2,
        tilesY = (height - tilesWidth) * 0.6;

  const nextX = tilesX + tilesWidth + tileGap * nbCols,
        nextY = tilesY;

  const shapeHeight = tileWidth * 4 + tileGap * 4,
        shapeWidth = shapeHeight;

  const coTile = co.shifter(co.Palette.SwanWhite);
  const coBg = co.shifter(co.Palette.CrocTooth);

  const coTiles = {
    'blue': co.shifter(co.Palette.SummerSky),
    'orange': co.shifter(co.Palette.Pumpkin),
    'cyan': co.shifter(co.Palette.CelGreen),
    'red': co.shifter(co.Palette.FluRed)
  };

  const renderNextDrag = (ctrl) => {
    const tileCtrl = ctrl.play.tiles;

    const cur = ctrl.data.draggable.current;

    let views;

    if (cur) {
      const { nextIndex, epos } = cur,
            next = tileCtrl.data.next[nextIndex];

      const transform = g.makeTransform({
        translate: [epos[0] - tileWidth * 2,
                    epos[1] - tileWidth * 2],
        scale: [1.0, 1.0]
      });

      const alpha = 0.5;

      g.draw(ctx => {
        views = renderShape(ctrl, next, alpha);
      }, {
        x: 0, y: 0,
        width: shapeWidth,
        height: shapeWidth
      }, transform);      
      
    }

    return views;
  };

  const renderNext = (ctrl, nextI, hits) => {
    const tileCtrl = ctrl.play.tiles;
    const next = tileCtrl.data.next[nextI];

    const x = nextX,
          y = nextY + shapeHeight * 0.6 * nextI;

    const transform = g.makeTransform({
      translate: [x, 
                  y],
      scale: [0.6, 0.6]
    });


    let views;

    let alpha = 0.8;

    let curDrag = ctrl.data.draggable.current;
    
    if (curDrag && curDrag.nextIndex === nextI) {
      alpha = 0.3;
    }

    const color = alpha;

    g.draw(ctx => {

      views = renderShape(ctrl, next, alpha);

    }, {
      x: 0, y: 0,
      width: shapeWidth,
      height: shapeWidth
    }, transform);


    return views;
  };

  const renderShape = (ctrl, shape, alpha) => {
    let views = [];
    shape.tiles.forEach((pos, i) => {
      const x = pos[0] * (tileWidth + tileGap),
            y = pos[1] * (tileWidth + tileGap);


      const coTile = coTiles[shape.color],
            colorRgb = coTile.alp(alpha);


      const bounds = renderTile(ctrl, {
        x, 
        y
      }, co.css(colorRgb), shape.letters[i]);

      bounds.i = i;
      views.push(bounds);
    });
    return views;
  };

  const renderMergeConnect = (ctrl, { x, y, fromX, fromY }, color) => {
    g.rect({
      x: x - ((x===fromX)?0:tileGap),
      y: y - ((y===fromY)?0:tileGap),
      width: (x===fromX)?tileWidth:tileGap,
      height: (y===fromY)?tileWidth:tileGap
    }, color);
  };

  const renderMergeTile = (ctrl, { x, y }, color) => {
    g.rect({
      x,
      y,
      width: tileWidth,
      height: tileWidth
    }, color);
  };

  const renderTile = (ctrl, { x, y, offsetX, offsetY, transform }, color, letter) => {

    offsetX = offsetX || 20.0;
    offsetY = offsetY || offsetX;

    let views = g.rect({
      x,
      y,
      width: tileWidth,
      height: tileWidth,
      transform
    }, color);

    if (letter) {
      text.drawText({ text: letter,
                      x, 
                      y,
                      transform: g.makeTransform({
                        translate: [offsetX, offsetY],
                        scale: [4.0, 4.0]
                      }) 
                    }, 
                    g,
                    assets['font']);

    }
    
    return views;
  };

  const renderTiles = ctrl => {
    const tileCtrl = ctrl.play.tiles;


    const transform = g.makeTransform({
      translate: [tilesX, tilesY]
    });

    let vTiles = {};

    let tiles = tileCtrl.data.tiles,
        placeTiles = tileCtrl.data.placeTiles;

    cu.allPos.forEach(pos => {
      const key = cu.pos2key(pos);

      let tile = tiles[key];


      let color = coTile.alp(0.1);

      if (placeTiles && placeTiles.some(_ => _.key === key)) {
        color = coTile.hue(0.2);
      }

      if (tile) {
        color = coTiles[tile.color].alp(0.0);
      }

      const x = pos[0] * (tileWidth + tileGap),
            y = pos[1] * (tileWidth + tileGap);

      g.draw(_ => {
        const bounds = renderTile(ctrl, {
          x,
          y
        }, co.css(color), tile?tile.letter:null);

        vTiles[key] = bounds;
      }, { x, y,
           width: tileWidth,
           height: tileWidth
         }, transform);
    });

    return vTiles;
  };

  function tilePos(pos) {
    return {
      x: pos[0] * (tileWidth + tileGap),
      y: pos[1] * (tileWidth + tileGap)
    };
  }

  const renderFalling = (ctrl, falling) => {
    const tilesCtrl = ctrl.play.tiles;

    const mergeT = falling.data.mergeT,
          mergeFrom = falling.data.falling[falling.data.merge],
          mergeTo = falling.data.falling[falling.data.merge+1],
          fromKey = mergeFrom.key,
          toKey = mergeTo.key,
          fromPos = cu.key2pos(fromKey),
          toPos = cu.key2pos(toKey);

    let mergeRest = [];

    for (let i = falling.data.merge + 1; i < 4; i++) {
      mergeRest.push({
        mergeFrom: falling.data.falling[i-1],
        ...falling.data.falling[i]
      });
    }

    const fromX = fromPos[0] * (tileWidth + tileGap),
          fromY = fromPos[1] * (tileWidth + tileGap),
          toX = toPos[0] * (tileWidth + tileGap),
          toY = toPos[1] * (tileWidth + tileGap);

    const mergeX = fromX + (toX - fromX) * mergeT,
          mergeY = fromY + (toY - fromY) * mergeT;


    const color = coTiles[mergeFrom.color].alp(0.0);


    const transform = g.makeTransform({
      translate: [tilesX, tilesY]
    });

    g.draw(ctx => {

      mergeRest.forEach(({ mergeFrom, key, letter }) => {
        let pos = cu.key2pos(key);

        const { x, y } = tilePos(pos);

        let fromPos = tilePos(cu.key2pos(mergeFrom.key));

        // renderMergeConnect(ctrl, {
        //   x,
        //   y,
        //   fromX: fromPos.x,
        //   fromY: fromPos.y
        // }, co.css(color));

        renderTile(ctrl, {
          x, y
        }, co.css(color), letter);

      });

      renderMergeTile(ctrl, {
        x: mergeX,
        y: mergeY,
      }, co.css(color));

    }, { x: 0,
         y: 0, 
         width: tilesWidth, 
         height: tilesWidth 
       }, transform);
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


    const lOffset = 20.0,
          lScale = 4.0;
    const transform = g.makeTransform({
      translate: [lOffset, lOffset],
      scale: [lScale, lScale],
    });

    
    text.drawText({ text: 'restart', x, y, transform }, g, assets['font']);


    return views;
  };

  const renderScore = ctrl => {

    const score = ctrl.play.data.score;

    const x = tilesX + tilesWidth * 0.5,
          y = height * 0.05;

    const transform = g.makeTransform({
      translate: [0, 0],
      scale: [4.0, 4.0],
    });

    text.drawText({ text: score + '', x, y, transform }, g, assets['font']);
    
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

    renderScore(ctrl);

    views.restart = renderRestart(ctrl);

    views.tiles = renderTiles(ctrl);

    views.nextDrag = renderNextDrag(ctrl);

    ctrl.play.tiles.falling.each(_ => 
      renderFalling(ctrl, _));

    return views;
  };

}
