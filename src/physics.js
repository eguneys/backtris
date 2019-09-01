import * as v from './vector';

const { vec3 } = v;

export default function physics(opts) {

  let gravity = vec3(0, 100, 0);
  
   opts = { pos: vec3(0),
           vel: vec3(0),
           theta: vec3(0),
           ...opts };

  let { pos, vel, theta } = opts;

  this.jump = (xHeight, yHeight, zHeight) => {
    let s = vec3(xHeight, yHeight, zHeight);
    s = v.scale(s, -100 * 0.006);
    this.vel(s[0], s[1], s[2]);
  };

  this.vel = (x, y, z) => {
    vel = vec3(x, y, z);
  };

  this.values = () => {

    return {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      theta: [theta[0],
              theta[1],
              theta[2]]
    };
  };

  this.update = delta => {
    const dt = delta * 0.01;

    vel = v.addScale(vel, gravity, dt);

    pos = v.addScale(pos, vel, dt);

  };

}
