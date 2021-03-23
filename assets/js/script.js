const $wordBlankElement = document.querySelector('.word-blanks');
const $winDisplayElement = document.querySelector('.win');
const $loseDisplayElement = document.querySelector('.lose');
const $timerElement = document.querySelector('.timer-count');
const $startButton = document.querySelector('.start-button');
const $resetButton = document.querySelector('.reset-button');

const WORDS = ['one', 'two', 'three', 'four', 'twelve']; // note must be lowercase
const ALLOWED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789 '; // words must be made up from this set.
const SCORE_STORAGE_KEY = 'score';
const RANDOM_WORD_STORAGE_KEY = 'randomWord';
const GUESSED_WORD_STORAGE_KEY = 'guessedWord';
const COUNT_DOWN_TIME = 5;
const COUNT_DOWN_INTERVAL = 1000;
const INITIAL_SCORE = {
  win: 0,
  loss: 0,
}

// These functions are used by init
function getScore() {
  const rawStoredScore = localStorage.getItem(SCORE_STORAGE_KEY);
  const storedScore = JSON.parse(rawStoredScore);
  const score = storedScore === null ? 0 : storedScore;
  return score;
}

function setScore(win, loss) {
  const scoreString = JSON.stringify({ win: win, loss: loss });
  localStorage.setItem(SCORE_STORAGE_KEY, scoreString);
}

function setWin() {
  const score = getScore();
  const win = score.win + 1;
  setScore(win, score.loss);
}

function setLoss() {
  const score = getScore();
  const loss = score.loss + 1;
  setScore(score.win, loss);
}

function renderScore() {
  const score = getScore()
  $loseDisplayElement.textContent = score.loss;
  $winDisplayElement.textContent = score.win;
}

function wordIsGuessed() {
  return getRandomiseWord() === getGuessedWord();
}

function startCountdown() {
  let time = COUNT_DOWN_TIME;
  const timer = setInterval(function countDown() {
    time--;
    renderTimer(time)
    if (time > 0 && wordIsGuessed()) {
      setWin();
      renderNotice('YOU WON!');
    } else if (time <= 0) {
      setLoss();
      renderNotice('You lost...');
    } else {
      return;
    }
    renderScore();
    endGame()
    clearInterval(timer);
  }, COUNT_DOWN_INTERVAL);
}

function newRandomiseWord() {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  localStorage.setItem(RANDOM_WORD_STORAGE_KEY, WORDS[randomIndex]);
}

function newGuessedWord() {
  const chosenWord = getRandomiseWord();
  const numBlanks = chosenWord.length;
  const blanksLetters = '_'.repeat(numBlanks);
  setGuessedWord(blanksLetters)
}

function getRandomiseWord() {
  return localStorage.getItem(RANDOM_WORD_STORAGE_KEY);
}

function getGuessedWord() {
  return localStorage.getItem(GUESSED_WORD_STORAGE_KEY);
}

function setGuessedWord(word) {
  localStorage.setItem(GUESSED_WORD_STORAGE_KEY, word);
}

function checkKey(event) {
  const letterGuessed = event.key.toLowerCase();
  const alphabetNumericCharacters = ALLOWED_CHARACTERS.split('');
  if (alphabetNumericCharacters.includes(letterGuessed)) {
    checkLetters(letterGuessed);
  }
}

// Tests if guessed letter is in word and renders it to the screen.
function checkLetters(letter) {
  const chosenWordLetters = getRandomiseWord().split('');
  const guessedWordLetters = getGuessedWord().split('');
  if (chosenWordLetters.includes(letter)) {
    const updatedGuessedLetters = guessedWordLetters.map(function checkLetter(guessedLetter, index) {
      if (chosenWordLetters[index] === letter) {
        return letter;
      }
      return guessedLetter;
    });
    setGuessedWord(updatedGuessedLetters.join(''));
    renderGuessedWord();
  }
}

function renderTimer(time) {
  $timerElement.textContent = time;
}

function renderGuessedWord() {
  const guessedWord = getGuessedWord();
  renderNotice(guessedWord.split('').join(' '));
}

function renderNotice(text) {
  $wordBlankElement.textContent = text;
}

function startGame() {
  $startButton.disabled = true;
  newRandomiseWord();
  newGuessedWord();
  startCountdown();
  renderGuessedWord();
  document.addEventListener('keypress', checkKey);
}

function resetGame() {
  setScore(0, 0);
  renderScore();
}

function endGame() {
  $startButton.disabled = false;
  document.removeEventListener('keypress', checkKey);
}

function init() {
  renderScore();
}

init();
$startButton.addEventListener('click', startGame);
$resetButton.addEventListener('click', resetGame);