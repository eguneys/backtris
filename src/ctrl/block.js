import * as u from '../util';

import * as mat4 from '../matrix';

export default function mesh(geometry) {

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

  this.updateModel = () => {
    const { x, y, z, 
            width,
            height,
            theta } = this;

    modelMatrix = mat4.translation(x,
                                   y,
                                   z);

    modelMatrix = mat4.translate(modelMatrix, 
                                 width * 0.5,
                                 height * 0.5, 0);

    modelMatrix = mat4.zRotate(modelMatrix, theta);

    modelMatrix = mat4.translate(modelMatrix,
                                 -width * 0.5,
                                 -height * 0.5 * 0.0, 0);
  };
 
}
