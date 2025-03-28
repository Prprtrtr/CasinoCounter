const WINNING_SCORE = 21;
const BONUS_VALUES = {
    mostCards: 3,
    mostSpades: 1,
    bigCasino: 2,
    smallCasino: 1,
    aces: 1
};

let scores = {
    meg: 0,
    liam: 0
};

let scoreHistory = {
    meg: [0], // Start with 0
    liam: [0] // Start with 0
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scoreRound').addEventListener('click', scoreRound);
    document.getElementById('reset').addEventListener('click', resetGame);
    updateHistoryDisplays(); // Initialize history displays
});

function scoreRound() {
    // Create temporary copy of current scores
    let tempScores = {
        meg: scores.meg,
        liam: scores.liam
    };

    // Process bonuses in order and track changes
    processBonusWithHistory('mostCards', tempScores);
    processBonusWithHistory('mostSpades', tempScores);
    processBonusWithHistory('bigCasino', tempScores);
    processBonusWithHistory('smallCasino', tempScores);
    
    // Process aces
    const megAces = parseInt(document.getElementById('megAces').value) || 0;
    const liamAces = parseInt(document.getElementById('liamAces').value) || 0;
    
    if (megAces > 0) {
        tempScores.meg += megAces * BONUS_VALUES.aces;
        scoreHistory.meg.push(tempScores.meg);
    }
    
    if (liamAces > 0) {
        tempScores.liam += liamAces * BONUS_VALUES.aces;
        scoreHistory.liam.push(tempScores.liam);
    }

    // Update final scores
    scores = { ...tempScores };
    updateScores();
    updateHistoryDisplays();
    checkWinner();
    
    // Clear bonus selections (but keep scores)
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
}

function processBonusWithHistory(bonusName, tempScores) {
    const selected = document.querySelector(`input[name="${bonusName}"]:checked`);
    if (selected) {
        tempScores[selected.value] += BONUS_VALUES[bonusName];
        scoreHistory[selected.value].push(tempScores[selected.value]);
    }
}

function updateScores() {
    document.getElementById('megScore').textContent = scores.meg;
    document.getElementById('liamScore').textContent = scores.liam;
}

function updateHistoryDisplays() {
    document.getElementById('megHistory').textContent = 
        scoreHistory.meg.join(' → ');
    document.getElementById('liamHistory').textContent = 
        scoreHistory.liam.join(' → ');
}

function checkWinner() {
    const winnerDisplay = document.getElementById('winner');
    
    if (scores.meg >= WINNING_SCORE || scores.liam >= WINNING_SCORE) {
        const winner = scores.meg >= WINNING_SCORE ? 'Meg' : 'Liam';
        winnerDisplay.textContent = `${winner} wins the game!`;
        winnerDisplay.style.display = 'block';
    }
}

function resetGame() {
    scores = { meg: 0, liam: 0 };
    scoreHistory = { meg: [0], liam: [0] };
    updateScores();
    updateHistoryDisplays();
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    document.getElementById('winner').style.display = 'none';
}