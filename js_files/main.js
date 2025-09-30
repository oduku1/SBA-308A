import { getRandomSafeAnime } from "./fetch.js";

let score = 0; 
let highscore = 0; 

const anime1_Img = document.getElementById("anime1-img");
const anime2_Img = document.getElementById("anime2-img");
const lowerButton = document.getElementById("lower-btn");
const higherButton = document.getElementById("higher-btn");
const anime1_rating = document.getElementById("anime1-rating");
const anime2_rating = document.getElementById("anime2-rating");
const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("high-score");

let anime1, anime2;

// Ensure only safe animes with a score
async function getRandomAnime() {
    let anime;
    do {
        anime = await getRandomSafeAnime();
    } while (anime.score == null);
    return anime;
}

// Preload images so they show at the same time (no flicker)
function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
    });
}

async function initGame(isFirstRound = false) {
    if (isFirstRound) {
        // First round: fetch both
        [anime1, anime2] = await Promise.all([getRandomAnime(), getRandomAnime()]);
        while (anime2.mal_id === anime1.mal_id) {
            anime2 = await getRandomAnime();
        }
    } else {
        // After a guess: shift anime2 → anime1 visually
        anime1 = anime2;
        anime2 = await getRandomAnime();
        while (anime2.mal_id === anime1.mal_id) {
            anime2 = await getRandomAnime();
        }
    }

    // Preload both images
    await Promise.all([
        preloadImage(anime1.images.jpg.image_url),
        preloadImage(anime2.images.jpg.image_url),
    ]);

    // Only update anime1 display if it's the very first round
    if (isFirstRound) {
        anime1_Img.src = anime1.images.jpg.image_url;
        anime1_rating.textContent = anime1.score;
    } else {
        // Shift anime2 → anime1 visually
        anime1_Img.src = anime1.images.jpg.image_url;
        anime1_rating.textContent = anime1.score;
    }

    // Always update anime2 (hidden score)
    anime2_Img.src = anime2.images.jpg.image_url;
    anime2_rating.textContent = "?";

    result.textContent = "";
}

function checkGuess(isHigher) {
    // Disable buttons immediately
    lowerButton.disabled = true;
    higherButton.disabled = true;

    const correct = isHigher
        ? anime2.score >= anime1.score
        : anime2.score <= anime1.score;

    // Reveal anime2 score
    anime2_rating.textContent = anime2.score;

    if (correct) {
        score++;
        if (score > highscore) highscore = score;

        scoreDisplay.textContent = score;
        highscoreDisplay.textContent = highscore;
        result.textContent = "RIGHT ✅";

        setTimeout(() => {
            lowerButton.disabled = false;
            higherButton.disabled = false;
            initGame(false); // carry over anime2 → anime1, fetch new anime2
        }, 1500);
    } else {
        result.textContent = "WRONG ❌";
        score = 0;
        scoreDisplay.textContent = score;

        setTimeout(() => {
            lowerButton.disabled = false;
            higherButton.disabled = false;
            initGame(true); // restart with two new animes
        }, 1500);
    }
}

// Start the game
initGame(true);

lowerButton.addEventListener("click", () => checkGuess(false));
higherButton.addEventListener("click", () => checkGuess(true));