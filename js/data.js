'use strict';

(function () {

  window.backend.getDataFromServer(onLoad, onError);

  function onLoad(data) {
    window.data = data;
    window.drawAllPictures(window.data);
    window.filtrate();
  }

  function onError(errorMessage) {
    var main = document.body.querySelector('main');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorTitle = errorElement.querySelector('.error__title');
    var errorButtons = errorElement.querySelector('.error__buttons');

    errorButtons.style.display = 'none';
    errorTitle.textContent = errorMessage;

    main.appendChild(errorElement);

    document.addEventListener('keydown', onErrorKeyDown);
    errorElement.addEventListener('click', onErrorElementClick);

    function onErrorKeyDown(evt) {
      if (window.utilities.isEscEvent(evt)) {
        closeErrorElement();
      }
    }

    function onErrorElementClick() {
      closeErrorElement();
    }

    function closeErrorElement() {
      document.removeEventListener('keydown', onErrorKeyDown);
      errorElement.removeEventListener('click', onErrorElementClick);
      main.removeChild(errorElement);
    }

  }

})();
