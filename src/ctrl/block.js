import * as u from '../util';

import * as mat4 from '../matrix';

export default function block(ctrl, g) {

  const { camera } = ctrl;

  const { width, height, holeRadius } = ctrl.data.game;

  let blockHeight = width * 0.01,
      blockWidth = width * 0.04,
      blockDepth = width * 0.008;

  const tilesCtrl = ctrl.play.tiles;

  let geometry,
      iTheta;
  let lScale = 1.0;
  
  this.init = d => {

    this.data = { 
      tTheta: 0,
      theta: 0,
      z: camera.near,
      ...d };

    iTheta = this.data.tTheta;

    geometry = cubeGeometry(blockHeight,
                            blockWidth,
                            blockDepth);

  };

  let modelMatrix = mat4.identity();

  this.geometry = () => {

    let { vertices, lines } = geometry;

    let model = vertices.map(vertex => {
      return mat4.multiplyVec(modelMatrix, [...vertex, 1.0]);
    });

    let view = model.map(vertex =>
      camera.project(vertex)
    );


    return {
      view,
      lines
    };
  };

  const updatePos = delta => {
    const { tick } = ctrl.data;
    
    lScale = 1.0 - u.usin(tick * 0.005) * 0.2;

    iTheta = u.interpolate(iTheta, this.data.tTheta);

    this.data.theta = u.interpolate(this.data.theta, iTheta);

    this.data.z += delta * 0.1;

    this.data.x = Math.cos(this.data.theta) * holeRadius * 2.0;
    this.data.y = Math.sin(this.data.theta) * holeRadius * 2.0;
  };

  const updateModel = () => {
    modelMatrix = mat4.translation(this.data.x,
                                   this.data.y,
                                   this.data.z);

    modelMatrix = mat4.translate(modelMatrix, 
                                 blockWidth * 0.5,
                                 blockHeight * 0.5, 0);

    modelMatrix = mat4.zRotate(modelMatrix, this.data.theta);

    modelMatrix = mat4.scale(modelMatrix, lScale, 1, 1);

    modelMatrix = mat4.translate(modelMatrix,
                                 -blockWidth * 0.5,
                                 -blockHeight * 0.5 * 0.0, 0);
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

function cubeGeometry(width, height, depth = width) {
  const vertices = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, height, 0]);
  vertices.push([width, 0, 0]);
  vertices.push([width, height, 0]);

  vertices.push([0, 0, depth]);
  vertices.push([0, height, depth]);
  vertices.push([width, 0, depth]);
  vertices.push([width, height, depth]);

  const lines = [];

  lines.push([0, 1]);
  lines.push([1, 3]);
  lines.push([3, 2]);
  lines.push([2, 0]);

  lines.push([0, 4]);
  lines.push([1, 5]);
  lines.push([2, 6]);
  lines.push([3, 7]);

  lines.push([4, 5]);
  lines.push([5, 7]);
  lines.push([7, 6]);
  lines.push([6, 4]);
  

  return { vertices, lines };
}
