export default function Camera(ctrl) {

  const { width, height } = ctrl.data.game;

  let fov = width * 0.8,
      pCX = width * 0.5 ,
      pCY = height * 0.5;


  this.far = -width*0.5;
  this.near = -width*0.78;


  this.project = (v3) => {
    let pScale = fov / (fov + v3[2]);

    return [v3[0] * pScale + pCX,
            v3[1] * pScale + pCY];
  };
}
