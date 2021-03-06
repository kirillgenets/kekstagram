'use strict';

(function () {

  var MAX_FILTER_VALUE = 100;
  var MAX_HASHTAGS_NUMBER = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MODAL_Z_INDEX = 3;
  var AVAILABLE_IMAGE_FORMATS = ['jpg', 'jp2', 'jpeg', 'gif', 'png'];
  var WRONG_FILE_TYPE_ERROR_MESSAGE = 'Я умею загружать только изображения!';
  var MAX_SCALE_VALUE = 100;
  var MIN_SCALE_VALUE = 25;
  var CHANGE_SCALE_VALUE_STEP = 25;

  var FILTERS = {
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
    }
  };

  var main = document.body.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var form = document.querySelector('.img-upload__form');
  var uploadButton = form.querySelector('#upload-file');
  var hashTagInput = form.querySelector('.text__hashtags');
  var descriptionInput = form.querySelector('.text__description');
  var imageEditor = form.querySelector('.img-upload__overlay');
  var scaleButtonSmaller = imageEditor.querySelector('.scale__control--smaller');
  var scaleButtonBigger = imageEditor.querySelector('.scale__control--bigger');
  var scaleValueInput = imageEditor.querySelector('.scale__control--value');
  var imageContainer = imageEditor.querySelector('.img-upload__preview');
  var image = imageContainer.querySelector('img');
  var cancelButton = imageEditor.querySelector('#upload-cancel');
  var effectsList = imageEditor.querySelector('.effects__list');
  var effectLevel = imageEditor.querySelector('.img-upload__effect-level');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var pin = effectLevelLine.querySelector('.effect-level__pin');
  var filterDepth = effectLevelLine.querySelector('.effect-level__depth');

  var currentScale = MAX_SCALE_VALUE;
  var currentFilter = {};

  uploadButton.addEventListener('change', onUploadButtonChange);

  function onUploadButtonChange() {
    var file = uploadButton.files[0];
    var fileName = file.name.toLowerCase();

    var isMatches = AVAILABLE_IMAGE_FORMATS.some(function (format) {
      return fileName.endsWith(format);
    });

    if (isMatches) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        image.src = fileReader.result;
        showImageEditor();
      });

      fileReader.readAsDataURL(file);
    } else {
      onError(WRONG_FILE_TYPE_ERROR_MESSAGE);
    }
  }

  function showImageEditor() {
    imageEditor.classList.remove('hidden');
    changeImageScale(MAX_SCALE_VALUE);
    hideEffectLevel();
    initFormListeners();
  }

  function initFormListeners() {
    document.addEventListener('keydown', onImageEditorCancelKeyDown);
    cancelButton.addEventListener('click', onImageEditorCancelButtonClick);
    scaleButtonSmaller.addEventListener('click', onScaleButtonSmallerClick);
    scaleButtonBigger.addEventListener('click', onScaleButtonBiggerClick);
    effectsList.addEventListener('focus', onFilterFocus, true);
    pin.addEventListener('mousedown', onPinMouseDown);
    hashTagInput.addEventListener('change', onHashTagInputChange);
    form.addEventListener('submit', onFormSubmit);

    pin.ondragstart = function () {
      return false;
    };
  }

  function onScaleButtonSmallerClick() {
    if (currentScale > MIN_SCALE_VALUE) {
      currentScale -= CHANGE_SCALE_VALUE_STEP;
      changeImageScale(currentScale);
    }
  }

  function onScaleButtonBiggerClick() {
    if (currentScale < MAX_SCALE_VALUE) {
      currentScale += CHANGE_SCALE_VALUE_STEP;
      changeImageScale(currentScale);
    }
  }

  function changeImageScale(value) {
    scaleValueInput.value = value + '%';
    imageContainer.style.transform = 'scale(' + value / MAX_SCALE_VALUE + ')';
  }

  function onFormSubmit(submitEvt) {
    submitEvt.preventDefault();

    var formData = new FormData(form);

    window.backend.sendData(formData, onLoad, onError);

    function onLoad() {
      var successModal = successTemplate.cloneNode(true);

      main.appendChild(successModal);

      document.addEventListener('keydown', onSuccessKeyDown);
      successModal.addEventListener('click', onSuccessModalClick);

      hideImageEditor();
      form.reset();

      function onSuccessKeyDown(downEvt) {
        window.utilities.isEscEvent(downEvt, function (evt) {
          evt.preventDefault();
          closeSuccessModal();
        });
      }

      function onSuccessModalClick() {
        closeSuccessModal();
      }

      function closeSuccessModal() {
        document.removeEventListener('keydown', onSuccessKeyDown);
        successModal.removeEventListener('click', onSuccessModalClick);
        main.removeChild(successModal);
      }
    }
  }

  function onError(errorMessage) {
    var errorModal = errorTemplate.cloneNode(true);
    var errorTitle = errorModal.querySelector('.error__title');
    var tryAgainButton = errorModal.querySelector('.error__button:first-child');

    errorModal.style.zIndex = MODAL_Z_INDEX;
    errorTitle.textContent = errorMessage;

    if (errorMessage === WRONG_FILE_TYPE_ERROR_MESSAGE) {
      tryAgainButton.classList.add('hidden');
    } else {
      tryAgainButton.addEventListener('click', onTryAgainButtonClick);
    }

    main.appendChild(errorModal);

    document.addEventListener('keydown', onErrorKeyDown);
    errorModal.addEventListener('click', onErrorModalClick);

    function onTryAgainButtonClick() {
      closeErrorModal();
    }

    function onErrorKeyDown(downEvt) {
      window.utilities.isEscEvent(downEvt, function (evt) {
        evt.preventDefault();
        hideImageEditor();
        closeErrorModal();
      });
    }

    function onErrorModalClick() {
      hideImageEditor();
      closeErrorModal();
    }

    function closeErrorModal() {
      document.removeEventListener('keydown', onErrorKeyDown);
      errorModal.removeEventListener('click', onErrorModalClick);
      tryAgainButton.removeEventListener('click', onTryAgainButtonClick);
      main.removeChild(errorModal);
    }
  }

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

    errors.sameHashTag = errors.sameHashTag || getSameHashTagsError();
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

    function getSameHashTagsError() {
      var hashTagsSet = [];

      hashTags.forEach(function (hashTag) {
        var lowerCaseHashTag = hashTag.toLowerCase();
        if (!hashTagsSet.includes(lowerCaseHashTag)) {
          hashTagsSet.push(lowerCaseHashTag);
        }
      });

      return hashTagsSet.length !== hashTags.length;
    }
  }

  function getHashTagsArray() {
    var hashTagsString = hashTagInput.value;

    return hashTagsString.split(' ').filter(function (hashTag) {
      return hashTag.length > 0;
    });
  }

  function onFilterFocus(evt) {
    clearFilter();
    useFilter(evt.target.value);
  }

  function onImageEditorCancelButtonClick() {
    hideImageEditor();
  }

  function onImageEditorCancelKeyDown(downEvt) {
    window.utilities.isEscEvent(downEvt, function (evt) {
      evt.preventDefault();

      if (hashTagInput !== document.activeElement && descriptionInput !== document.activeElement) {
        hideImageEditor();
      }
    });
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
    clearForm();
    removeImageEditorListeners();
  }

  function clearForm() {
    hashTagInput.setCustomValidity('');
    hashTagInput.value = '';
    hashTagInput.style.borderColor = '';
    descriptionInput.value = '';
  }

  function removeImageEditorListeners() {
    effectsList.removeEventListener('focus', onFilterFocus, true);
    pin.removeEventListener('mousedown', onPinMouseDown);
    cancelButton.removeEventListener('click', onImageEditorCancelButtonClick);
    document.removeEventListener('keydown', onImageEditorCancelKeyDown);
    scaleButtonSmaller.removeEventListener('click', onScaleButtonSmallerClick);
    scaleButtonBigger.removeEventListener('click', onScaleButtonBiggerClick);
    hashTagInput.removeEventListener('change', onHashTagInputChange);
    form.removeEventListener('submit', onFormSubmit);
  }

  function useFilter(filter) {
    var maxLeft = effectLevelLine.offsetWidth;

    currentFilter = FILTERS[filter];

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
