'use strict';

(function () {

  window.utilities = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };

  function isEnterEvent(evt, callback) {
    if (evt.key === 'Enter') {
      callback(evt);
    }
  }

  function isEscEvent(evt, callback) {
    if (evt.key === 'Escape') {
      callback(evt);
    }
  }

})();
