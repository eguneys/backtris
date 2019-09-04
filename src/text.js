export function text(g, {
  text, x, y,
  font = '20px Arial'
}) {
  
  g.draw(ctx => {
    
    ctx.font = font;
    ctx.fillText(text, x, y);
    
  });

}
