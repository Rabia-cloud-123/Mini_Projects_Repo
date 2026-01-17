const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player is X
let isGameActive = true;

const WINNING_COMBINATIONS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Player click
function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] !== "" || !isGameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) return;

    currentPlayer = "O"; // Computer turn
    message.textContent = "Computer's turn";

    setTimeout(computerMove, 500);
}

// Smart AI
function computerMove() {
    // 1. Win if possible
    for (let combo of WINNING_COMBINATIONS) {
        let [a, b, c] = combo;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return makeMove(c);
        if (board[a] === "O" && board[c] === "O" && board[b] === "") return makeMove(b);
        if (board[b] === "O" && board[c] === "O" && board[a] === "") return makeMove(a);
    }

    // 2. Block player if they are about to win
    for (let combo of WINNING_COMBINATIONS) {
        let [a, b, c] = combo;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return makeMove(c);
        if (board[a] === "X" && board[c] === "X" && board[b] === "") return makeMove(b);
        if (board[b] === "X" && board[c] === "X" && board[a] === "") return makeMove(a);
    }

    // 3. Take center if empty
    if (board[4] === "") return makeMove(4);

    // 4. Take a corner if empty
    const corners = [0,2,6,8].filter(i => board[i] === "");
    if (corners.length > 0) return makeMove(corners[Math.floor(Math.random() * corners.length)]);

    // 5. Take any empty side
    const sides = [1,3,5,7].filter(i => board[i] === "");
    if (sides.length > 0) return makeMove(sides[Math.floor(Math.random() * sides.length)]);
}

// Place move
function makeMove(index) {
    board[index] = "O";
    cells[index].textContent = "O";
    if (checkWinner()) return;
    currentPlayer = "X";
    message.textContent = "Player X's turn";
}

// Check winner or draw
function checkWinner() {
    let roundWon = false;
    for (let combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = currentPlayer === "X" ? "Player Wins! 🎉" : "Computer Wins! 🤖";
        isGameActive = false;
        return true;
    }

    if (!board.includes("")) {
        message.textContent = "It's a Draw! 🤝";
        isGameActive = false;
        return true;
    }

    return false;
}

// Restart
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    currentPlayer = "X";
    isGameActive = true;
    message.textContent = "Player X's turn";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
