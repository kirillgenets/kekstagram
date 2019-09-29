'use strict';

(function () {

  function isEnterEvent(evt) {
    return evt.key === 'Enter';
  }

  function isEscEvent(evt) {
    return evt.key === 'Escape';
  }

  window.utilities = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };

})();
