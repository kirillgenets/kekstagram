'use strict';

(function () {

  var MAX_LOADING_TIME = 10000;
  var SUCCESS_STATUS = 200;

  window.backend = {
    getData: getData,
    sendData: sendData
  };

  function getData(onLoad, onError) {
    var GET_URL = 'https://js.dump.academy/kekstagram/data';

    var dataRequest = new XMLHttpRequest();
    dataRequest.responseType = 'json';

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);
    dataRequest.addEventListener('timeout', onDataRequestTimeout);

    dataRequest.timeout = MAX_LOADING_TIME;

    dataRequest.open('GET', GET_URL);
    dataRequest.send();

    function onDataRequestLoad() {
      if (dataRequest.status === SUCCESS_STATUS) {
        onLoad(dataRequest.response);
      } else {
        onError('Ошибка при загрузке данных: ' + dataRequest.status + ' ' + dataRequest.statusText);
      }
    }

    function onDataRequestError() {
      onError('Ошибка при загрузке данных');
    }

    function onDataRequestTimeout() {
      onError('Не удалось загрузить данные за' + dataRequest.timeout + ' мс');
    }
  }

  function sendData(data, onLoad, onError) {
    var POST_URL = 'https://js.dump.academy/kekstagram';

    var dataRequest = new XMLHttpRequest();
    dataRequest.responseType = 'json';

    dataRequest.addEventListener('load', onDataRequestLoad);
    dataRequest.addEventListener('error', onDataRequestError);
    dataRequest.addEventListener('timeout', onDataRequestTimeout);

    dataRequest.timeout = MAX_LOADING_TIME;

    dataRequest.open('POST', POST_URL);
    dataRequest.send(data);

    function onDataRequestLoad() {
      if (dataRequest.status === SUCCESS_STATUS) {
        onLoad();
      } else {
        onError('Ошибка при отправке данных: ' + dataRequest.status + ' ' + dataRequest.statusText);
      }
    }


    function onDataRequestError() {
      onError('Ошибка при отправке данных');
    }

    function onDataRequestTimeout() {
      onError('Не удалось отправить данные за' + dataRequest.timeout + ' мс');
    }
  }

})();
