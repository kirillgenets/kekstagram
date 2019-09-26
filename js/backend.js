'use strict';

(function () {

  window.backend = {
    getDataFromServer: getDataFromServer,
    sendDataToServer: sendDataToServer
  };

  function getDataFromServer(onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('GET', 'https://js.dump.academy/kekstagram/data');
    dataRequest.send();

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);

    function onDataRequestLoad() {
      onLoad(dataRequest.responseText);
    }

    function onDataRequestError() {
      onError('Ошибка при загрузке данных');
    }
  }

  function sendDataToServer(data, onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('POST', 'https://js.dump.academy/kekstagram');
    dataRequest.send();

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);

    function onDataRequestLoad() {
      onLoad();
    }

    function onDataRequestError() {
      onError('Ошибка при отправке данных');
    }
  }

})();
