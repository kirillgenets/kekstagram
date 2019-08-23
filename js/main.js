'use strict';

var MAX_SHOWN_COMMENTS_COUNT = 5;
var MAX_COMMENTS_COUNT = 14;
var MAX_LIKES_COUNT = 201;
var MIN_LIKES_COUNT = 15;
var MAX_AVATAR_NUMBER = 7;
var PHOTOS_COUNT = 25;
var MAX_BLUR_SATURATION = 5;
var MAX_BRIGHTNESS_SATURATION = 3;
var DEFAULT_PIN_POSITION = '20%';

var lastShownComment = 0;

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
uploadPicture();

showBigPicture();
hideDOMElement(document.querySelector('.social__comment-count'));
hideDOMElement(document.querySelector('.comments-loader'));

/* Функции для показа изображений */

function drawPictures() {

  makePhotosArray();
  insertPhotosIntoDocument();
  setTabIndexesForPictures();

}

function setTabIndexesForPictures() {

  var pictures = document.querySelectorAll('.picture__img');

  for (var i = 0; i < pictures.length; i++) {
    pictures[i].setAttribute('tabindex', i + 1);
  }

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

    photosListFragment.appendChild(createPicture(pictureTemplate, i)); // Вставляем фрагмент в документ

  }

  photosList.appendChild(photosListFragment);

}

function createPicture(template, numberOfPicture) {

  var pictureTemplateClone = template.cloneNode(true);

  // Заполнение картинки данными из объекта

  pictureTemplateClone.querySelector('.picture__img').src = postedPhotos[numberOfPicture].url; // Устанавливаем картинку
  pictureTemplateClone.querySelector('.picture__comments').textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
  pictureTemplateClone.querySelector('.picture__likes').textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

  return pictureTemplateClone;

}

/* Функции для работы с большим изображением */

function getNumberOfPicture(picture) {

  var number = 0;

  for (var i = 0; i < document.querySelectorAll('.picture').length; i++) {

    if (document.querySelectorAll('.picture')[i] === picture.parentNode) {
      number = i;
    }

  }

  return number;

}

function showBigPicture() {

  document.querySelector('.pictures').addEventListener('click', function (event) {

    var target = event.target;
    if (target.className === 'picture__img') {
      createBigPicture(getNumberOfPicture(target));
      document.querySelector('.big-picture').classList.remove('hidden'); // Показываем большое изображение
    }

  });

  document.addEventListener('keydown', function (event) {

    if (event.key === 'Enter') {

      var target = event.target;
      if (target.className === 'picture__img') {
        createBigPicture(getNumberOfPicture(target));
        document.querySelector('.big-picture').classList.remove('hidden'); // Показываем большое изображение
      }

    }

  });


  hideBigPicture();

}

function hideBigPicture() {

  // Закрытие окна при клике на крестик

  document.querySelector('.big-picture__cancel').addEventListener('click', function () {

    if (!document.querySelector('.big-picture').classList.contains('hidden')) {
      document.querySelector('.big-picture').classList.add('hidden');
      lastShownComment = 0;
    }

  });

  // Закрытие окна при нажатии ESC

  window.addEventListener('keydown', function (event) {

    if (event.key === 'Escape' && !document.querySelector('.big-picture').classList.contains('hidden')) {
      document.querySelector('.big-picture').classList.add('hidden');
      lastShownComment = 0;
    }

  });

}

function createBigPicture(numberOfPicture) {

  var commentsContainer = document.querySelector('.social__comments');
  var bigPicture = document.querySelector('.big-picture');

  // Заполнение большого изображения нужными данными

  bigPicture.querySelector('.big-picture__img img').src = postedPhotos[numberOfPicture].url;
  bigPicture.querySelector('.social__caption').textContent = postedPhotos[numberOfPicture].description;
  bigPicture.querySelector('.likes-count').textContent = postedPhotos[numberOfPicture].likes;
  bigPicture.querySelector('.comments-count').textContent = postedPhotos[numberOfPicture].comments.length;

  commentsContainer.innerHTML = '';
  showComments(commentsContainer, numberOfPicture);

}

function createComment(message, avatarSrc) {

  // Формирование контейнера комментария

  var comment = document.createElement('li');
  comment.className = 'social__comment';

  // Формирование аватарки комментария

  var avatarImage = document.createElement('img');
  avatarImage.className = 'social__picture';
  avatarImage.src = avatarSrc;
  avatarImage.alt = 'Аватар комментатора фотографии';
  avatarImage.width = 35;
  avatarImage.height = 35;
  comment.appendChild(avatarImage);

  // Формирование сообщения комментария

  var commentMessage = document.createElement('p');
  commentMessage.className = 'social__text';
  commentMessage.textContent = message;
  comment.appendChild(commentMessage);

  return comment;

}

