// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isFlipping = false;
let isMuted = false;
let isFullscreen = false;

// Audio elements
const gameSound = new Audio('assets/sounds/game sound 2.mp3');
const matchSound = new Audio('assets/sounds/match.mp3');
const failSound = new Audio('assets/sounds/fail.mp3');
const winSound = new Audio('assets/sounds/win.mp3');

// Set audio volume (Basiswerte)
gameSound.volume = 0.5;
matchSound.volume = 0.6;
failSound.volume = 0.5;
winSound.volume = 0.6;

function applyMuteState() {
    const factor = isMuted ? 0 : 1;
    gameSound.muted = isMuted;
    matchSound.muted = isMuted;
    failSound.muted = isMuted;
    winSound.muted = isMuted;

    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.classList.toggle('muted', isMuted);
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.setAttribute('aria-label', isMuted ? 'Ton einschalten' : 'Ton stummschalten');
    }
}

function toggleFullscreen() {
    const doc = document;
    const docEl = document.documentElement;

    if (!doc.fullscreenElement) {
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen();
        }
        isFullscreen = true;
    } else {
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        }
        isFullscreen = false;
    }

    const btn = document.getElementById('fullscreenToggle');
    if (btn) {
        const active = !!doc.fullscreenElement;
        btn.textContent = active ? '🡼' : '⛶';
        btn.setAttribute('aria-label', active ? 'Vollbild verlassen' : 'Vollbild aktivieren');
    }
}

// Set game sound to loop
gameSound.loop = true;

// Card images (using all 8 images, each appears twice for 16 cards total)
const cardImages = [
    'assets/images/bild1.png',
    'assets/images/bild2.png',
    'assets/images/bild3.png',
    'assets/images/bild4.png',
    'assets/images/bild5.png',
    'assets/images/bild6.png',
    'assets/images/bild7.png',
    'assets/images/bild8.png',
    'assets/images/bild1.png',
    'assets/images/bild2.png',
    'assets/images/bild3.png',
    'assets/images/bild4.png',
    'assets/images/bild5.png',
    'assets/images/bild6.png',
    'assets/images/bild7.png',
    'assets/images/bild8.png'
];

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isFlipping = false;
    
    updateDisplay();
    
    // Stop and reset game sound
    gameSound.pause();
    gameSound.currentTime = 0;
    
    // Clear matched stack
    const matchedStack = document.getElementById('matchedStack');
    matchedStack.innerHTML = '<h3>Gefundene Pärchen</h3>';
    
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
        //cardBack.textContent = '🐾';
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', () => flipCard(card));
        
        gameBoard.appendChild(card);
        cards.push(card);
    });
    
    // Play game sound in loop
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
        
        // Move matched pair to stack
        setTimeout(() => {
            moveToStack(card1, card2, image1);
        }, 500);
        
        // Check if game is won
        if (matchedPairs === 8) {
            setTimeout(() => {
                winGame();
            }, 1000);
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
    // Hintergrundmusik stoppen
    gameSound.pause();

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
    
    // Zeige modernes Gewinn-Modal
    setTimeout(() => {
        const overlay = document.getElementById('winModalOverlay');
        const movesEl = document.getElementById('winModalMoves');
        if (overlay && movesEl) {
            movesEl.textContent = moves;
            overlay.classList.add('visible');
        }
    }, 500);
}

// Move matched pair to stack
function moveToStack(card1, card2, image) {
    const matchedStack = document.getElementById('matchedStack');
    
    // Create stack item
    const stackItem = document.createElement('div');
    stackItem.className = 'stack-item';
    stackItem.style.zIndex = matchedPairs;
    
    // Calculate position based on number of pairs found
    const topOffset = 50 + (matchedPairs - 1) * 10;
    const rotation = (matchedPairs - 1) % 2 === 0 ? 
        (matchedPairs - 1) * 2 : 
        -(matchedPairs - 1) * 2;
    
    stackItem.style.top = `${topOffset}px`;
    stackItem.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    const stackImg = document.createElement('img');
    stackImg.src = image;
    stackImg.alt = 'Gefundenes Paar';
    stackItem.appendChild(stackImg);
    
    matchedStack.appendChild(stackItem);
    
    // Hide cards but keep their space in the grid
    setTimeout(() => {
        card1.style.opacity = '0';
        card2.style.opacity = '0';
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
            card1.style.pointerEvents = 'none';
            card2.style.pointerEvents = 'none';
        }, 300);
    }, 200);
}

// Update display
function updateDisplay() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
}

// Start game sound immediately when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Sound-Button initialisieren
    const soundBtn = document.getElementById('soundToggle');
    const fullscreenBtn = document.getElementById('fullscreenToggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            applyMuteState();
        });
        applyMuteState();
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
    }

    gameSound.play().catch(e => {
        console.log('Sound konnte nicht automatisch abgespielt werden:', e);
        // Try again after user interaction
        document.addEventListener('click', () => {
            gameSound.play().catch(err => console.log('Sound Fehler:', err));
        }, { once: true });
    });
});

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
    initGame();
});

// Modal Buttons
const winModalOverlay = document.getElementById('winModalOverlay');
const winModalReplay = document.getElementById('winModalReplay');
const winModalClose = document.getElementById('winModalClose');

if (winModalReplay) {
    winModalReplay.addEventListener('click', () => {
        if (winModalOverlay) {
            winModalOverlay.classList.remove('visible');
        }
        initGame();
    });
}

if (winModalClose) {
    winModalClose.addEventListener('click', () => {
        if (winModalOverlay) {
            winModalOverlay.classList.remove('visible');
        }
        // Musik nach Schließen nicht automatisch neu starten, Spieler entscheidet mit Restart
    });
}

// Initialize game on load
initGame();
