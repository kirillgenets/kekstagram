'use strict';

var SHOWN_COMMENTS_STEP = 5;
var MAX_COMMENTS_COUNT = 14;
var MAX_LIKES_COUNT = 201;
var MIN_LIKES_COUNT = 15;
var MAX_AVATAR_NUMBER = 7;
var PHOTOS_COUNT = 25;
var AVATAR_WIDTH = 35;
var AVATAR_HEIGHT = 35;
var MAX_FILTER_VALUE = 100;
var MAX_HASHTAGS_NUMBER = 5;
var MAX_HASHTAG_LENGTH = 20;

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
    maxLevel: 1,
    measure: ''
  },
  sepia: {
    effectName: 'sepia',
    filterName: 'sepia',
    minLevel: 0,
    maxLevel: 1,
    measure: ''
  },
  marvin: {
    effectName: 'marvin',
    filterName: 'invert',
    minLevel: 0,
    maxLevel: 100,
    measure: '%'
  },
  phobos: {
    effectName: 'phobos',
    filterName: 'blur',
    minLevel: 0,
    maxLevel: 3,
    measure: 'px'
  },
  heat: {
    effectName: 'heat',
    filterName: 'brightness',
    minLevel: 1,
    maxLevel: 3,
    measure: ''
  },
  none: {
    effectName: 'none',
    filterName: 'none',
    minLevel: null,
    maxLevel: null,
    measure: ''
  },

};

var postedPhotos = [];

renderPage();

/* ФУНКЦИИ ОБЩЕГО НАЗНАЧЕНИЯ */

function generateRandomData(source) {

  return source[generateRandomNumber(0, source.length)];

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
      message: generateRandomData(messagesList), // Берем рандомный комментарий из массива комментариев
      name: generateRandomData(peopleNames) // Берем рандомное имя из массива имён
    });

  }

  return commentsList;

}


function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}

function getNumberOfPicture(picture) {

  return picture.dataset.number;

}

/* ОСНОВНЫЕ ФУНКЦИИ */

function renderPage() {

  drawPictures();
  openImageEditor();

  function drawPictures() {

    makePhotosArray();
    insertPhotosIntoDocument();

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

          drawBigPicture(getNumberOfPicture(evt.currentTarget));

        }

        function onPictureKeyDown(evt) {

          if (evt.key === 'Enter') {
            evt.preventDefault();
            drawBigPicture(getNumberOfPicture(evt.currentTarget));
          }

        }

      }

    }

  }

}

