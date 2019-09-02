import * as v from './vector';

const { vec3 } = v;

export default function physics(opts) {


  let gravity = vec3(0, 10, 0);
  
   opts = { pos: vec3(0),
            vel: vec3(0),
            acc: vec3(0),
            theta: vec3(0),
            vTh: vec3(0),
            ...opts };

  let { pos, vel, acc, theta, vTh } = opts;

  this.jump = (xHeight, yHeight, zHeight) => {
    let s = vec3(xHeight, yHeight, zHeight);
    s = v.scale(s, -100 * 0.006);
    this.vel({ x: s[0], y: s[1], z: s[2] });
  };

  this.move = (dir) => {
    let x = dir[0],
        y = dir[1],
        xAcc = x * 2,
        xV = x * 60;

    this.acc({ x: xAcc });
    this.vel({ x: xV });

    let yHeight = y * gravity[1] * 6;

    if (yHeight !== 0) {
      this.jump(0, -yHeight, 0);
    }
  };

  this.pos = ({ x = pos[0], y = pos[1], z = pos[2] }) => {
    pos = vec3(x, y, z);
  };

  this.vel = ({ x = vel[0], y = vel[1], z = vel[2] }) => {
    vel = vec3(x, y, z);
  };

  this.acc = ({ x = acc[0], y = acc[1], z = acc[2] }) => {
    acc = vec3(x, y, z);
  };

  this.rot = ({ x = theta[0], y = theta[1], z = theta[2] }) => {
    theta = vec3(x, y, z);
  };

  this.vrot = ({ x = vTh[0], y = vTh[1], z = vTh[2] }) => {
    vTh = vec3(x, y, z);
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

    theta = v.addScale(theta, vTh, dt);

    vel = v.addScale(vel, acc, dt);

    vel = v.addScale(vel, gravity, dt);

    pos = v.addScale(pos, vel, dt);

  };

}
