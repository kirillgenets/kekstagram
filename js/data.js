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

  var data = [];

  makePhotosArray();

  window.data = data;

  function makePhotosArray() {
    for (var i = 0; i < PHOTOS_COUNT; i++) {
      data.push({
        url: 'photos/' + (i + 1) + '.jpg',
        description: getRandomElementFromArray(descriptionsList),
        likes: generateRandomNumber(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
        comments: generateRandomComments()
      });
    }
  }

  function getRandomElementFromArray(array) {
    return array[generateRandomNumber(0, array.length)];
  }

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function generateRandomComments() {
    var commentsCount = generateRandomNumber(1, MAX_COMMENTS_COUNT);
    var commentsList = [];

    for (var j = 0; j < commentsCount; j++) {
      commentsList.push({
        avatar: 'img/avatar-' + generateRandomNumber(1, MAX_AVATAR_NUMBER) + '.svg',
        message: getRandomElementFromArray(messagesList), // Берем рандомный комментарий из массива комментариев
        name: getRandomElementFromArray(peopleNames) // Берем рандомное имя из массива имён
      });
    }

    return commentsList;
  }

})();
