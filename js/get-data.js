'use strict';

(function () {

  function generateRandomData(source) {

    return source[generateRandomNumber(0, source.length)];

  }

  function generateRandomNumber(min, max) {

    return Math.floor(Math.random() * (max - min) + min);

  }

  window.getData = {
    generateRandomNumber: generateRandomNumber,
    generateRandomData: generateRandomData
  };

})();
