import makeMesh from '../mesh';
import * as geo from '../geometry';
import makePhysics from '../physics';

import * as u from '../util';

import Pool from '../pool';

export default function makeExplosion(ctrl) {

  this.particles = new Pool(id => new makeParticle(ctrl, this));

  this.init = d => {
    this.data = { ...d };

    for (let i = 0 ; i< 10; i++) {
      this.particles.acquire(_ => _.init({}));
    }
  };

  this.update = delta => {

    this.particles.each(_ => _.update(delta));

  };
  
}


function makeParticle(ctrl, explosion) {

  const { camera } = ctrl;

  const { width, height } = ctrl.data.game;

  const bWidth = 10;

  let geometry = geo.cubeGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  let physics = new makePhysics({
    bWidth,
    height: bWidth
  });

  let life = new makeLife(() => {
    explosion.particles.release(this);
  });
  
  this.init = d => {
    this.data = { ...d };

    physics.jump(u.rand(-width * 0.3, width * 0.3),
                      u.rand(0, width * 0.3),
                      u.rand(-width * 0.3, width * 0.3));
  };


  const updateModel = delta => {
    this.mesh.updateModel(physics.values());
  };

  const updatePhysics = delta => {
    physics.update(delta);
  };
  
  this.update = delta => {

    updatePhysics(delta);
    updateModel();

    life.update(delta);
  };
  
}

function makeLife(onDie = () => {}, opts) {

  opts = { life: 3, ...opts };

  let life = opts.life;


  this.alpha = () => life / opts.life;

  this.update = delta => {
    life -= delta * 0.01;

    if (life < 0) {
      onDie();
    }
  };
  
 
}
