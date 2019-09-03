import * as u from '../util';

export default function over(ctrl, g) {

  const renderOver = ctrl => {

    

  };

  
  this.render = ctrl => {

    if (ctrl.data.state === u.States.Over) {
      renderOver(ctrl);
    }
    
  };
  
}
