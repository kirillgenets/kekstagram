'use strict';

(function () {

  window.backend.getData(onLoad, onError);

  function onLoad(data) {
    window.data = data;
    window.drawAllPictures(window.data);
    window.filtrate();
  }

  function onError(errorMessage) {
    var main = document.body.querySelector('main');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorModal = errorTemplate.cloneNode(true);
    var errorTitle = errorModal.querySelector('.error__title');
    var errorButtons = errorModal.querySelector('.error__buttons');

    errorButtons.style.display = 'none';
    errorTitle.textContent = errorMessage;

    main.appendChild(errorModal);

    document.addEventListener('keydown', onErrorKeyDown);
    errorModal.addEventListener('click', onErrorModalClick);

    function onErrorKeyDown(evt) {
      window.utilities.isEscEvent(evt, function (evt) {
        evt.preventDefault();
        closeErrorModal();
      })
    }

    function onErrorModalClick() {
      closeErrorModal();
    }

    function closeErrorModal() {
      document.removeEventListener('keydown', onErrorKeyDown);
      errorModal.removeEventListener('click', onErrorModalClick);
      main.removeChild(errorModal);
    }

  }

})();
