'use strict';

(function () {

  var RENDERING_LIMIT = 500;

  var renderingTimeout;

  window.avoidDebounce = avoidDebounce;

  function avoidDebounce(callback) {
    if (renderingTimeout) {
      clearTimeout(renderingTimeout);
    }

    renderingTimeout = setTimeout(callback, RENDERING_LIMIT);
  }

})();
