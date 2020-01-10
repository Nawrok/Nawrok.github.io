//set card list here 
const tileList = ['atm', 'busquets', 'casemiro', 'fcb', 'godin', 'griezmann', 'kroos', 'messi', 'modric', 'oblak', 'ramos', 'rm', 'suarez', 'terstegen', 'val'];
let duplicateList;

let counter;
let starsCount;
let secondsElapsed = 0;
let timer;

const counterDisplay = document.querySelector('.moves');
let openCards = [];

setupGame();
//click to start game
document.querySelector('.deck').addEventListener('click', function (event) {

	if (event.target.classList[0] === 'card' && event.target.children.item(0).classList[2] == null) {

		startTimer();

		console.log('POKAZUJE: ' + event.target.children.item(0).classList);

		let cardNode = event.target;

		let childNode = cardNode.children.item(0);
		let cardName = cardNode.children.item(0).classList[1];

		showCard(childNode);

		//function determine matching
		if (openCards.length === 0) {
			openCards.push(cardNode);
		} else {

			let cardFromList = openCards.pop();
			let cardFromListName = cardFromList.children.item(0).classList[1];

			if (cardFromListName === cardName) {
				console.log('Karty zgadzają się!');

				cardNode.classList.add('match');
				cardFromList.classList.add('match');

				removeCardFromList(cardName);
			} else {
				console.log('Karty nie zgadzają się!');
				cardNode.classList.add('notmatch');
				cardFromList.classList.add('notmatch');

				unflipCard(cardFromListName, cardName);
			}
			incrementCounter();
			calculateStarRating();
		}

		if (duplicateList.length === 0) {
			gameFinished(counter);
		}
	}

});

//click to restart game
document.querySelector('.restart').addEventListener('click', function (event) {
	setupGame();
});


/*
 * @descriptor start the timer at first click
 */
function startTimer() {
	function timersec() {
		document.querySelector('.timer').innerText = secondsElapsed++;
		timer = setTimeout(timersec, 1000);
	}
	if (secondsElapsed === 0) {
		timersec();
	}
}

/*
 * @descriptor reset timer and display
 */
function resetTimer() {
	clearTimeout(timer);
	document.querySelector('.timer').innerText = secondsElapsed;
}

/*
 * @descripto create array with duplicates
 * @param {list} originalList
 * @return {list} list containing duplicate element
 */
function performDuplicate(originalList) {
	const duplicateList = [];

	for (let i = 0; i < originalList.length; ++i) {
		duplicateList.push(originalList[i]);
		duplicateList.push(originalList[i]);
	}
	return duplicateList;
}


/* 
 * @descriptor setup the game
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function setupGame() {
	counter = 0;
	starsCount = 5;
	secondsElapsed = 0;
	counterDisplay.textContent = counter;

	displayNewGame(true);
	resetStars();
	resetTimer();

	duplicateList = performDuplicate(tileList);

	const listRandom = shuffle(duplicateList);
	const deck = document.querySelector('.deck');

	deck.innerHTML = '';
	openCards = [];
	listRandom.forEach(function (item) {
		deck.innerHTML += `<li class='card'>
                <i class='tile ${item}'></i>
           		</li>`;
	});
}

/*
 * @descriptor display a new game
 * @param {boolean} display new game else result
 */
function displayNewGame(boolean) {
	if (boolean) {
		document.querySelector('.container').style.display = 'flex';
		document.querySelector('.finished').style.display = 'none';
	} else {
		document.querySelector('.container').style.display = 'none';
		document.querySelector('.finished').style.display = 'flex';
	}
}


/*
 * @descriptor flip and animate the card on the screen
 * @param {event target} card
 */
function showCard(card) {
	card.classList.add('show');
}


/*
 * @descriptor Remove card from list
 * @param {string} cardName
 */
function removeCardFromList(cardName) {
	duplicateList = duplicateList.filter(function (element) {
		return element !== cardName;
	});
}

/*
 * @descritor unflip 2 cards when they do not match
 * @param {string} firstCard 
 * @param {string} secondCard
 */
function unflipCard(firstCard, secondCard) {
	let firstCardNode = document.querySelectorAll('.' + firstCard),
		i;
	let secondCardNode = document.querySelectorAll('.' + secondCard),
		n;

	setTimeout(function () {
		for (i = 0; i < firstCardNode.length; ++i) {
			if (firstCardNode[i].classList.contains('show')) {
				firstCardNode[i].classList.remove('show');
				firstCardNode[i].parentElement.classList.remove('notmatch');
			}
		}
		for (n = 0; n < secondCardNode.length; ++n) {
			if (secondCardNode[n].classList.contains('show')) {
				secondCardNode[n].classList.remove('show');
				secondCardNode[n].parentElement.classList.remove('notmatch');
			}
		}
		clickSwitch(true);
	}, 1000);
	clickSwitch(false);
}

function clickSwitch(mode) {
	deck = document.querySelector('.deck');

	if (mode) {
		deck.style.pointerEvents = "auto";
	} else {
		deck.style.pointerEvents = "none";
	}
}

/*
 * @descriptor increment count of click by 1 
 */
function incrementCounter() {
	counter++;
	counterDisplay.textContent = counter;
}

/*
 * @descriptor reset to 5 stars for new game
 */
function resetStars() {
	const stars = document.querySelector('.stars');
	stars.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
}

/*
 * @descritor determinie and display star rating based on counter 
 */
function calculateStarRating() {
	const stars = document.querySelector('.stars');
	if (counter === 19 || counter === 26 || counter === 38 || counter == 73) {
		stars.removeChild(stars.firstElementChild);
		stars.insertAdjacentHTML('beforeend', "<li><i class='fa fa-star-o'></i></li>");
		starsCount--;
	}
}

/*
 * @descritor display game results
 * @param {number} counter
 */
function gameFinished(counter) {
	console.log('Gra ukończona!');
	clearInterval(timer);

	displayNewGame(false);

	const finishedText = document.querySelector('.finished-result');
	finishedText.innerHTML = '';

	var accuracy = Math.round(tileList.length / counter * 100);

	const result = document.createElement('h3');
	result.innerHTML += `Ruchy: ${counter}<br>`;
	result.innerHTML += `Skuteczność: ${accuracy}%<br>`;
	result.innerHTML += `Gwiazdki: ${starsCount}<br>`;
	result.innerHTML += `Czas gry: ${secondsElapsed} s<br>`;

	const afterGameComment = document.createElement('h2');
	switch (starsCount) {
		case 5:
			afterGameComment.innerHTML = "Poszło Ci podejrzanie znakomicie, czyżbyś oszukiwał? 🤔";
			break;
		case 4:
			afterGameComment.innerHTML = "Świetny wynik, jesteś lepszy od 80% graczy! 😱 (Liczba ankietowanych: 2 xD)";
			break;
		case 3:
			afterGameComment.innerHTML = "Wynik ponadprzeciętny, jest dobrze! 🤡";
			break;
		case 2:
			afterGameComment.innerHTML = "Dobre podejście, ale mogło być lepiej. 😎👍";
			break;
		default:
			afterGameComment.innerHTML = "Nie poszło Ci najlepiej, spróbuj ponownie dla lepszego wyniku. 😉";
			break;
	}
	afterGameComment.style.fontWeight = "normal";
	afterGameComment.style.fontSize = "20px";
	finishedText.append(result);
	finishedText.append(afterGameComment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}