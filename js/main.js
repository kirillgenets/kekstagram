'use strict';

var SHOWN_COMMENTS_STEP = 5;
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

var filters = {

  chrome: {
    effectName: 'chrome',
    filterName: 'grayscale',
    minLevel: 0,
    maxLefel: 1,
    measure: ''
  },
  sepia: {
    effectName: 'sepia',
    filterName: 'sepia',
    minLevel: 0,
    maxLefel: 1,
    measure: ''
  },
  marvin: {
    effectName: 'marvin',
    filterName: 'invert',
    minLevel: 0,
    maxLefel: 100,
    measure: '%'
  },
  phobos: {
    effectName: 'phobos',
    filterName: 'blur',
    minLevel: 0,
    maxLefel: 3,
    measure: 'px'
  },
  heat: {
    effectName: 'heat',
    filterName: 'brightness',
    minLevel: 1,
    maxLefel: 3,
    measure: ''
  },
  none: {
    effectName: 'none',
    filterName: 'none',
    minLevel: null,
    maxLefel: null,
    measure: ''
  },

}

var postedPhotos = [];

showPage();
uploadPicture();

/* Функции для показа изображений */

function showPage() {

  drawPictures();
  initStartListeners();

}

function drawPictures() {

  makePhotosArray();
  insertPhotosIntoDocument();

}

function generateRandomComments() {

  var commentsCount = generateRandomNumber(1, MAX_COMMENTS_COUNT);
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

  postedPhotos.forEach(function (picture, i) {
    photosListFragment.appendChild(createPicture(pictureTemplate, i));
  });

  photosList.appendChild(photosListFragment);

}

function createPicture(template, numberOfPicture) {

  var pictureTemplateClone = template.cloneNode(true);

  // Заполнение картинки данными из объекта

  var pictureImg = pictureTemplateClone.querySelector('.picture__img');
  pictureImg.src = postedPhotos[numberOfPicture].url; // Устанавливаем картинку
  pictureImg.setAttribute('data-number', numberOfPicture);

  pictureTemplateClone.querySelector('.picture__comments').textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
  pictureTemplateClone.querySelector('.picture__likes').textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

  return pictureTemplateClone;

}

/* Функции для работы с большим изображением */

function getNumberOfPicture(picture) {

  return picture.dataset.number;

}

function showBigPicture(picture) {

  document.querySelector('.big-picture').classList.remove('hidden'); // Показываем большое изображение
  initBigPictureListeners();

}

function hideBigPictureExtraElements() {

  hideDOMElement(document.querySelector('.social__comment-count'));
  hideDOMElement(document.querySelector('.comments-loader'));

}

function hideBigPicture() {

  document.querySelector('.big-picture').classList.add('hidden');

}

function createBigPicture(numberOfPicture) {

  var bigPicture = document.querySelector('.big-picture');

  // Заполнение большого изображения нужными данными

  bigPicture.querySelector('.big-picture__img img').src = postedPhotos[numberOfPicture].url;
  bigPicture.querySelector('.social__caption').textContent = postedPhotos[numberOfPicture].description;
  bigPicture.querySelector('.likes-count').textContent = postedPhotos[numberOfPicture].likes;
  bigPicture.querySelector('.comments-count').textContent = postedPhotos[numberOfPicture].comments.length;

}

function clearComments() {

  var commentsContainer = document.querySelector('.social__comments');
  commentsContainer.innerHTML = '';

}

function createComment(commentObj) {

  // Формирование контейнера комментария

  var comment = document.createElement('li');
  comment.className = 'social__comment';

  // Формирование аватарки комментария

  var avatarImage = document.createElement('img');
  avatarImage.className = 'social__picture';
  avatarImage.src = commentObj.avatar;
  avatarImage.alt = 'Аватар комментатора фотографии';
  avatarImage.width = 35;
  avatarImage.height = 35;
  comment.appendChild(avatarImage);

  // Формирование сообщения комментария

  var commentMessage = document.createElement('p');
  commentMessage.className = 'social__text';
  commentMessage.textContent = commentObj.message;
  comment.appendChild(commentMessage);

  this.appendChild(comment);

}

