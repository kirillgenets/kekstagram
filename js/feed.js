'use strict';

(function () {

  var MAX_COMMENTS_COUNT = 14;
  var MAX_LIKES_COUNT = 201;
  var MIN_LIKES_COUNT = 15;
  var MAX_AVATAR_NUMBER = 7;
  var PHOTOS_COUNT = 25;

  var peopleNames = [
    'Абрам',
    'Август',
    'Артём',
    'Иван',
    'Катя',
    'Егор',
    'Игорь',
    'Маша',
    'Лена',
    'Вика',
    'Вероника',
    'Света',
    'Максим',
    'Дмитрий',
    'Вася',
    'Валерий',
    'Захар',
    'Витя',
    'Руслан',
    'Евгения',
    'Аня'
  ];

  var messagesList = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var descriptionsList = [
    'Тестим новую камеру! =)',
    'Тестим старую камеру!',
    'Моя новая фотка',
    'Моя старая фотка',
    'Фотка из путешествия',
    'Вам нравится?',
    'Круто же выглядит, правда?'
  ];

  var postedPhotos = [];

  drawPictures();

  window.feed = {
    postedPhotos: postedPhotos
  };

  function drawPictures() {

    makePhotosArray();
    insertPhotosIntoDocument();

    function makePhotosArray() {

      for (var i = 0; i < PHOTOS_COUNT; i++) {

        postedPhotos.push({
          url: 'photos/' + (i + 1) + '.jpg',
          description: window.getData.generateRandomData(descriptionsList),
          likes: window.getData.generateRandomNumber(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
          comments: generateRandomComments()
        });

      }

    }

    function insertPhotosIntoDocument() {

      var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
      var pictures = document.querySelector('.pictures');
      var picturesFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

      // Формирование фрагмента

      postedPhotos.forEach(function (picture, index) {
        picturesFragment.appendChild(createPicture(picture, index));
      });

      pictures.appendChild(picturesFragment);

      var smallPictures = document.querySelectorAll('.picture');

      smallPictures.forEach(initPicturesListeners);

      function createPicture(picture, index) {

        var image = pictureTemplate.cloneNode(true);

        // Заполнение картинки данными из объекта

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

          window.bigPicture.drawBigPicture(getNumberOfPicture(evt.currentTarget));

        }

        function onPictureKeyDown(evt) {

          if (window.utilities.isEnterEvent(evt)) {
            evt.preventDefault();
            window.bigPicture.drawBigPicture(getNumberOfPicture(evt.currentTarget));
          }

        }

      }

    }

  }

  function getNumberOfPicture(picture) {

    return picture.dataset.number;

  }

  function generateRandomComments() {

    var commentsCount = window.getData.generateRandomNumber(1, MAX_COMMENTS_COUNT);
    var commentsList = [];

    for (var j = 0; j < commentsCount; j++) {

      commentsList.push({
        avatar: 'img/avatar-' + window.getData.generateRandomNumber(1, MAX_AVATAR_NUMBER) + '.svg',
        message: window.getData.generateRandomData(messagesList), // Берем рандомный комментарий из массива комментариев
        name: window.getData.generateRandomData(peopleNames) // Берем рандомное имя из массива имён
      });

    }

    return commentsList;

  }

})();
