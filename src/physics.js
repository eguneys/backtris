import * as v from './vector';

const { vec3 } = v;

export default function physics(opts) {


  let gravity = vec3(0, 100, 0);
  
   opts = { pos: vec3(0),
            vel: vec3(0),
            acc: vec3(0),
            theta: vec3(0),
            ...opts };

  let { pos, vel, acc, theta } = opts;

  this.jump = (xHeight, yHeight, zHeight) => {
    let s = vec3(xHeight, yHeight, zHeight);
    s = v.scale(s, -100 * 0.006);
    this.vel({ x: s[0], y: s[1], z: s[2] });
  };

  this.pos = ({ x, y, z }) => {
    x = x || pos[0];
    y = y || pos[1];
    z = z || pos[2];

    pos = vec3(x, y, z);
  };

  this.vel = ({ x, y, z }) => {
    x = x || vel[0];
    y = y || vel[1];
    z = z || vel[2];

    vel = vec3(x, y, z);
  };

  this.acc = ({ x, y, z }) => {
    x = x || acc[0];
    y = y || acc[1];
    z = z || acc[2];

    acc = vec3(x, y, z);
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

    vel = v.addScale(vel, acc, dt);

    vel = v.addScale(vel, gravity, dt);

    pos = v.addScale(pos, vel, dt);

  };

}
