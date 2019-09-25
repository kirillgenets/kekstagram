'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictures = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  window.data.forEach(function (picture, index) {
    picturesFragment.appendChild(createPicture(picture, index));
  });

  pictures.appendChild(picturesFragment);

  var smallPictures = document.querySelectorAll('.picture');

  smallPictures.forEach(initPicturesListeners);

  function createPicture(picture, index) {
    var image = pictureTemplate.cloneNode(true);

    image.setAttribute('data-number', index);
    image.querySelector('.picture__comments').textContent = picture.comments.length; // Устанавливаем количество комментариев
    image.querySelector('.picture__likes').textContent = picture.likes; // Устанавливаем количество лайков
    image.querySelector('.picture__img').src = picture.url; // Устанавливаем картинку

    return image;
  }

  function initPicturesListeners(picture) {
    picture.addEventListener('click', onPictureClick);
    picture.addEventListener('keydown', onPictureKeyDown);

    function onPictureClick(evt) {
      window.drawBigPicture(evt.currentTarget.dataset.number);
    }

    function onPictureKeyDown(evt) {
      if (window.utilities.isEnterEvent(evt)) {
        evt.preventDefault();
        window.drawBigPicture(evt.currentTarget.dataset.number);
      }
    }
  }

})();
