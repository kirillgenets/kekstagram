'use strict';

(function () {

  window.filtrate = filtrate;

  function filtrate() {
    var MAX_NEW_PICTURES_COUNT = 9;
    var RENDERING_LIMIT = 500;

    var filtratedPictures = {
      popular: window.data,
      new: getNewPicturesArray(),
      mostDiscussed: getMostDiscussedPicturesArray()
    }

    var filtersElement = document.querySelector('.img-filters');
    var popularFilterButton = filtersElement.querySelector('#filter-popular');
    var newFilterButton = filtersElement.querySelector('#filter-new');
    var discussedFilterButton = filtersElement.querySelector('#filter-discussed');
    var picturesContainer = document.querySelector('.pictures');

    var renderingTimeout;

    filtersElement.classList.remove('img-filters--inactive');

    initFilterListeners();

    function initFilterListeners() {
      popularFilterButton.addEventListener('click', onPopularFilterButtonClick);
      newFilterButton.addEventListener('click', onNewFilterButtonClick);
      discussedFilterButton.addEventListener('click', onDiscussedFilterButtonClick);
    }

    function onPopularFilterButtonClick() {
      if (!popularFilterButton.classList.contains('img-filters__button--active')) {
        avoidDebounce(drawFiltratedPictures, RENDERING_LIMIT);
      }

      function drawFiltratedPictures() {
        removePreviousFilter();
        window.drawAllPictures(filtratedPictures.popular);
        popularFilterButton.classList.add('img-filters__button--active');
      }
    }

    function onNewFilterButtonClick() {
      if (!newFilterButton.classList.contains('img-filters__button--active')) {
        avoidDebounce(drawFiltratedPictures, RENDERING_LIMIT);
      }

      function drawFiltratedPictures() {
        removePreviousFilter();
        window.drawAllPictures(filtratedPictures.new);
        newFilterButton.classList.add('img-filters__button--active');
      }
    }

    function onDiscussedFilterButtonClick() {
      if (!discussedFilterButton.classList.contains('img-filters__button--active')) {
        avoidDebounce(drawFiltratedPictures, RENDERING_LIMIT);
      }

      function drawFiltratedPictures() {
        removePreviousFilter();
        window.drawAllPictures(filtratedPictures.mostDiscussed);
        discussedFilterButton.classList.add('img-filters__button--active');
      }
    }

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

    function removePreviousFilter() {
      var allPictures = picturesContainer.querySelectorAll('.picture');

      document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');

      allPictures.forEach(function (picture) {
        picturesContainer.removeChild(picture);
      });
    }

    function avoidDebounce(callback) {
      if (renderingTimeout) {
        clearTimeout(renderingTimeout);
      }

      renderingTimeout = setTimeout(callback, RENDERING_LIMIT);
    }
  }

})();
