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

/* Функции */

function generateRandomComments() {

	var commentsCount = Math.floor(Math.random() * (7 - 1) + 1);
	var commentsList = [];

	for (var i = 0; i < commentsCount; i++) {

		commentsList.push({
			avatar: 'img/avatar-' + Math.floor(Math.random() * (7 - 1) + 1) + '.svg',
			message: messagesList[Math.floor(Math.random() * messagesList.length)],
			name: peopleNames[Math.floor(Math.random() * peopleNames.length)]
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
	var photosListFragment = document.createDocumentFragment();

	for (var i = 0; i < postedPhotos.length; i++) {
		var pictureTemplate = document.querySelector('#picture');
		var picture = pictureTemplate.content.querySelector('.picture__img');
		var commentsCount = pictureTemplate.content.querySelector('.picture__comments');
		var likesCount = pictureTemplate.content.querySelector('.picture__likes');

		picture.setAttribute('src', postedPhotos[i].url);
		commentsCount.textContent = postedPhotos[i].comments.length;
		likesCount.textContent = postedPhotos[i].likes;

		var pictureForDocument = document.importNode(pictureTemplate.content, true);

		photosListFragment.appendChild(pictureForDocument);
	}

	photosList.appendChild(photosListFragment);

}
