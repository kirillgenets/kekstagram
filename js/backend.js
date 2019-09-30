'use strict';

(function () {

  window.backend = {
    getDataFromServer: getDataFromServer,
    sendDataToServer: sendDataToServer
  };

  function getDataFromServer(onLoad, onError) {
    var dataRequest = new XMLHttpRequest();
    dataRequest.responseType = 'json';

    dataRequest.open('GET', 'https://js.dump.academy/kekstagram/data');

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);

    dataRequest.send();

    function onDataRequestLoad() {
      onLoad(dataRequest.response);
    }

    function onDataRequestError() {
      onError('Ошибка при загрузке данных');
    }
  }

  function sendDataToServer(data, onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('POST', 'https://js.dump.academy/kekstagram');

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);

    dataRequest.send();

    function onDataRequestLoad() {
      onLoad();
    }

    function onDataRequestError() {
      onError('Ошибка при отправке данных');
    }
  }

})();
