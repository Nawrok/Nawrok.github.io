// Ustawianie zestawu kart
const tileList = ['atm', 'busquets', 'casemiro', 'fcb', 'godin', 'griezmann', 'kroos', 'messi', 'modric', 'oblak', 'ramos', 'rm', 'suarez', 'terstegen', 'val'];
let duplicateList;

let counter = 0;
let starsCount = 5;
let secondsElapsed = 0;
let timer;

const counterDisplay = document.querySelector('.moves');
let openCards = [];

// Ustawienie parametrów gry
setupGame();

// Kliknięcie stosowane w grze do sprawdzania kart
document.querySelector('.deck').addEventListener('click', function (event) {
	if (event.target.classList[0] === 'card' && event.target.children.item(0).classList[2] == null) {
		startTimer();

		let cardNode = event.target;
		let childNode = cardNode.children.item(0);
		let cardName = childNode.classList[1];

		console.log('POKAZUJE: ' + childNode.classList);
		showCard(childNode);

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

// Kliknięcie, które resetuje grę
document.querySelector('.restart').addEventListener('click', function (event) {
	setupGame();
});

// FUNKCJE
/*
 * Rozpoczęcie odliczania czasu po kliknięciu karty
 */
function startTimer() {
	function timerSec() {
		document.querySelector('.timer').innerText = secondsElapsed++;
		timer = setTimeout(timerSec, 1000);
	}
	if (secondsElapsed === 0) {
		timerSec();
	}
}

/*
 * Funkcja do wyzerowania timera
 */
function resetTimer() {
	clearTimeout(timer);
	document.querySelector('.timer').innerText = secondsElapsed;
}

/*
 * Tworzenie tablicy duplikatów
 * względem oryginalnej listy, z tym że każda karta
 * jest wrzucana tam dwa razy
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
 * Ustawienie wszystkich parametrów potrzebnych do startu gry
 * Wyświetlenie kart na ekranie
 *   - pomieszanie kart za pomocą specjalnej funkcji mieszającej
 *   - stworzenie HTML dla każdej karty
 *   - i dodanie HTML każdej karty do strony
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
 * Tworzenie wyświetlania w zależności czy gra się skończyła
 * Poruszanie się pomiędzy ekranem gry, a ekranem jej ukończenia
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
 * Odwrócenie i animowanie wskazanej karty
 */
function showCard(card) {
	card.classList.add('show');
}

/*
 * Usunięcie karty z listy
 */
function removeCardFromList(cardName) {
	duplicateList = duplicateList.filter(function (element) {
		return element !== cardName;
	});
}

/*
 * Odwrócenie dwóch kart, jeśli nie są one takie same
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

/*
 * Zablokowanie klikania, gdy karty wykonują animacje w trakcie timeouta (1 s)
 */
function clickSwitch(mode) {
	deck = document.querySelector('.deck');
	if (mode) {
		deck.style.pointerEvents = "auto";
	} else {
		deck.style.pointerEvents = "none";
	}
}

/*
 * Prosty inkrementator liczby ruchów
 */
function incrementCounter() {
	counterDisplay.textContent = ++counter;
}

/*
 * Ustawianie gwiazdek na 5 dla nowej gry
 */
function resetStars() {
	const stars = document.querySelector('.stars');
	stars.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
}

/*
 * Zmniejszanie i wyświetlanie gwiazdek zależnie od wyniku
 */
function calculateStarRating() {
	const stars = document.querySelector('.stars');
	if (counter === 19 || counter === 26 || counter === 38 || counter === 73) {
		stars.removeChild(stars.firstElementChild);
		stars.insertAdjacentHTML('beforeend', "<li><i class='fa fa-star-o'></i></li>");
		starsCount--;
	}
}

/*
 * Koniec gry, zliczenie statystyk i wyświetlenie ekranu końcowego
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

// Funkcja mieszająca z http://stackoverflow.com/a/2450976 (algorytm mieszający Fishera-Yatesa)
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