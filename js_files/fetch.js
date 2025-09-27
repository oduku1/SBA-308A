async function getData(){
    const response  = await fetch("https://api.jikan.moe/v4/random/anime");
    const data  = await response.json()
    return data.data
}

export async function setAnime(){
    const anime = await getData()
    return anime
}
