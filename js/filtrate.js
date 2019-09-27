'use strict';

(function () {

  window.filtrate = filtrate;

  function filtrate() {
    var MAX_NEW_PICTURES_COUNT = 9;

    var filtratedPictures = {
      popular: window.data,
      new: getNewPicturesArray(),
      mostDiscussed: getMostDiscussedPicturesArray()
    }

    var filtersElement = document.querySelector('.img-filters');

    filtersElement.classList.remove('img-filters--inactive');

    function getNewPicturesArray() {
      var newPicturesArray = [];

      while (newPicturesArray.length <= MAX_NEW_PICTURES_COUNT) {
        var randomNumber = Math.floor(Math.random() * (window.data.length - 1));

        if (newPicturesArray.indexOf(window.data[randomNumber]) === -1) {
          newPicturesArray.push(window.data[randomNumber]);
        }
      }

      return newPicturesArray;
    }

    function getMostDiscussedPicturesArray() {
      var mostDiscussedPicturesArray = window.data.slice();
      mostDiscussedPicturesArray.sort(function (current, next) {
        return next.comments.length - current.comments.length;
      });

      return mostDiscussedPicturesArray;
    }
  }

})();
