'use strict';

(function () {

  var MAX_FILTER_VALUE = 100;
  var MAX_HASHTAGS_NUMBER = 5;
  var MAX_HASHTAG_LENGTH = 20;

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

  var form = document.querySelector('.img-upload__form');
  var uploadButton = form.querySelector('#upload-file');
  var hashTagInput = form.querySelector('.text__hashtags');
  var descriptionInput = form.querySelector('.text__description');
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
    hashTagInput.addEventListener('change', onHashTagInputChange);


    pin.ondragstart = function () {

      return false;

    };

  }

  // Работа с формой

  function onHashTagInputChange() {

    var inputErrors = getHashTagValidationErrors();

    hashTagInput.setCustomValidity(inputErrors);

    hashTagInput.style.borderColor = inputErrors ? 'red' : '';

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

    var errorToMessage = {
      noHash: 'Хэш-тег должен начинаться с символа "#"',
      oneSymbol: 'Хэш-тег должен содержать текст после символа "#"',
      separator: 'Хэш-теги должны разделяться пробелами',
      longHashTag: 'Хэш-тег не может быть длиннее ' + MAX_HASHTAG_LENGTH + ' символов',
      sameHashTag: 'Хэш-теги не могут повторяться',
      overageHashTags: 'Нельзя добавить более ' + MAX_HASHTAGS_NUMBER + ' хэш-тегов',
    };

    var hashTags = getHashTagsArray();

    hashTags.forEach(getSingleValidationErrors);

    errors.sameHashTag = errors.sameHashTag || (getSameHashTags().length > 0);
    errors.overageHashTags = errors.overageHashTags || (hashTags.length > MAX_HASHTAGS_NUMBER);

    for (var key in errors) {

      if (errors[key]) {
        errorText += errorToMessage[key] + ' ';
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

      var hashTagsCopy = Object.create(hashTags);
      var lowerCaseHashTagsArray = hashTagsCopy.map(function (hashTag) {

        return hashTag.toLowerCase();

      });

      var sameHashTagsArray = lowerCaseHashTagsArray.filter(function (hashTag) {

        hashTagsCopy.splice(lowerCaseHashTagsArray.indexOf(hashTag), 1);

        return lowerCaseHashTagsArray.indexOf(hashTag) !== -1;

      });

      return sameHashTagsArray;

    }

  }

  function getHashTagsArray() {

    var hashTagsString = hashTagInput.value;

    return hashTagsString.split(' ').filter(function (hashTag) {
      return hashTag.length > 0;
    });

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

    if (window.utilities.isEscEvent(evt)) {
      evt.preventDefault();

      if (hashTagInput !== document.activeElement && descriptionInput !== document.activeElement) {

        hideImageEditor();

      }

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

    hashTagInput.setCustomValidity('');
    hashTagInput.value = '';
    hashTagInput.style.borderColor = '';
    descriptionInput.value = '';

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

})();
