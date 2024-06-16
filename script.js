const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modal = document.getElementById('modal');
const confirmReset = document.getElementById('confirmReset');
const cancelReset = document.getElementById('cancelReset');
const sizeSelector = document.getElementById('sizeSelector');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const resetScoresButton = document.getElementById('resetScores');
const boardElement = document.querySelector('.board');
const updateNamesButton = document.getElementById('updateNames');
const toggleSoloModeButton = document.getElementById('toggleSoloMode'); 

let isXNext = true;
let boardSize = 3;
let board = [];
let winConditions = [];
let isSoloMode = false; 
let player1Name = 'Player 1'; 
let player2Name = 'Player 2'; 

initializeBoard();

function initializeBoard() {
    boardElement.innerHTML = '';
    boardElement.setAttribute('data-size', boardSize);
    board = Array(boardSize * boardSize).fill('');
    for (let i = 0; i < board.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick);
        boardElement.appendChild(cell);
    }
    calculateWinConditions();
}

function calculateWinConditions() {
    winConditions = [];
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        const column = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(i * boardSize + j);
            column.push(j * boardSize + i);
        }
        winConditions.push(row);
        winConditions.push(column);
    }
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < boardSize; i++) {
        diag1.push(i * boardSize + i);
        diag2.push((i + 1) * boardSize - (i + 1));
    }
    winConditions.push(diag1);
    winConditions.push(diag2);
}

function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(boardElement.children).indexOf(cell);

    if (board[cellIndex] !== '' || (isSoloMode && !isXNext)) return;

    board[cellIndex] = isXNext ? 'X' : 'O';
    const span = document.createElement('span');
    span.textContent = board[cellIndex];
    cell.appendChild(span);
    cell.classList.add('occupied');

    if (checkWin()) {
        updateStatus(`${board[cellIndex]} Wins!`);
        updateScore(board[cellIndex]);
        setTimeout(resetBoard, 5000);
        return;
    }

    if (board.every(cell => cell !== '')) {
        updateStatus('It\'s a Tie!');
        setTimeout(resetBoard, 5000);
        return;
    }

    isXNext = !isXNext;
    updateStatus(`${isXNext ? player1Name : player2Name}'s Turn`);

    if (isSoloMode && !isXNext) {
        setTimeout(makeComputerMove, 1000);
    }
}

function checkWin() {
    return winConditions.some(combination => {
        return combination.every(index => {
            return board[index] === (isXNext ? 'X' : 'O');
        });
    });
}

function updateStatus(message) {
    statusText.textContent = message;
}

function resetBoard() {
    board = Array(boardSize * boardSize).fill('');
    boardElement.innerHTML = '';
    for (let i = 0; i < board.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick);
        boardElement.appendChild(cell);
    }
    isXNext = true;
    updateStatus('X\'s Turn');
}

function updateScore(winner) {
    if (winner === 'X') {
        playerXScore.textContent = parseInt(playerXScore.textContent) + 1;
    } else {
        playerOScore.textContent = parseInt(playerOScore.textContent) + 1;
    }
    localStorage.setItem('playerXScore', playerXScore.textContent);
    localStorage.setItem('playerOScore', playerOScore.textContent);
}

function resetScores() {
    playerXScore.textContent = '0';
    playerOScore.textContent = '0';
    localStorage.setItem('playerXScore', '0');
    localStorage.setItem('playerOScore', '0');
}

function loadScores() {
    playerXScore.textContent = localStorage.getItem('playerXScore') || '0';
    playerOScore.textContent = localStorage.getItem('playerOScore') || '0';
}

function updateNames() {
    const playerXNameInput = document.getElementById('playerXNameInput');
    const playerONameInput = document.getElementById('playerONameInput');
    player1Name = playerXNameInput.value.trim() || 'Player 1';
    player2Name = playerONameInput.value.trim() || 'Player 2';
    updateStatus(`${player1Name}'s Turn`);
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
}

function loadNames() {
    player1Name = localStorage.getItem('player1Name') || 'Player 1';
    player2Name = localStorage.getItem('player2Name') || 'Player 2';
    document.getElementById('playerXName').textContent = player1Name;
    document.getElementById('playerOName').textContent = player2Name;
    document.getElementById('playerXNameInput').value = player1Name;
    document.getElementById('playerONameInput').value = player2Name;
}

function toggleSoloMode() {
    isSoloMode = !isSoloMode;
    if (isSoloMode) {
        player2Name = 'Computer';
        updateStatus('Solo Mode: Play against the computer');
    } else {
        player2Name = 'Player 2';
        updateStatus('Multiplayer Mode: Play against a friend');
    }
    document.getElementById('playerOName').textContent = player2Name;
    localStorage.setItem('isSoloMode', isSoloMode);
}

function makeComputerMove() {
    const emptyCells = [...boardElement.children].filter(cell => cell.textContent === '');
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.click();
}

document.addEventListener('DOMContentLoaded', () => {
    loadScores();
    loadNames();
    isSoloMode = localStorage.getItem('isSoloMode') === 'true';
    if (isSoloMode) {
        toggleSoloMode(); 
        
    }
    updateStatus(isSoloMode ? 'Solo Mode: Play against the computer' : 'Multiplayer Mode: Play against a friend');
});

resetButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

confirmReset.addEventListener('click', () => {
    resetBoard();
    modal.style.display = 'none';
});

cancelReset.addEventListener('click', () => {
    modal.style.display = 'none';
});

resetScoresButton.addEventListener('click', resetScores);

sizeSelector.addEventListener('change', (e) => {
    boardSize = parseInt(e.target.value);
    initializeBoard();
    updateStatus('X\'s Turn');
});

updateNamesButton.addEventListener('click', updateNames);
toggleSoloModeButton.addEventListener('click', toggleSoloMode); 

// --------------
function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(boardElement.children).indexOf(cell);

    if (board[cellIndex] !== '' || (isSoloMode && !isXNext)) return;

    board[cellIndex] = isXNext ? 'X' : 'O';
    const span = document.createElement('span');
    span.textContent = board[cellIndex];
    cell.appendChild(span);
    cell.classList.add('occupied');

    if (checkWin()) {
        updateStatus(`${board[cellIndex]} Wins!`);
        updateScore(board[cellIndex]);
        setTimeout(resetBoard, 5000);
        return;
    }

    if (board.every(cell => cell !== '')) {
        updateStatus('It\'s a Tie!');
        setTimeout(resetBoard, 5000);
        return;
    }

    isXNext = !isXNext;
    updateStatus(`${isXNext ? player1Name : player2Name}'s Turn`);

    if (isSoloMode && !isXNext) {
        setTimeout(makeComputerMove, 1000);
    }
}

// -------
function updateStatus() {
    if (isSoloMode) {
        statusText.textContent = isXNext ? `${player1Name}'s Turn` : 'Computer\'s Turn';
    } else {
        statusText.textContent = `${isXNext ? player1Name : player2Name}'s Turn`;
    }
}
// ----------------
