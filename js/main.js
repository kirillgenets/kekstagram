'use strict';

var SHOWN_COMMENTS_STEP = 5;
var MAX_COMMENTS_COUNT = 14;
var MAX_LIKES_COUNT = 201;
var MIN_LIKES_COUNT = 15;
var MAX_AVATAR_NUMBER = 7;
var PHOTOS_COUNT = 25;
var AVATAR_WIDTH = 35;
var AVATAR_HEIGHT = 35;

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

renderPage();

/*ФУНКЦИИ ОБЩЕГО НАЗНАЧЕНИЯ*/

function generateRandomData(source) {

  return source[generateRandomNumber(0, source.length)];

}

function generateRandomNumber(min, max) {

  return Math.floor(Math.random() * (max - min) + min);

}

function hideDOMElement(element) {

  element.classList.add('visually-hidden');

}

function getNumberOfPicture(picture) {

  return picture.dataset.number;

}

/*ОСНОВНЫЕ ФУНКЦИИ*/

function renderPage() {

  drawPictures();

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

    }

    function insertPhotosIntoDocument() {

      var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
      var pictures = document.querySelector('.pictures');
      var picturesFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

      // Формирование фрагмента

      postedPhotos.forEach(function (picture) {
        picturesFragment.appendChild(createPicture(postedPhotos.indexOf(picture)));
      });

      pictures.appendChild(picturesFragment);

      var smallPictures = document.querySelectorAll('.picture');

      smallPictures.forEach(initPicturesListeners);

      function initPicturesListeners(picture) {

        picture.addEventListener('click', onPictureClick);
        picture.addEventListener('keydown', onPictureKeyDown);

        function onPictureClick(evt) {

          drawBigPicture(getNumberOfPicture(evt.target));

        }

        function onPictureKeyDown(evt) {

          if (evt.key === 'Enter') {
            evt.preventDefault();
            drawBigPicture(getNumberOfPicture(evt.target.querySelector('.picture__img')));
          }

        }

      }

      function createPicture(numberOfPicture) {

        var pictureTemplateClone = pictureTemplate.cloneNode(true);

        // Заполнение картинки данными из объекта

        var pictureImg = pictureTemplateClone.querySelector('.picture__img');
        pictureImg.src = postedPhotos[numberOfPicture].url; // Устанавливаем картинку
        pictureImg.setAttribute('data-number', numberOfPicture);

        pictureTemplateClone.querySelector('.picture__comments').textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
        pictureTemplateClone.querySelector('.picture__likes').textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

        return pictureTemplateClone;

      }

    }

  }

  document.querySelector('#upload-file').addEventListener('change', onUploadButtonChange);

  function onUploadButtonChange() {

    drawImageEditor();

  }

}

function drawBigPicture(numberOfPicture) {

  var bigPicture = document.querySelector('.big-picture');
  var cancelButton = document.querySelector('#picture-cancel');
  var commentsContainer = document.querySelector('.social__comments');
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

      cancelButton.addEventListener('click', onBigPictureCancelClick);
      document.addEventListener('keydown', onBigPictureCancelKeyDown);

    }

    function removeBigPictureListeners() {

      cancelButton.removeEventListener('click', onBigPictureCancelClick);
      document.removeEventListener('keydown', onBigPictureCancelKeyDown);

    }

    function onBigPictureCancelClick() {

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

function drawImageEditor() {

  var image = document.querySelector('.img-upload__preview img');
  var overlay = document.querySelector('.img-upload__overlay');
  var cancelButton = document.querySelector('#upload-cancel');
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var pin = document.querySelector('.effect-level__pin');
  var filterDepth = document.querySelector('.effect-level__depth');
  var currentFilter = '';

  hideEffectLevel();
  showImageEditor();

  function showImageEditor() {

    overlay.classList.remove('hidden');
    initImageEditorListeners();

    function initImageEditorListeners() {

      cancelButton.addEventListener('click', onImageEditorCancelClick);
      document.addEventListener('keydown', onImageEditorCancelKeyDown);
      document.querySelector('.effects__list').addEventListener('focus', onFilterFocus, true);

    }

    function onFilterFocus(evt) {

      clearFilter();
      useFilter(evt.target.value);

    }

    function onImageEditorCancelClick() {

      hideImageEditor();
      cancelButton.removeEventListener('click', onImageEditorCancelClick);

    }

    function onImageEditorCancelKeyDown(evt) {

      if (evt.key === 'Escape') {
        evt.preventDefault();
        hideImageEditor();
        document.removeEventListener('keydown', onImageEditorCancelKeyDown);
      }

    }

    function clearFilter() {

      image.classList.remove('effects__preview--' + currentFilter.effectName);
      image.style.filter = '';

    }

    function hideImageEditor() {

      overlay.classList.add('hidden');
      document.querySelector('#upload-file').value = '';
      clearFilter();

    }

    function useFilter(filter) {

      currentFilter = filters[filter];
      setPinStartPosition();

      if (currentFilter.effectName === 'none') {
        hideEffectLevel();
      } else {
        showEffectLevel();
      }

      image.className = 'effects__preview--' + currentFilter.effectName;

      function setPinStartPosition() {

        pin.style.left = '100%';
        filterDepth.style.width = '100%';

      }

    }

  }

  function hideEffectLevel() {

    effectLevel.classList.add('hidden');

  }

  function showEffectLevel() {

    effectLevel.classList.remove('hidden');

  }

}
