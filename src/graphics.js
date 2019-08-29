export default function graphics(state, ctx) {

  this.draw = f => f(ctx);

  this.rect = ({ x, y, width, height }, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };
    

  this.transform = ({ translate, rotate, scale }, f) => {
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
  
}
