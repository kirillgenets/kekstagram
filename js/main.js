'use strict'

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

var postedPhotos = [];

insertPhotosIntoDocument();

showBigPicture(0);

/* Функции */

function generateRandomComments() {

	var commentsCount = Math.floor(Math.random() * (7 - 1) + 1);
	var commentsList = [];

	for (var i = 0; i < commentsCount; i++) {

		commentsList.push({
			avatar: 'img/avatar-' + Math.floor(Math.random() * (7 - 1) + 1) + '.svg',
			message: messagesList[Math.floor(Math.random() * messagesList.length)], // Берем рандомный комментарий из массива комментариев
			name: peopleNames[Math.floor(Math.random() * peopleNames.length)] // Берем рандомное имя из массива имён
		});

	}

	return commentsList;

}

function makePhotosArray() {

	for (var i = 0; i < 25; i++) {

		postedPhotos.push({
			url: 'photos/' + (i + 1) + '.jpg',
			likes: Math.floor(Math.random() * (200 - 15) + 15),
			comments: generateRandomComments()
		});

	}

}

function insertPhotosIntoDocument() {

	makePhotosArray();

	var photosList = document.querySelector('.pictures');
	var photosListFragment = document.createDocumentFragment(); // Создаем фрагмент для вставки

	// Формирование фрагмента 

	for (var i = 0; i < postedPhotos.length; i++) {
		var pictureTemplate = document.querySelector('#picture');
		var picture = pictureTemplate.content.querySelector('.picture__img');
		var commentsCount = pictureTemplate.content.querySelector('.picture__comments');
		var likesCount = pictureTemplate.content.querySelector('.picture__likes');

		picture.setAttribute('src', postedPhotos[i].url); // Устанавливаем картинку
		commentsCount.textContent = postedPhotos[i].comments.length; // Устанавливаем количество комментариев
		likesCount.textContent = postedPhotos[i].likes; // Устанавливаем количество лайков

		var pictureForDocument = document.importNode(pictureTemplate.content, true);

		photosListFragment.appendChild(pictureForDocument); // Вставляем фрагмент в документ
	}

	photosList.appendChild(photosListFragment);

}

function showBigPicture(numberOfPicture) {

	var bigPicture = document.querySelector('.big-picture'); // Показываем большое изображение
	bigPicture.classList.remove('hidden');

	var bigPictureImg = bigPicture.querySelector('.big-picture__img img'); // Устанавливаем картинку
	bigPictureImg.setAttribute('src', postedPhotos[numberOfPicture].url);

	var likesCounter = bigPicture.querySelector('.likes-count'); // Устанавливаем количество лайков
	likesCounter.textContent = postedPhotos[numberOfPicture].likes;

	var commentsCounter = bigPicture.querySelector('.comments-count'); // Устанавливаем количество комментариев
	commentsCounter.textContent = postedPhotos[numberOfPicture].comments.length;

	// Загрузка комментариев

	var commentsContainer = bigPicture.querySelector('.social__comments');
	commentsContainer.innerHTML = ''; // Очищаем стандартные комментарии, чтобы добавить новые

	// Вставка новых комментариев

	for (var i = 0; i < postedPhotos[numberOfPicture].comments.length; i++) {
		var commentHTML = '';
		commentHTML += '<li class="social__comment"><img class="social__picture" src="';
		commentHTML +=  postedPhotos[numberOfPicture].comments[i].avatar;
		commentHTML += '" alt="Аватар комментатора фотографии" width="35" height="35"><p class="social__text">';
		commentHTML += postedPhotos[numberOfPicture].comments[i].message;
		commentHTML += '</p></li>'; // Формируем HTML-код комментария
		commentsContainer.insertAdjacentHTML('beforeEnd', commentHTML); // Вставка комментария в блок комментариев
	}

}
