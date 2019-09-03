import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeEntity from '../entity';

import * as co from '../colors';

import * as u from '../util';

import Pool from '../pool';

import * as v from '../vector';

const { vec3 } = v;

export default function hero(ctrl) {
 
  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  let heroWidth = 20,
      heroHeight = heroWidth;

  //let geometry = geo.cubeGeometry(heroWidth);
  let geometry = geo.ringGeometry(heroWidth, u.TAU, 4);
  this.mesh = new makeMesh(camera, geometry, {
    width: heroWidth,
    height: heroHeight
  });

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {

  }, 0);

  let phy = this.entity.physics;
  let lif = this.entity.life;

  this.bullets = new Pool(id => new makeBullet(ctrl, this));

  const heroColor = new co.shifter(co.Palette.GreyPorc);

  let moveDir = [0, 0];

  this.init = d => {
    this.data = { ...d };
  };


  this.facing = () => {
    return moveDir[0];
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

  const updatePaint = delta => {
    this.mesh.paint('front', heroColor.css());
  };

  const maybeSpawnBullet = u.withDelay(_ => {

    if (moveDir[0] === 0) {
      return;
    }

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

    updatePaint(delta);

    updateMovement(delta);

    maybeSpawnBullet(delta);

    this.bullets.each(_ => _.update(delta));

  };
 
}

function makeBullet(ctrl, hero) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  let bWidth = 7;

  let geometry = geo.ringGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  const colRed = new co.shifter(co.Palette.FluRed);

  this.mesh.paint('front', colRed.css());

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {
    hero.bullets.release(this);
  }, 0.5, vec3(0.0, 0.0, 20.0));

  let phy = this.entity.physics;
  let lif = this.entity.life;

  this.init = d => {
    this.data = { x: 0, y: 0, vDispense: vec3(0), ...d };

    lif.init();

    let { x, y, vDispense } = this.data;

    let bulletDir = hero.facing();
    
    x += 10 * bulletDir * -1;

    phy.pos({ x, y, z: 0 });
    phy.acc({ y: 0, x: 10 * bulletDir, z: 0 });
    phy.vel({ x: 100 * bulletDir * -1, y: vDispense[1], z: vDispense[2] });
  };

  this.update = delta => {
    this.entity.update(delta);
    phy.update(delta);
  };

}
