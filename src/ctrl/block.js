import * as u from '../util';

import * as vec3 from '../matrix';

export default function block(ctrl, g) {

  const { camera } = ctrl;

  const { width, height, holeRadius } = ctrl.data.game;

  const tilesCtrl = ctrl.play.tiles;

  let geometry;
  
  this.init = d => {
    this.data = { 
      theta: 0,
      z: camera.near, 
      ...d };

    geometry = cubeGeometry(10);

  };

  let modelMatrix = [0, 0, 0];

  this.geometry = () => {

    let { vertices, lines } = geometry;

    let model = vertices.map(vertex =>
      vec3.addVec(vertex, modelMatrix)
    );

    let view = model.map(vertex =>
      camera.project(vertex)
    );


    return {
      view,
      lines
    };
  };

  const updatePos = delta => {
    this.data.z += delta * 0.1;

    this.data.x = Math.cos(this.data.theta) * holeRadius * 2.0;
    this.data.y = Math.sin(this.data.theta) * holeRadius * 2.0;

  };

  const updateModel = () => {
    modelMatrix[0] = this.data.x;
    modelMatrix[1] = this.data.y;
    modelMatrix[2] = this.data.z;
  };

  const maybeKill = () => {
    if (this.data.z > camera.far) {
      tilesCtrl.blocks.release(this);
    }
  };

 
  this.update = delta => {

    updatePos(delta);
    updateModel(delta);


    maybeKill();
  };
 
}

function cubeGeometry(width) {
  const vertices = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, width, 0]);
  vertices.push([width, 0, 0]);
  vertices.push([width, width, 0]);

  const lines = [];

  lines.push([0, 1]);
  lines.push([1, 3]);
  lines.push([3, 2]);
  lines.push([2, 0]);

  return { vertices, lines };
}
