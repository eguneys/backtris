export default function physics(opts) {
  
  opts = { pos: vec3(0),
           vel: vec3(0),
           theta: vec3(0),
           ...opts };


  this.values = () => {
    const { pos, theta } = opts;

    return {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      theta: [theta.x,
              theta.y,
              theta.z]
    };
  };

  this.update = delta => {
    
  };

}

export function vec3(x, y = x, z = x) {
  return {
    x, y, z
  };
}
