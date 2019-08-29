function createContext(width, height) {
  const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

  return ctx;
};

export default function graphics(state, screenCtx) {

  const { width, height } = state.game;

  this.buffers = {
    Screen: screenCtx,
    Collision: createContext(width, height)
  };

  this.renderTarget = this.buffers.Screen;

  this.draw = f => f(this.renderTarget);

  this.rect = ({ x, y, width, height }, color) => 
  this.draw(ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  });
    

  this.transform = ({ translate, rotate, scale }, f) =>
  this.draw(ctx => {
    ctx.save();

    if (translate) {
      ctx.translate(translate[0], translate[1]);
    }
    if (rotate) {
      ctx.rotate(rotate);
    }

    if (scale) {
      ctx.scale(scale[0], scale[1]);
    }

    f(ctx);

    ctx.restore();
  });
  
}
