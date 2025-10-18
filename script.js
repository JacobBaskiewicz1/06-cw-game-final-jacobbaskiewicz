// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect (match instructions)
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;           // Holds the interval for spawning items
let timerInterval;           // Holds the interval for the timer
let timeLeft = 30;           // Game timer in seconds

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    // Add click handler for empty cells (optional visual feedback)
    cell.addEventListener('click', () => {
      cell.classList.add('missed');
      setTimeout(() => cell.classList.remove('missed'), 200);
    });
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Create wrapper + can
  const wrapper = document.createElement('div');
  wrapper.className = 'water-can-wrapper';
  const can = document.createElement('div');
  can.className = 'water-can';

  // Handle click
  can.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gameActive || can.classList.contains('clicked')) return;

    can.classList.add('clicked');
    currentCans++;
    updateScore();

    can.classList.add('collected');
    randomCell.classList.add('collected-cell');

    setTimeout(() => {
      randomCell.classList.remove('collected-cell');
      wrapper.remove();
    }, 300);

    if (currentCans >= GOAL_CANS) {
      endGame(true);
    }
  });

  wrapper.appendChild(can);
  randomCell.appendChild(wrapper);

  // Auto-remove the can after 800 ms if not clicked
  setTimeout(() => {
    if (wrapper.parentNode && !can.classList.contains('clicked')) {
      wrapper.remove();
    }
  }, 800);
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return;
  gameActive = true;
  currentCans = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();
  createGrid();
  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
  document.getElementById('start-game').disabled = true;
  document.getElementById('achievements').textContent = '';
}

function endGame(won) {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  document.getElementById('start-game').disabled = false;
  // Show achievement message
  const achievement = document.getElementById('achievements');
  if (won) {
    achievement.textContent = '🎉 You collected all cans!';
    achievement.style.color = '#4FCB53';
    showConfetti();
  } else {
    achievement.textContent = '⏰ Time is up!';
    achievement.style.color = '#F5402C';
    clearConfetti();
  }
}

// Confetti effect
function showConfetti() {
  const confettiColors = ['#FFC907', '#003366', '#FFF7E1', '#77A8BB', '#F5402C'];
  const confettiContainer = document.getElementById('confetti');
  confettiContainer.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.top = '-40px';
    piece.style.animationDelay = (Math.random() * 0.7) + 's';
    confettiContainer.appendChild(piece);
  }
  setTimeout(clearConfetti, 1800);
}

function clearConfetti() {
  const confettiContainer = document.getElementById('confetti');
  if (confettiContainer) confettiContainer.innerHTML = '';
}

function updateScore() {
  const scoreEl = document.getElementById('current-cans');
  scoreEl.textContent = currentCans;
  // Real-time feedback: animate score
  scoreEl.classList.add('score-pop');
  setTimeout(() => scoreEl.classList.remove('score-pop'), 200);
}

function updateTimer() {
  const timerEl = document.getElementById('timer');
  timerEl.textContent = timeLeft;
  // Animate timer when low
  if (timeLeft <= 5) {
    timerEl.classList.add('timer-low');
  } else {
    timerEl.classList.remove('timer-low');
  }
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Reset game logic
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();
  createGrid();
  document.getElementById('start-game').disabled = false;
  document.getElementById('achievements').textContent = '';
}

document.getElementById('reset-game').addEventListener('click', resetGame);
