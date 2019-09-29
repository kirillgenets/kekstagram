'use strict';

(function () {

  var SHOWN_COMMENTS_STEP = 5;
  var AVATAR_WIDTH = 35;
  var AVATAR_HEIGHT = 35;

  var bigPicture = document.querySelector('.big-picture');
  var cancelButton = bigPicture.querySelector('#picture-cancel');
  var commentsContainer = bigPicture.querySelector('.social__comments');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var shownCommentsCount = commentsCount.previousSibling;
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var startIndexOfComment = 0;

  window.drawBigPicture = drawBigPicture;

  function drawBigPicture(numberOfPicture) {
    createBigPicture();
    clearComments();
    renderComments();
    showBigPicture();

    function createBigPicture() {
      bigPicture.querySelector('.big-picture__img img').src = window.data[numberOfPicture].url;
      bigPicture.querySelector('.social__caption').textContent = window.data[numberOfPicture].description;
      bigPicture.querySelector('.likes-count').textContent = window.data[numberOfPicture].likes;
      commentsCount.textContent = window.data[numberOfPicture].comments.length;
    }

    function clearComments() {
      commentsContainer.innerHTML = '';
    }

    function renderComments() {
      var comments = window.data[numberOfPicture].comments;
      var endIndexOfComment = startIndexOfComment + SHOWN_COMMENTS_STEP;
      var commentsFragment = document.createDocumentFragment();

      if (endIndexOfComment > comments.length) {
        endIndexOfComment = comments.length;
      }

      comments.slice(startIndexOfComment, endIndexOfComment).forEach(createComment);
      commentsContainer.appendChild(commentsFragment);
      shownCommentsCount.textContent = endIndexOfComment + ' из ';

      if (shownCommentsCount.textContent === commentsCount.textContent + ' из ') {
        commentsLoader.classList.add('hidden');
      }

      startIndexOfComment = endIndexOfComment;

      function createComment(commentObj) {
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
      bigPicture.classList.remove('hidden');
      initBigPictureListeners();

      function initBigPictureListeners() {
        cancelButton.addEventListener('click', onBigPictureCancelButtonClick);
        document.addEventListener('keydown', onBigPictureCancelKeyDown);
        commentsLoader.addEventListener('click', onCommentsLoaderClick);
      }

      function removeBigPictureListeners() {
        cancelButton.removeEventListener('click', onBigPictureCancelButtonClick);
        document.removeEventListener('keydown', onBigPictureCancelKeyDown);
        commentsLoader.removeEventListener('click', onCommentsLoaderClick);
      }

      function onCommentsLoaderClick() {
        renderComments();
      }

      function onBigPictureCancelButtonClick() {
        hideBigPicture();
        removeBigPictureListeners();
      }

      function onBigPictureCancelKeyDown(evt) {
        if (window.utilities.isEscEvent(evt)) {
          evt.preventDefault();
          hideBigPicture();
          removeBigPictureListeners();
        }
      }
    }

    function hideBigPicture() {
      bigPicture.classList.add('hidden');
      commentsLoader.classList.remove('hidden');
      startIndexOfComment = 0;
    }

  }

})();
