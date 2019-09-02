import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeEntity from '../entity';

import * as u from '../util';

import Pool from '../pool';

import * as v from '../vector';

const { vec3 } = v;

export default function hero(ctrl) {
 
  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  this.bullets = new Pool(id => new makeBullet(ctrl, this));

  let bWidth = 20;
  let geometry = geo.cubeGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {

  }, 0);

  let phy = this.entity.physics;
  let lif = this.entity.life;


  let moveDir = [0, 0];

  this.init = d => {
    this.data = { ...d };
  };

  this.move = dir => {
    if (dir[0] !== 0) {
      moveDir[0] = dir[0];
    }
    if (dir[1] !== 1) {
      moveDir[1] = dir[1];
    }
  };

  this.stop = dir => {
    if (moveDir[0] === dir[0]) {
      moveDir[0] = 0;
    }
    if (moveDir[1] === dir[1]) {
      moveDir[1] = 0;
    }
  };

  const updateMovement = delta => {
    phy.move(moveDir);
  };

  const maybeSpawnBullet = u.withDelay(_ => {

    let { x, y } = phy.values();

    this.bullets.acquire(_ => _.init({
      x, y
    }));
    this.bullets.acquire(_ => _.init({
      x, y,
      vDispense: vec3(0, 5, 5)
    }));
    this.bullets.acquire(_ => _.init({
      x, y,
      vDispense: vec3(0, -5, -5)
    }));
  }, 100);

  this.update = delta => {

    this.entity.update(delta);

    updateMovement(delta);

    maybeSpawnBullet(delta);

    this.bullets.each(_ => _.update(delta));

  };
 
}

function makeBullet(ctrl, hero) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  let bWidth = 10;

  let geometry = geo.cubeGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {
    hero.bullets.release(this);
  }, 0.5);

  let phy = this.entity.physics;
  let lif = this.entity.life;


  this.init = d => {
    this.data = { x: 0, y: 0, vDispense: vec3(0), ...d };

    lif.init();

    let { x, y, vDispense } = this.data;

    x += 10;

    phy.pos({ x, y, z: 0 });
    phy.acc({ y: 0, x: -1, z: -60 });
    phy.vel({ x: 100, y: vDispense[1], z: vDispense[2] });
  };

  this.update = delta => {
    this.entity.update(delta);

    // phy.pos({ z: Math.sin(u.usin(lif.alpha() * u.TAU * 0.5) * u.TAU * 4.0) * 20 });
  };

}
