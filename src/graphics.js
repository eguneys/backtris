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

  const withT = f => (props, ...args) => {
    if (props.transform) {
      props.transform(this.renderTarget, () => f(props, ...args));
    } else {
      f(props, ...args);
    }
  };

  this.rect = withT(({ x, y, width, height }, color) =>
    this.draw(ctx => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }));

  const applyTransform = (f, ctx, { translate, rotate, scale }) => {
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
  };

  this.makeTransform = (props) => (ctx, f) => {
    if (props.transform) {
      props.transform(ctx, () => {
        applyTransform(f, ctx, props);
      });
    } else {
      applyTransform(f, ctx, props);
    }
  };
  
}
