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

insertPhotosIntoDocument();

showBigPicture(0);

hideDOMElement(document.querySelector('.social__comment-count'));
hideDOMElement(document.querySelector('.comments-loader'));

/* Функции */

function generateRandomComments() {

	var commentsCount = generateRandomNumber(1, 6);
	var commentsList = [];

	for (var i = 0; i < commentsCount; i++) {

		commentsList.push({
			avatar: 'img/avatar-' + generateRandomNumber(1, 7) + '.svg',
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

	return Math.floor(Math.random() * (max - min) + min)

}

function makePhotosArray() {

	for (var i = 0; i < 25; i++) {

		postedPhotos.push({
			url: 'photos/' + (i + 1) + '.jpg',
			description: generateRandomData(descriptionsList),
			likes: generateRandomNumber(15, 201),
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

		var pictureToInsert = document.importNode(createDOMElementFromObject(i).content, true);

		photosListFragment.appendChild(pictureToInsert); // Вставляем фрагмент в документ
	
	}

	photosList.appendChild(photosListFragment);

}

function createDOMElementFromObject(numberOfPicture) {

	var pictureTemplate = document.querySelector('#picture');
	var picture = pictureTemplate.content.querySelector('.picture__img');
	var commentsCount = pictureTemplate.content.querySelector('.picture__comments');
	var likesCount = pictureTemplate.content.querySelector('.picture__likes');

	picture.setAttribute('src', postedPhotos[numberOfPicture].url); // Устанавливаем картинку
	commentsCount.textContent = postedPhotos[numberOfPicture].comments.length; // Устанавливаем количество комментариев
	likesCount.textContent = postedPhotos[numberOfPicture].likes; // Устанавливаем количество лайков

	return pictureTemplate;

}

function showBigPicture(numberOfPicture) {

	var bigPicture = document.querySelector('.big-picture'); // Показываем большое изображение
	bigPicture.classList.remove('hidden');

	var bigPictureImg = bigPicture.querySelector('.big-picture__img img'); // Устанавливаем картинку
	bigPictureImg.setAttribute('src', postedPhotos[numberOfPicture].url);

	var bigPictureDescription = bigPicture.querySelector('.social__caption'); // Устанавливаем описание
	bigPictureDescription.textContent = postedPhotos[numberOfPicture].description;

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

function hideDOMElement(element) {

	element.classList.add('visually-hidden');

}

function showDOMElement(element) {

	element.classList.remove('visually-hidden');

}
