// Themes mapped to secret word options
const themeWords = {
    "Cartoon Shows": ["SPONGEBOB", "POKEMON", "BLUEY", "AVATAR"],
    "Pirates & Ships": ["ANCHOR", "TREASURE", "CANNON", "GALLEON", "PIRATE"],
    "Superheroes": ["BATMAN", "SUPERMAN", "AVENGERS", "SPIDERMAN"],
    "Video Games": ["MARIO", "MINECRAFT", "ZELDA", "FORTNITE", "ROBLOX"],
    "Animals & Wildlife": ["CHEETAH", "ELEPHANT", "GIRAFFE", "KANGAROO"],
    "Space & Planets": ["JUPITER", "ASTRONAUT", "GALAXY", "ROCKET"],
    "Sports & Athletics": ["BASKETBALL", "FOOTBALL", "BASEBALL", "SOCCER"],
    "Movies & Films": ["TITANIC", "INCEPTION", "AVATAR", "FROZEN"],
    "Food & Desserts": ["PANCAKES", "ICE CREAM", "PIZZA", "BURGER"],
    "Ocean Life": ["DOLPHIN", "SHARK", "OCTOPUS", "JELLYFISH"],
    "Dinosaurs": ["RAPTOR", "STEGOSAURUS", "TRICERATOPS"],
    "Fantasy & Magic": ["DRAGON", "WIZARD", "UNICORN", "PHOENIX"],
    "Music & Instruments": ["GUITAR", "PIANO", "DRUMS", "TRUMPET"],
    "Anime & Manga": ["NARUTO", "GOKU", "LUFFY", "ONEPIECE"],
    "Vehicles & Cars": ["MUSTANG", "SPORTSCAR", "TRACTOR", "BICYCLE"],
    "Countries & Cities": ["FRANCE", "CANADA", "TOKYO", "LONDON"],
    "Mythical Creatures": ["KRAKEN", "GRIFFIN", "PEGASUS", "MINOTAUR"]
};

// Pick a random theme from the object keys
const themes = Object.keys(themeWords);
const randomTheme = themes[Math.floor(Math.random() * themes.length)];

// Pick a random word matching that theme
const wordsInTheme = themeWords[randomTheme];
const secretWord = wordsInTheme[Math.floor(Math.random() * wordsInTheme.length)];

// Display theme on webpage
document.getElementById("theme-display").textContent = randomTheme;

// Game State Variables
let remainingTries = 6;
let correctGuessesCount = 0;

// HTML Elements
const stonesContainer = document.getElementById("stepping-stones");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const messageDisplay = document.getElementById("message-display");
const triesCountDisplay = document.getElementById("tries-count");

// Remove maxlength so users can type full words
guessInput.removeAttribute("maxlength");

// Create a stepping stone for each letter in the secret word
function createSteppingStones() {
    stonesContainer.innerHTML = "";
    for (let i = 0; i < secretWord.length; i++) {
        const stone = document.createElement("div");
        stone.classList.add("stone");
        
        // Handle spaces if a theme word has two words
        if (secretWord[i] === " ") {
            stone.textContent = " ";
            stone.style.backgroundColor = "transparent";
            stone.style.border = "none";
            correctGuessesCount++; 
        } else {
            stone.textContent = "_";
        }
        
        stone.setAttribute("id", "stone-" + i);
        stonesContainer.appendChild(stone);
    }
}

// Handle player guess (single letter OR full word)
function handleGuess() {
    const guess = guessInput.value.trim().toUpperCase();
    guessInput.value = "";

    // Validate empty input
    if (!guess) {
        messageDisplay.textContent = "Please enter a letter or a full word!";
        return;
    }

    // SCENARIO 1: Full word guess
    if (guess.length > 1) {
        if (guess === secretWord) {
            // Correct word guess! Fill all stones
            for (let i = 0; i < secretWord.length; i++) {
                const stone = document.getElementById("stone-" + i);
                if (stone) stone.textContent = secretWord[i];
            }
messageDisplay.textContent = "🎉 YOU WIN! You guessed the whole word and reached Treasure Island! 🏆";
celebrate(); // <--- ADD THIS LINE HERE
            guessBtn.disabled = true;
            guessInput.disabled = true;
        } else {
            // Wrong word guess — give up to 2 hints max!
            remainingTries--;
            triesCountDisplay.textContent = remainingTries;

            let hintsRevealed = 0;
            const maxHints = 2;

            for (let i = 0; i < guess.length; i++) {
                if (hintsRevealed >= maxHints) break; // Stop after 2 hints

                const guessedLetter = guess[i];
                if (secretWord.includes(guessedLetter)) {
                    // Check if this letter is unrevealed
                    let revealedThisTurn = false;
                    for (let j = 0; j < secretWord.length; j++) {
                        if (secretWord[j] === guessedLetter) {
                            const stone = document.getElementById("stone-" + j);
                            if (stone && stone.textContent === "_") {
                                stone.textContent = guessedLetter;
                                correctGuessesCount++;
                                revealedThisTurn = true;
                            }
                        }
                    }
                    if (revealedThisTurn) {
                        hintsRevealed++;
                    }
                }
            }

            if (hintsRevealed > 0) {
                messageDisplay.textContent = "Wrong word! Ye got " + hintsRevealed + " letter hint(s)! Figure out the rest!";
            } else {
                messageDisplay.textContent = "Shiver me timbers! ' " + guess + " ' has NO matching new letters!";
            }

            // Check if hints completed the word!
            if (correctGuessesCount === secretWord.length) {
                messageDisplay.textContent = "🎉 YOU WIN! The hints revealed the whole word! 🏆";
                guessBtn.disabled = true;
                guessInput.disabled = true;
            } else {
                checkLoseCondition();
            }
        }
        return;
    }

    // SCENARIO 2: Single letter guess
    if (secretWord.includes(guess)) {
        let foundNewLetter = false;

        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === guess) {
                const stone = document.getElementById("stone-" + i);
                if (stone && stone.textContent === "_") {
                    stone.textContent = guess;
                    correctGuessesCount++;
                    foundNewLetter = true;
                }
            }
        }

        if (foundNewLetter) {
            messageDisplay.textContent = "Arrr! ' " + guess + " ' is correct!";
        } else {
            messageDisplay.textContent = "You already guessed ' " + guess + " '!";
        }

        // Check Win Condition
        if (correctGuessesCount === secretWord.length) {
            messageDisplay.textContent = "🎉 YOU WIN! You reached Treasure Island! 🏆";
celebrate(); // <--- ADD THIS LINE HERE
            guessBtn.disabled = true;
            guessInput.disabled = true;
        }

    } else {
        remainingTries--;
        triesCountDisplay.textContent = remainingTries;
        messageDisplay.textContent = "Shiver me timbers! ' " + guess + " ' is NOT in the word!";
        checkLoseCondition();
    }
}

function checkLoseCondition() {
    if (remainingTries <= 0) {
        messageDisplay.textContent = "💀 GAME OVER! The lava caught you! The word was " + secretWord;
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
}

// Listen for button click
guessBtn.addEventListener("click", handleGuess);

// Start game setup
createSteppingStones();

// Function to launch the confetti!
function celebrate() {
    confetti({
        particleCount: 150, // How many pieces
        spread: 90,          // How wide they fall
        origin: { y: 0.6 }   // Start slightly below the top
    });
}