function showComments(destination, numberOfPicture) {

  var commentsFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

  // Формирование фрагмента

  var i = 0;
  while (i < postedPhotos[numberOfPicture].comments.length && i < MAX_SHOWN_COMMENTS_COUNT && lastShownComment < postedPhotos[numberOfPicture].comments.length) {
    commentsFragment.appendChild(createComment(postedPhotos[numberOfPicture].comments[lastShownComment].message, postedPhotos[numberOfPicture].comments[lastShownComment].avatar));
    lastShownComment++;
    i++;
  }

  destination.appendChild(commentsFragment); // Вставка фрагмента в документ

}

function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}

/* Функции для редактора изображений */

function uploadPicture() {

  showImageEditor();
  hideImageEditor();
  usePictureFilter();

}


function showImageEditor() {

  document.querySelector('#upload-file').addEventListener('change', function () {

    document.querySelector('.img-upload__overlay').classList.remove('hidden');

  });

}

function hideImageEditor() {

  // Закрытие окна при клике на крестик

  document.querySelector('.img-upload__cancel').addEventListener('click', function () {

    if (!document.querySelector('.img-upload__overlay').classList.contains('hidden')) {
      document.querySelector('.img-upload__overlay').classList.add('hidden');
      document.querySelector('#upload-file').value = '';
    }

  });

  // Закрытие окна при нажатии ESC

  window.addEventListener('keydown', function (event) {

    if (event.key === 'Escape' && !document.querySelector('.img-upload__overlay').classList.contains('hidden')) {
      document.querySelector('.img-upload__overlay').classList.add('hidden');
      document.querySelector('#upload-file').value = '';
    }

  });

}

function usePictureFilter() {

  var image = document.querySelector('.img-upload__preview img');

  // Выбор фильтра по клику

  document.querySelector('.effects__list').addEventListener('click', function (event) {

    var target = event.target;
    image.filterName = 'none';

    if (target.classList.contains('effects__preview--chrome')) {
      image.style.filter = 'grayscale(1)';
      image.setAttribute('data-filter-name', 'grayscale');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    } else if (target.classList.contains('effects__preview--sepia')) {
      image.style.filter = 'sepia(1)';
      image.setAttribute('data-filter-name', 'sepia');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    } else if (target.classList.contains('effects__preview--marvin')) {
      image.style.filter = 'invert(1)';
      image.setAttribute('data-filter-name', 'invert');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    } else if (target.classList.contains('effects__preview--phobos')) {
      image.style.filter = 'blur(5px)';
      image.setAttribute('data-filter-name', 'blur');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    } else if (target.classList.contains('effects__preview--heat')) {
      image.style.filter = 'brightness(3)';
      image.setAttribute('data-filter-name', 'brightness');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    } else if (target.classList.contains('effects__preview--none')) {
      image.style.filter = 'none';
      image.setAttribute('data-filter-name', 'none');
      replacePin(document.querySelector('.effect-level__pin'), document.querySelector('.effect-level__depth'), DEFAULT_PIN_POSITION);
    }

  });

  changeFilterSaturation(image);

}

function changeFilterSaturation(image) {

  var pin = document.querySelector('.effect-level__pin');
  var depth = document.querySelector('.effect-level__depth');
  var slider = document.querySelector('.effect-level__line');

  slider.addEventListener('mouseup', function (event) {

    var saturationInfo = countFilterSaturation(image.dataset.filterName, event.pageX, slider); // Информация о насыщенности фильтра

    if (image.dataset.filterName === 'grayscale') {
      image.style.filter = 'grayscale(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    } else if (image.dataset.filterName === 'sepia') {
      image.style.filter = 'sepia(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    } else if (image.dataset.filterName === 'invert') {
      image.style.filter = 'invert(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    } else if (image.dataset.filterName === 'blur') {
      image.style.filter = 'blur(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    } else if (image.dataset.filterName === 'brightness') {
      image.style.filter = 'brightness(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    } else {
      image.style.filter = 'saturate(' + saturationInfo.value + ')';
      replacePin(pin, depth, saturationInfo.percents); // Меняем положение ползунка
    }

  });

}

function countFilterSaturation(filter, pinCoords, line) {

  var start = line.getBoundingClientRect().left;
  var finish = line.getBoundingClientRect().right;
  var lineWidth = line.clientWidth;

  switch (filter) {

    case 'blur':
      return {
        percents: (Math.floor(pinCoords - start) / lineWidth).toFixed(2) * 100 + '%',
        value: (Math.floor(pinCoords - start) / lineWidth).toFixed(2) * MAX_BLUR_SATURATION + 'px'
      };
      break;

    case 'brightness':
      return {
        percents: (Math.floor(pinCoords - start) / lineWidth).toFixed(2) * 100 + '%',
        value: (Math.floor(pinCoords - start) / lineWidth).toFixed(2) * MAX_BRIGHTNESS_SATURATION
      };
      break;

    default:
      return {
        percents: (Math.floor(pinCoords - start) / lineWidth).toFixed(2) * 100 + '%',
        value: (Math.floor(pinCoords - start) / lineWidth).toFixed(2)
      };

  }

}

function replacePin(pin, depth, percents) {

  pin.style.left = percents; // Меняем положение ползунка
  depth.style.width = percents; // Меняем размер глубины

}
