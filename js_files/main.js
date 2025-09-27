import { setAnime } from "./fetch.js";

let score = 0; 
let highscore = 0; 

const anime1_Img = document.getElementById("anime1-img")
const anime2_Img = document.getElementById("anime2-img")
const lowerButton = document.getElementById("lower-btn")
const higherButton = document.getElementById("higher-btn")
const anime1_rating = document.getElementById("anime1-rating")
const anime2_rating = document.getElementById("anime2-rating")
const result = document.getElementById("result")





async function getRandomAnime(){
    let anime
    do{
        anime = await setAnime()
    }while(anime.score == null);
    return anime
}

let anime1, anime2;

async function initGame() {
    anime1 = await getRandomAnime();
    anime2 = await getRandomAnime();

    let anime1_score = anime1.score;
    let anime2_score = anime2.score;

    console.log(anime1, anime2);

    // Anime 1
    anime1_Img.src = anime1.images.jpg.large_image_url;
    anime1_rating.textContent = anime1.score;

    // Anime 2
    anime2_Img.src = anime2.images.jpg.large_image_url;

    // Hide anime2 score at first
    anime2_rating.textContent = "?";

}


function checkGuess(isHigher){
    const correct = isHigher ? anime2.score >= anime1.score : anime1 <= anime1.Score
    if(correct){
        score++;
        anime2_rating.textContent= anime2.textContent

    }
}

initGame()