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
'Вася'
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

// Заполняем массив объектами, описывающими фотографии

for (var i = 0; i < 25; i++) {

	postedPhotos.push({

		url: 'photos/' + (i + 1) + '.jpg',
		likes: Math.floor(Math.random() * (200 - 15) + 15),
		comments: function() {

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

	});

}