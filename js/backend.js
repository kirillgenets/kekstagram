'use strict';

(function () {

  window.backend = {
    getDataFromServer: getDataFromServer
  }

  function getDataFromServer(onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('GET', 'https://js.dump.academy/kekstagram/data');
    dataRequest.send();

    dataRequest.addEventListener('readystatechange', onDataRequestReadyStateChange);

    function onDataRequestReadyStateChange() {
      if (dataRequest.readyState != 4) {
        return
      }

      dataRequest.status === 200 ? onLoad(dataRequest.responseText) : onError('Ошибка при загрузке данных');
    }
  }

})();
