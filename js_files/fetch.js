export async function getRandomSafeAnime() {
  const url = "https://api.jikan.moe/v4/random/anime";
  const resp = await fetch(url);
  const result = await resp.json();
  const anime = result.data;

  const blockedGenres = ["Ecchi", "Hentai", "Erotica"];
  const blockedRatings = ["R+", "Rx"];

  const genreNames = anime.genres.map((g) => g.name);

  if (
    genreNames.some((g) => blockedGenres.includes(g)) ||
    blockedRatings.includes(anime.rating)
  ) {
    return getRandomSafeAnime();
  }
  return anime
}


console.log(getRandomSafeAnime())