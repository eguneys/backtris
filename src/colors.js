import * as convert from './rgba';

export const Palette = {
  Blue: 0xff0000ff,
  SwanWhite: 0xfff7f1e3,
  CrocTooth: 0xffd1ccc0
};

export const arr = rgba => {
  const a = (rgba & 0xff000000) >>> 24,
        r = (rgba & 0x00ff0000) >>> 16,
        g = (rgba & 0x0000ff00) >>> 8,
        b = (rgba & 0x000000ff);

  return [r, g, b, a];
};

// https://stackoverflow.com/a/54030756/3994249
export const fromArr = ([r, g, b, a]) => {
  return ((a << 24 >>> 0) | (r << 16 >>> 0) | (g << 8 >>> 0) | b) >>> 0;
};

export const hsla = rgba => {
  const [r, g, b, a] = arr(rgba),
        [h, s, l] = convert.rgbToHsl(r, g, b);
  
  return [h, s, l, a];
};

export const hslToRgba = (h, s, l, a) => {
  const [r, g, b] = convert.hslToRgb(h, s, l);
  return fromArr([r, g, b, a]);
};

export const css = rgba => {
  const [r, g, b, a] = arr(rgba);

  return `rgba(${r}, ${g}, ${b}, ${a/255})`;
};

export function shifter(rgba) {
  const [h, s, l, a] = hsla(rgba);

  // https://stackoverflow.com/a/57539098/3994249
  function shift(a, b) {
    let r = (a + b);
    return r === 1 ? 1 : r % 1;
  }

  return {
    hue: (dv) => hslToRgba(shift(h, dv), s, l, a),
    sat: (dv) => hslToRgba(h, shift(s, dv), l, a),
    lum: (dv) => hslToRgba(h, s, shift(l, dv), a),
    alp: (dv) => hslToRgba(h, s, l, shift(a/255, dv) * 255)
  };
}
