import playView from './play';

export default function view(ctrl, g, assets) {
  const { width, height } = ctrl.data.game;

  const play = new playView(ctrl, g, assets);

  this.render = ctrl => {

    g.draw(ctx => {
      ctx.clearRect(0, 0, width, height);
    }, { x: 0, y: 0, width, height });

    let views = {};

    views.play = play.render(ctrl, g);

    return views;
  };

}
