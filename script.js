const playButton = document.getElementById('playButton');
const instructionsSection = document.getElementById('instructionsSection');
const gameSection = document.getElementById('gameSection');
const numbers = document.querySelectorAll('.number');
const die1 = document.getElementById('die1');
const die2 = document.getElementById('die2');
const rollButton = document.getElementById('rollButton');
const resetButton = document.getElementById('resetButton');
const modal = document.getElementById('sumModal');
const closeBtn = document.getElementsByClassName('close')[0];
const acceptBtn = document.getElementById('acceptSum');
const cancelBtn = document.getElementById('cancelSum');
const sumInput = document.getElementById('sumInput');
const diceSumText = document.getElementById('diceSum');

let currentSum = 0;
let selectedSum = 0;
let canRoll = true;

playButton.addEventListener('click', () => {
    instructionsSection.style.display = 'none';
    gameSection.style.display = 'block';
});

numbers.forEach(number => {
    number.addEventListener('click', () => {
        if (!number.classList.contains('closed') && !canRoll) {
            const value = parseInt(number.dataset.value);
            if (number.classList.contains('selected')) {
                number.classList.remove('selected');
                selectedSum -= value;
            } else {
                if (selectedSum + value > currentSum) {
                    alert(`¡Cuidado! La suma de las casillas seleccionadas no puede exceder ${currentSum}.`);
                } else {
                    number.classList.add('selected');
                    selectedSum += value;
                }
            }
            if (selectedSum === currentSum) {
                closeSelectedNumbers();
            }
        }
    });
});

function getRandomDieValue() {
    return Math.floor(Math.random() * 6) + 1;
}

function updateDieImage(dieElement, value) {
    dieElement.src = `imagenes/dados/dado${value}.png`;
    dieElement.alt = `Dado mostrando ${value}`;
}

function animateDice(callback) {
    const animationDuration = 1000; // 1 second
    const intervalDuration = 50; // 50 milliseconds between updates
    let elapsedTime = 0;

    die1.classList.add('shake');
    die2.classList.add('shake');

    const intervalId = setInterval(() => {
        updateDieImage(die1, getRandomDieValue());
        updateDieImage(die2, getRandomDieValue());

        elapsedTime += intervalDuration;

        if (elapsedTime >= animationDuration) {
            clearInterval(intervalId);
            die1.classList.remove('shake');
            die2.classList.remove('shake');
            callback();
        }
    }, intervalDuration);
}

function showSumModal(dice1Value, dice2Value) {
    diceSumText.textContent = `${dice1Value} + ${dice2Value} =`;
    sumInput.value = '';
    modal.style.display = 'block';
}

function hideSumModal() {
    modal.style.display = 'none';
}

function showCorrectGif() {
    const gifElement = document.getElementById('correctGif');
    gifElement.style.display = 'block';
    setTimeout(() => {
        gifElement.style.display = 'none';
    }, 1000);
}

function showIncorrectGif() {
    const gifElement = document.getElementById('incorrectGif');
    gifElement.style.display = 'block';
    setTimeout(() => {
        gifElement.style.display = 'none';
        showSumModal(parseInt(die1.alt.split(' ').pop()), parseInt(die2.alt.split(' ').pop()));
    }, 1000);
}

function showGameOverModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'block';
}

closeBtn.onclick = () => {
    if (confirm('¿Estás seguro de que quieres cerrar? Aún no has ingresado la suma correcta.')) {
        hideSumModal();
    }
};

cancelBtn.onclick = () => {
    if (confirm('¿Estás seguro de que quieres cancelar? Aún no has ingresado la suma correcta.')) {
        hideSumModal();
    }
};

window.onclick = function(event) {
    if (event.target == modal) {
        if (confirm('¿Estás seguro de que quieres cerrar? Aún no has ingresado la suma correcta.')) {
            hideSumModal();
        }
    }
}

function checkPossibleSum(targetSum, availableNumbers) {
    const numbers = Array.from(availableNumbers)
        .filter(num => !num.classList.contains('closed') && !num.classList.contains('selected'))
        .map(num => parseInt(num.dataset.value));

    for (let i = 1; i <= 4; i++) {
        if (findCombination(numbers, targetSum, i)) {
            return true;
        }
    }
    return false;
}

function findCombination(numbers, target, count, start = 0, current = []) {
    if (count === 0) {
        return current.reduce((a, b) => a + b, 0) === target;
    }
    
    for (let i = start; i < numbers.length; i++) {
        current.push(numbers[i]);
        if (findCombination(numbers, target,