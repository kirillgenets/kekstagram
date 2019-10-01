'use strict';

(function () {

  var MAX_LOADING_TIME = 5000;

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
    dataRequest.addEventListener('timeout', onDataRequestTimeout);

    dataRequest.timeout = MAX_LOADING_TIME;
    dataRequest.send();

    function onDataRequestLoad() {
      onLoad(dataRequest.response);
    }

    function onDataRequestError() {
      onError('Ошибка при загрузке данных');
    }

    function onDataRequestTimeout() {
      onError('Не удалось загрузить данные');
    }
  }

  function sendDataToServer(data, onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('POST', 'https://js.dump.academy/kekstagram');
    dataRequest.responseType = 'json';

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);
    dataRequest.addEventListener('timeout', onDataRequestTimeout);

    dataRequest.timeout = MAX_LOADING_TIME;
    dataRequest.send(data);

    function onDataRequestLoad() {
      onLoad();
    }

    function onDataRequestError() {
      onError('Ошибка при отправке данных');
    }

    function onDataRequestTimeout() {
      onError('Не удалось отправить данные');
    }
  }

})();
