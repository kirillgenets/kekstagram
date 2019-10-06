'use strict';

(function () {

  var MAX_NEW_PICTURES_COUNT = 10;

  var filtersContainer = document.querySelector('.img-filters');
  var allFilterButtons = filtersContainer.querySelectorAll('.img-filters__button');
  var picturesContainer = document.querySelector('.pictures');

  window.filtrate = filtrate;

  function filtrate() {
    var defaultData = window.data;

    filtersContainer.classList.remove('img-filters--inactive');

    allFilterButtons.forEach(initFilterListeners);

    function initFilterListeners(filterButton) {
      filterButton.addEventListener('click', onFilterButtonClick);

      function onFilterButtonClick() {
        switch (filterButton.id) {
          case 'filter-popular':
            window.data = defaultData;
            break;
          case 'filter-new':
            window.data = getNewPicturesArray();
            break;
          case 'filter-discussed':
            window.data = getMostDiscussedPicturesArray();
            break;
        }

        removePreviousFilter();
        window.avoidDebounce(drawFiltratedPictures);
        filterButton.classList.add('img-filters__button--active');
      }
    }

    function drawFiltratedPictures() {
      window.drawAllPictures(window.data);
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

      allFilterButtons.forEach(function (button) {
        button.classList.remove('img-filters__button--active');
      });

      allPictures.forEach(function (picture) {
        picturesContainer.removeChild(picture);
      });
    }

  }

})();
