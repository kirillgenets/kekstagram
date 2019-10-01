'use strict';

(function () {

  window.filtrate = filtrate;

  function filtrate() {
    var MAX_NEW_PICTURES_COUNT = 10;
    var RENDERING_LIMIT = 500;

    var filtersElement = document.querySelector('.img-filters');
    var popularFilterButton = filtersElement.querySelector('#filter-popular');
    var newFilterButton = filtersElement.querySelector('#filter-new');
    var discussedFilterButton = filtersElement.querySelector('#filter-discussed');
    var picturesContainer = document.querySelector('.pictures');

    var defaultData = window.data;

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
        window.drawAllPictures(defaultData);
        popularFilterButton.classList.add('img-filters__button--active');
      }
    }

    function onNewFilterButtonClick() {
      if (!newFilterButton.classList.contains('img-filters__button--active')) {
        avoidDebounce(drawFiltratedPictures, RENDERING_LIMIT);
      }

      function drawFiltratedPictures() {
        removePreviousFilter();
        window.data = getNewPicturesArray();
        window.drawAllPictures(window.data);
        newFilterButton.classList.add('img-filters__button--active');
      }
    }

    function onDiscussedFilterButtonClick() {
      if (!discussedFilterButton.classList.contains('img-filters__button--active')) {
        avoidDebounce(drawFiltratedPictures, RENDERING_LIMIT);
      }

      function drawFiltratedPictures() {
        removePreviousFilter();
        window.data = getMostDiscussedPicturesArray();
        window.drawAllPictures(window.data);
        discussedFilterButton.classList.add('img-filters__button--active');
      }
    }

    function getNewPicturesArray() {
      var newPicturesArray = defaultData.slice();
      newPicturesArray.sort(randomizeOrder).splice(0, newPicturesArray.length - MAX_NEW_PICTURES_COUNT);

      return newPicturesArray;

      function randomizeOrder() {
        return 0.5 - Math.random();
      }
    }

    function getMostDiscussedPicturesArray() {
      var mostDiscussedPicturesArray = defaultData.slice();
      mostDiscussedPicturesArray.sort(function (current, next) {
        return next.comments.length === current.comments.length ? next.likes - current.likes : next.comments.length - current.comments.length;
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
