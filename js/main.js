'use strict';

var MAX_SHOWN_COMMENTS_COUNT = 5;
var MAX_COMMENTS_COUNT = 8;
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

var commentsContainer = document.querySelector('.social__comments');

var postedPhotos = [];

drawPictures();

showBigPicture(0);

hideDOMElement(document.querySelector('.social__comment-count'));
hideDOMElement(document.querySelector('.comments-loader'));

/* Функции */

function drawPictures() {

  makePhotosArray();
  insertPhotosIntoDocument();

}

function generateRandomComments() {

  var commentsCount = generateRandomNumber(0, MAX_COMMENTS_COUNT);
  var commentsList = [];

  for (var i = 0; i < commentsCount; i++) {

    commentsList.push({
      avatar: 'img/avatar-' + generateRandomNumber(1, MAX_AVATAR_NUMBER) + '.svg',
      message: generateRandomData(messagesList), // Берем рандомный комментарий из массива комментариев
      name: generateRandomData(peopleNames) // Берем рандомное имя из массива имён
    });

  }

  return commentsList;

}

function generateRandomData(source) {

  return source[generateRandomNumber(0, source.length)];

}

function generateRandomNumber(min, max) {

  return Math.floor(Math.random() * (max - min) + min);

}

function makePhotosArray() {

  for (var i = 0; i < PHOTOS_COUNT; i++) {

    postedPhotos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: generateRandomData(descriptionsList),
      likes: generateRandomNumber(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
      comments: generateRandomComments()
    });

  }

}

function insertPhotosIntoDocument() {

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photosList = document.querySelector('.pictures');
  var photosListFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

  // Формирование фрагмента

  for (var i = 0; i < postedPhotos.length; i++) {

    photosListFragment.appendChild(createDOMElementFromObject(pictureTemplate, i)); // Вставляем фрагмент в документ

  }

  photosList.appendChild(photosListFragment);

}

function createDOMElementFromObject(template, numberOfPicture) {

  var pictureTemplateClone = template.cloneNode(true);

  pictureTemplateClone.querySelector('.picture__img').src = postedPhotos[numberOfPicture].url; // Устанавливаем картинку
  pictureTemplateClone.querySelector('.picture__comments').textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
  pictureTemplateClone.querySelector('.picture__likes').textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

  return pictureTemplateClone;

}

function showBigPicture(numberOfPicture) {

  var bigPicture = document.querySelector('.big-picture'); // Показываем большое изображение
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img img').src = postedPhotos[numberOfPicture].url;
  bigPicture.querySelector('.social__caption').textContent = postedPhotos[numberOfPicture].description;
  bigPicture.querySelector('.likes-count').textContent = postedPhotos[numberOfPicture].likes;
  bigPicture.querySelector('.comments-count').textContent = postedPhotos[numberOfPicture].comments.length;

  commentsContainer.innerHTML = '';
  showComments(numberOfPicture);

}

function createComment(message, avatarSrc) {

  var comment = document.createElement('li');
  comment.className = 'social__comment';

  var avatarImage = document.createElement('img');
  avatarImage.className = 'social__picture';
  avatarImage.src = avatarSrc;
  avatarImage.alt = 'Аватар комментатора фотографии';
  avatarImage.width = 35;
  avatarImage.height = 35;
  comment.appendChild(avatarImage);

  var commentMessage = document.createElement('p');
  commentMessage.className = 'social__text';
  commentMessage.textContent = message;
  comment.appendChild(commentMessage);

  return comment;

}

function showComments(numberOfPicture) {

  var i = 0;
  while (i < postedPhotos[numberOfPicture].comments.length && i < MAX_SHOWN_COMMENTS_COUNT) {
    commentsContainer.appendChild(createComment(postedPhotos[numberOfPicture].comments[i].message, postedPhotos[numberOfPicture].comments[i].avatar));
    i++;
  }

}

function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}