function drawBigPicture(numberOfPicture) {

  var bigPicture = document.querySelector('.big-picture');
  var cancelButton = bigPicture.querySelector('#picture-cancel');
  var commentsContainer = bigPicture.querySelector('.social__comments');
  var startIndexOfComment = 0;

  createBigPicture();
  clearComments();
  renderComments();
  showBigPicture();
  hideBigPictureExtraElements();

  function createBigPicture() {

    // Заполнение большого изображения нужными данными

    bigPicture.querySelector('.big-picture__img img').src = postedPhotos[numberOfPicture].url;
    bigPicture.querySelector('.social__caption').textContent = postedPhotos[numberOfPicture].description;
    bigPicture.querySelector('.likes-count').textContent = postedPhotos[numberOfPicture].likes;
    bigPicture.querySelector('.comments-count').textContent = postedPhotos[numberOfPicture].comments.length;

  }

  function clearComments() {

    commentsContainer.innerHTML = '';

  }

  function renderComments() {

    var comments = postedPhotos[numberOfPicture].comments;
    var endIndexOfComment = startIndexOfComment + SHOWN_COMMENTS_STEP;
    var commentsFragment = document.createDocumentFragment();

    if (endIndexOfComment > comments.length) {
      endIndexOfComment = comments.length;
    }

    comments.slice(startIndexOfComment, endIndexOfComment).forEach(createComment);
    commentsContainer.appendChild(commentsFragment);
    startIndexOfComment = endIndexOfComment;

    function createComment(commentObj) {

      // Формирование контейнера комментария

      var comment = document.createElement('li');
      comment.className = 'social__comment';

      comment.appendChild(renderAvatar());
      comment.appendChild(renderCommentMessage());

      commentsFragment.appendChild(comment);

      function renderAvatar() {

        var avatarImage = document.createElement('img');
        avatarImage.className = 'social__picture';
        avatarImage.src = commentObj.avatar;
        avatarImage.alt = 'Аватар комментатора фотографии';
        avatarImage.width = AVATAR_WIDTH;
        avatarImage.height = AVATAR_HEIGHT;

        return avatarImage;

      }

      function renderCommentMessage() {

        var commentMessage = document.createElement('p');
        commentMessage.className = 'social__text';
        commentMessage.textContent = commentObj.message;

        return commentMessage;

      }

    }

  }

  function showBigPicture() {

    bigPicture.classList.remove('hidden'); // Показываем большое изображение
    initBigPictureListeners();

    function initBigPictureListeners() {

      cancelButton.addEventListener('click', onBigPictureCancelButtonClick);
      document.addEventListener('keydown', onBigPictureCancelKeyDown);

    }

    function removeBigPictureListeners() {

      cancelButton.removeEventListener('click', onBigPictureCancelButtonClick);
      document.removeEventListener('keydown', onBigPictureCancelKeyDown);

    }

    function onBigPictureCancelButtonClick() {

      hideBigPicture();
      removeBigPictureListeners();

    }

    function onBigPictureCancelKeyDown(evt) {

      if (evt.key === 'Escape') {
        evt.preventDefault();
        hideBigPicture();
        removeBigPictureListeners();
      }

    }

  }

  function hideBigPictureExtraElements() {

    hideDOMElement(document.querySelector('.social__comment-count'));
    hideDOMElement(document.querySelector('.comments-loader'));

  }

  function hideBigPicture() {

    bigPicture.classList.add('hidden');

  }

}

