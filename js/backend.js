(function () {

  function getDataFromServer(onLoad, onError) {
    var dataRequest = new XMLHttpRequest();

    dataRequest.open('GET', 'https://js.dump.academy/kekstagram/data');
    dataRequest.send();

    dataRequest.addEventListener('readystatechange', onDataRequestReadyStateChange);

    function onDataRequestReadyStateChange() {
      if (dataRequest.readyState != 4) {
        return
      }

      dataRequest.status === 200 ? onLoad(dataRequest.responseText) : onError('Произошла ошибка при загрузке данных с сервера');
    }
  }

  window.backend = {
    getDataFromServer: getDataFromServer
  }

})();
