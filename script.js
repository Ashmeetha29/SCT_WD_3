const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const playAIBtn = document.getElementById("playAI");

let cells = Array.from(document.querySelectorAll(".cell"));
let currentPlayer = "X";
let gameActive = true;
let gameMode = "player"; // "player" or "AI"
let boardState = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

function checkWinner() {
  for (let condition of winConditions) {
    let [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      statusText.textContent = `🎉 Player ${boardState[a]} Wins!`;
      gameActive = false;
      return true;
    }
  }
  if (!boardState.includes("")) {
    statusText.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (!checkWinner()) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    if (gameMode === "AI" && currentPlayer === "O") {
      setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  let emptyCells = boardState.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  let choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardState[choice] = "O";
  cells[choice].textContent = "O";
  
  if (!checkWinner()) {
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
  }
}

function restartGame() {
  boardState.fill("");
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
}

function playAI() {
  restartGame();
  gameMode = "AI";
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
playAIBtn.addEventListener("click", playAI);