function openImageEditor() {

  var form = document.querySelector('.img-upload__form');
  var uploadButton = form.querySelector('#upload-file');
  var hashTagInput = form.querySelector('.text__hashtags');
  var imageEditor = form.querySelector('.img-upload__overlay');
  var image = imageEditor.querySelector('.img-upload__preview img');
  var cancelButton = imageEditor.querySelector('#upload-cancel');
  var effectsList = imageEditor.querySelector('.effects__list');
  var effectLevel = imageEditor.querySelector('.img-upload__effect-level');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var pin = effectLevelLine.querySelector('.effect-level__pin');
  var filterDepth = effectLevelLine.querySelector('.effect-level__depth');

  var currentFilter = {};

  uploadButton.addEventListener('change', onUploadButtonChange);

  function onUploadButtonChange() {

    imageEditor.classList.remove('hidden');
    hideEffectLevel();
    initFormListeners();

  }

  function initFormListeners() {

    document.addEventListener('keydown', onImageEditorCancelKeyDown);
    cancelButton.addEventListener('click', onImageEditorCancelButtonClick);
    effectsList.addEventListener('focus', onFilterFocus, true);
    pin.addEventListener('mousedown', onPinMouseDown);
    form.addEventListener('submit', onFormSubmit);
    hashTagInput.addEventListener('change', onHashTagInputChange);


    pin.ondragstart = function () {

      return false;

    };

  }

  // Работа с формой

  function onFormSubmit(evt) {

    evt.preventDefault();

  }

  function onHashTagInputChange() {

    console.log(getHashTagValidationErrors());

  }

  function getHashTagValidationErrors() {

    var errorText = '';

    var errors = {
      noHash: false,
      oneSymbol: false,
      separator: false,
      longHashTag: false,
      sameHashTag: false,
      overageHashTags: false,
    };

    var errorMessages = {
      noHash: 'Хэш-тег должен начинаться с символа "#"',
      oneSymbol: 'Хэш-тег должен содержать текст после символа "#"',
      separator: 'Хэш-теги должны разделяться пробелами',
      longHashTag: 'Хэш-тег не может быть длиннее ' + MAX_HASHTAG_LENGTH + ' символов',
      sameHashTag: 'Хэш-теги не могут повторяться',
      overageHashTags: 'Нельзя добавить более ' + MAX_HASHTAGS_NUMBER + ' хэш-тегов',
    };

    var hashTags = getHashTagsArray();

    hashTags.forEach(getSingleValidationErrors);

    errors.sameHashTag = errors.sameHashTag || getSameHashTags().length > 0;

    for (var key in errors) {

      if (errors[key] === true) {
        errorText += errorMessages[key] + ' ';
      }

    }

    return errorText;

    function getSingleValidationErrors(hashTag) {

      errors.noHash = errors.noHash || (hashTag[0] !== '#');
      errors.oneSymbol = errors.oneSymbol || (hashTag[0] === '#' && (hashTag.length === 1));
      errors.separator = errors.separator || (hashTag.includes('#', 1));
      errors.longHashTag = errors.longHashTag || (hashTag.length > MAX_HASHTAG_LENGTH);

    }

    function getSameHashTags() {

      var hashTagsCopy = Object.assign(hashTags);

      return hashTags.filter(function (hashTag) {

        hashTagsCopy.splice(hashTagsCopy.indexOf(hashTag), 1);

        return hashTagsCopy.indexOf(hashTag) !== -1;

      });

    }

  }

  function getHashTagsArray() {

    return hashTagInput.value.split(' ');

  }

  // Работа с эффектами

  function onFilterFocus(evt) {

    clearFilter();
    useFilter(evt.target.value);

  }

  function onImageEditorCancelButtonClick() {

    hideImageEditor();

  }

  function onImageEditorCancelKeyDown(evt) {

    if (evt.key === 'Escape') {
      evt.preventDefault();
      hideImageEditor();
    }

  }

  function onPinMouseDown(downEvt) {

    downEvt.preventDefault();

    var effectLevelLineLeftCoord = getLeftCoord(effectLevelLine);

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);

    function onPinMouseMove(moveEvt) {

      setFilterValues(moveEvt);

    }

    function onPinMouseUp(upEvt) {

      setFilterValues(upEvt);

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);

    }

    function setFilterValues(evt) {

      var pinLeft = evt.pageX - effectLevelLineLeftCoord;
      var maxLeft = effectLevelLine.offsetWidth;

      if (pinLeft < 0) {
        pinLeft = 0;
      }

      if (pinLeft > maxLeft) {
        pinLeft = maxLeft;
      }

      var filterValue = pinLeft * 100 / maxLeft;
      var depth = currentFilter.minLevel + filterValue * (currentFilter.maxLevel - currentFilter.minLevel) / 100 + currentFilter.measure;

      pin.style.left = filterValue + '%';
      filterDepth.style.width = filterValue + '%';
      effectLevelInput.setAttribute('value', filterValue);

      image.style.filter = currentFilter.filterName + '(' + depth + ')';

    }

  }

  function getLeftCoord(element) {

    var box = element.getBoundingClientRect();

    return box.left + pageXOffset;

  }

  function clearFilter() {

    image.classList.remove('effects__preview--' + currentFilter.effectName);
    image.style.filter = '';
    effectLevelInput.removeAttribute('value');

  }

  function hideImageEditor() {

    imageEditor.classList.add('hidden');
    uploadButton.value = '';
    clearFilter();

    effectsList.removeEventListener('focus', onFilterFocus, true);
    pin.removeEventListener('mousedown', onPinMouseDown);
    cancelButton.removeEventListener('click', onImageEditorCancelButtonClick);
    document.removeEventListener('keydown', onImageEditorCancelKeyDown);

  }

  function useFilter(filter) {

    var maxLeft = effectLevelLine.offsetWidth;

    currentFilter = filters[filter];

    if (currentFilter.effectName === 'none') {
      hideEffectLevel();
    } else {
      showEffectLevel();
    }

    image.className = 'effects__preview--' + currentFilter.effectName;
    image.style.filter = currentFilter.filterName + '(' + currentFilter.maxLevel + currentFilter.measure + ')';
    pin.style.left = maxLeft + 'px';
    filterDepth.style.width = maxLeft + 'px';
    effectLevelInput.setAttribute('value', MAX_FILTER_VALUE);

  }

  function hideEffectLevel() {

    effectLevel.classList.add('visually-hidden');

  }

  function showEffectLevel() {

    effectLevel.classList.remove('visually-hidden');

  }

}
