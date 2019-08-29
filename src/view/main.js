import playView from './play';

export default function view(ctrl, g) {
  const { width, height } = ctrl.data.game;

  const play = new playView(ctrl, g);

  this.render = ctrl => {

    g.draw(ctx => {
      ctx.clearRect(0, 0, width, height);
    });

    let views = {};

    views.play = play.render(ctrl);

    return views;
  };

}
