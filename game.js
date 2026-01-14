// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isFlipping = false;

// Audio elements
const gameSound = new Audio('assets/sounds/game sound.mp3');
const matchSound = new Audio('assets/sounds/match.mp3');
const failSound = new Audio('assets/sounds/fail.mp3');
const winSound = new Audio('assets/sounds/win.mp3');

// Set audio volume
gameSound.volume = 0.5;
matchSound.volume = 0.6;
failSound.volume = 0.5;
winSound.volume = 0.6;

// Card images (using bild1.png to bild4.png, each appears twice)
const cardImages = [
    'assets/images/bild1.png',
    'assets/images/bild2.png',
    'assets/images/bild3.png',
    'assets/images/bild4.png',
    'assets/images/bild1.png',
    'assets/images/bild2.png',
    'assets/images/bild3.png',
    'assets/images/bild4.png'
];

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isFlipping = false;
    
    updateDisplay();
    
    // Shuffle cards
    const shuffledImages = [...cardImages].sort(() => Math.random() - 0.5);
    
    // Create card elements
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    shuffledImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.image = image;
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Paw Patrol Bild';
        cardFront.appendChild(img);
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '🐾';
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', () => flipCard(card));
        
        gameBoard.appendChild(card);
        cards.push(card);
    });
    
    // Play game sound
    gameSound.play().catch(e => console.log('Sound konnte nicht abgespielt werden:', e));
}

// Flip card
function flipCard(card) {
    // Prevent flipping if already flipped, matched, or during animation
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        isFlipping || 
        flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        isFlipping = true;
        moves++;
        updateDisplay();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const image1 = card1.dataset.image;
    const image2 = card2.dataset.image;
    
    if (image1 === image2) {
        // Match found!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateDisplay();
        
        // Play match sound
        matchSound.play().catch(e => console.log('Sound konnte nicht abgespielt werden:', e));
        
        // Check if game is won
        if (matchedPairs === 8) {
            setTimeout(() => {
                winGame();
            }, 500);
        }
        
        flippedCards = [];
        isFlipping = false;
    } else {
        // No match
        failSound.play().catch(e => console.log('Sound konnte nicht abgespielt werden:', e));
        
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isFlipping = false;
        }, 1000);
    }
}

// Win game
function winGame() {
    winSound.play().catch(e => console.log('Sound konnte nicht abgespielt werden:', e));
    
    // Confetti effect
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#1E90FF', '#4169E1', '#87CEEB', '#B0E0E6', '#FFD700', '#FF6B6B'];
    
    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    
    // Show win message
    setTimeout(() => {
        alert(`🎉 Glückwunsch! Du hast alle Pärchen gefunden! 🎉\n\nZüge: ${moves}`);
    }, 500);
}

// Update display
function updateDisplay() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
}

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
    initGame();
});

// Initialize game on load
initGame();
