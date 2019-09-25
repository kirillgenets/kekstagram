'use strict';

(function () {

  window.backend.getDataFromServer(onLoad, onError);

  function onLoad(data) {
    window.data = data;
  }

  function onError(errorMessage) {
    var main = document.body.querySelector('main');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorTitle = errorElement.querySelector('.error__title');

    errorTitle.textContent = errorMessage;

    main.appendChild(errorElement);
  }

})();
