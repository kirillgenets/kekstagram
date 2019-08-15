'use strict';

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

var pictureTemplate = document.querySelector('#picture');
var commentsContainer = document.querySelector('.social__comments');

var MAX_COMMENTS_COUNT = 8;
var MAX_LIKES_COUNT = 201;
var MIN_LIKES_COUNT = 15;
var MAX_AVATAR_NUMBER = 7;
var PHOTOS_COUNT = 25;

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

  var photosList = document.querySelector('.pictures');
  var photosListFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

  // Формирование фрагмента

  for (var i = 0; i < postedPhotos.length; i++) {

    var pictureToInsert = document.importNode(createDOMElementFromObject(i).content, true);

    photosListFragment.appendChild(pictureToInsert); // Вставляем фрагмент в документ

  }

  photosList.appendChild(photosListFragment);

}

function createDOMElementFromObject(numberOfPicture) {

  var pictureTemplateClone = pictureTemplate.cloneNode(true);
  var picture = pictureTemplateClone.content.querySelector('.picture__img');
  var commentsCount = pictureTemplateClone.content.querySelector('.picture__comments');
  var likesCount = pictureTemplateClone.content.querySelector('.picture__likes');

  picture.src = postedPhotos[numberOfPicture].url; // Устанавливаем картинку
  commentsCount.textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
  likesCount.textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

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

  commentsContainer.appendChild(comment); // Вставка комментария в блок комментариев

}

function showComments(numberOfPicture) {

  for (var i = 0; i < postedPhotos[numberOfPicture].comments.length; i++) {

    if (commentsContainer.children.length < 5) {
      createComment(postedPhotos[numberOfPicture].comments[i].message, postedPhotos[numberOfPicture].comments[i].avatar);
    }

  }

}

function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}
