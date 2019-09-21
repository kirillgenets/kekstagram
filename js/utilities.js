'use strict';

(function () {

  function hideDOMElement(element) {

    element.classList.add('visually-hidden');

  }

  function isEnterEvent(evt) {

    return evt.key === 'Enter';

  }

  function isEscEvent(evt) {

    return evt.key === 'Escape';

  }

  window.utilities = {
    hideDOMElement: hideDOMElement,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };

})();
