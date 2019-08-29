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

  this.draw = (f, transform) => {
    if (transform) {
      transform(this.renderTarget, f);
    } else {
      f(this.renderTarget);
    }
  };

  this.rect = ({ x, y, width, height, transform }, color) =>
  this.draw(ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }, transform);

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
