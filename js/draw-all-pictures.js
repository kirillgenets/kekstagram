'use strict';

(function () {

  window.drawAllPictures = drawAllPictures;

  function drawAllPictures(data) {
    var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
    var picturesContainer = document.querySelector('.pictures');
    var picturesFragment = document.createDocumentFragment();

    data.forEach(function (picture, index) {
      picturesFragment.appendChild(createPicture(picture, index));
    });

    picturesContainer.appendChild(picturesFragment);

    var allSmallPictures = document.querySelectorAll('.picture');

    allSmallPictures.forEach(initSmallPicturesListeners);

    function createPicture(picture, index) {
      var image = pictureTemplate.cloneNode(true);

      image.setAttribute('data-number', index);
      image.querySelector('.picture__comments').textContent = picture.comments.length;
      image.querySelector('.picture__likes').textContent = picture.likes;
      image.querySelector('.picture__img').src = picture.url;

      return image;
    }

    function initSmallPicturesListeners(picture) {
      picture.addEventListener('click', onPictureClick);
      picture.addEventListener('keydown', onPictureKeyDown);

      function onPictureClick(evt) {
        window.drawBigPicture(evt.currentTarget.dataset.number);
      }

      function onPictureKeyDown(downEvt) {
        window.utilities.isEnterEvent(downEvt, function (evt) {
          evt.preventDefault();
          window.drawBigPicture(evt.currentTarget.dataset.number);
        });
      }
    }
  }

})();
