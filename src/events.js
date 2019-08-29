import { Moves } from './ctrl';

import * as drag from './drag';

export function bindDocument(ctrl, g) {
  const unbinds = [];

  const onMouseDown = withEvent(ctrl, g, drag.start),
        onMouseUp = withEvent(ctrl, g, drag.cancel),
        onMouseMove = withEvent(ctrl, g, drag.move);

  unbinds.push(unbindable(document, 'mousedown', onMouseDown));
  unbinds.push(unbindable(document, 'mouseup', onMouseUp));
  unbinds.push(unbindable(document, 'mousemove', onMouseMove));

  return () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function withEvent(ctrl, g, withDrag) {
  return function(e) {
    withDrag(ctrl, g, e);
  };
}