function showComments(numberOfPicture) {

  var commentsContainer = document.querySelector('.social__comments');
  var comments = postedPhotos[numberOfPicture].comments;
  var endIndexOfComment = startIndexOfComment + SHOWN_COMMENTS_STEP;

  if (endIndexOfComment > comments.length) {
    endIndexOfComment = comments.length;
  }

  var commentsFragment = document.createDocumentFragment();

  comments.slice(startIndexOfComment, endIndexOfComment).forEach(createComment, commentsFragment);
  commentsContainer.appendChild(commentsFragment);
  startIndexOfComment = endIndexOfComment;

}

function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}

/* Функции для редактора изображений */

function uploadPicture() {

  usePictureFilter();

}

function showImageEditor() {

  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  initImageEditorListeners();

}

function hideImageEditor() {

  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('#upload-file').value = '';

}

function usePictureFilter() {

  var image = document.querySelector('.img-upload__preview img');

  // Выбор фильтра по клику

  document.querySelector('.effects__list').addEventListener('click', function (event) {

    var target = event.target;
    image.filterName = 'none';

    useFilter(image, target);

  });

}

function useFilter(pic, target) {

  if (target.classList.contains('effects__preview')) {
    pic.className = getFilterClassName(target);
  }

}

function getFilterClassName(filterElement) {

  var filterName = filters.filter(function (filterObject) {

    return filterElement.classList.contains('effects__preview--' + filterObject.name);

  })[0].name;

  return 'effects__preview--' + filterName;

}

/* ИНИЦИАТОРЫ ОБРАБОТЧИКОВ */

function initStartListeners() {

  var pictures = document.querySelector('.pictures');
  pictures.addEventListener('click', onPictureClick);
  pictures.addEventListener('keydown', onPictureKeyDown);
  document.querySelector('#upload-file').addEventListener('change', onUploadButtonChange);

}

function removeStartListeners() {

  var pictures = document.querySelector('.pictures');
  pictures.removeEventListener('click', onPictureClick);
  pictures.removeEventListener('keydown', onPictureKeyDown);
  document.querySelector('#upload-file').removeEventListener('change', onUploadButtonChange);

}

function initImageEditorListeners() {

  document.querySelector('#upload-cancel').addEventListener('click', onImageEditorCancelClick);
  document.addEventListener('keydown', onImageEditorCancelKeyDown);

}

function removeImageEditorListeners() {

  document.querySelector('#upload-cancel').removeEventListener('click', onImageEditorCancelClick);
  document.removeEventListener('keydown', onImageEditorCancelKeyDown);

}

function initBigPictureListeners() {

  document.querySelector('#picture-cancel').addEventListener('click', onBigPictureCancelClick);
  document.addEventListener('keydown', onBigPictureCancelKeyDown);

}

function removeBigPictureListeners() {

  document.querySelector('#picture-cancel').removeEventListener('click', onBigPictureCancelClick);
  document.removeEventListener('keydown', onBigPictureCancelKeyDown);

}

/* ОБРАБОТЧИКИ */

function onPictureClick(evt) {

  var target = evt.target;

  if (target.className === 'picture__img') {
    createBigPicture(getNumberOfPicture(target));
    clearComments();
    showComments(getNumberOfPicture(target));
    showBigPicture(target);
    hideBigPictureExtraElements();
  }

}

function onPictureKeyDown(evt) {

  var target = evt.target;

  if (evt.key === 'Enter' && target.className === 'picture') {
    createBigPicture(getNumberOfPicture(target.querySelector('.picture__img')));
    clearComments();
    showComments(getNumberOfPicture(target.querySelector('.picture__img')));
    showBigPicture(target.querySelector('.picture__img'));
    hideBigPictureExtraElements();
  }

}

function onUploadButtonChange() {

  showImageEditor();

}

function onImageEditorCancelClick() {

  hideImageEditor();
  removeImageEditorListeners();

}

function onImageEditorCancelKeyDown(evt) {

  if (evt.key === 'Escape') {
    hideImageEditor();
    removeImageEditorListeners();
  }

}

function onBigPictureCancelClick() {

  hideBigPicture();
  removeBigPictureListeners();

}

function onBigPictureCancelKeyDown(evt) {

  if (evt.key === 'Escape') {
    hideBigPicture();
    removeBigPictureListeners();
  }

}
