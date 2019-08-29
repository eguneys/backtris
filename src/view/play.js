import * as co from '../colors';
import * as u from '../util';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const tileWidth = width * 0.07;

  const tilesX = width * 0.2,
        tilesY = height * 0.2;

  const coTile = co.shifter(co.Palette.SwanWhite);
  const coBg = co.shifter(co.Palette.CrocTooth);

  this.render = ctrl => {

    g.rect({
      x: 0, 
      y: 0, 
      width, 
      height
    }, co.css(coBg.alp(0.2)));


    g.transform({
      translate: [tilesX, tilesY]
    }, () => {

      g.rect({
        x: 0,
        y: 0,
        width: tileWidth,
        height: tileWidth
      }, co.css(coTile.alp(0.1)));

    });    
  };
  
}
