const urlSearch = "https://games-details.p.rapidapi.com/search?sugg={name}";
const apiHost = "games-details.p.rapidapi.com";
const apiKey = "59cfa79471msh99b02c0ca956f2dp1c7f2cjsne7a4f3148dcf";
const urlReviews = "https://games-details.p.rapidapi.com/reviews/toprated/{id}?limit=10&offset=0";

// Function for searching game details by name
async function searchGameByName(name) {
    const urlSearchWithName = urlSearch.replace("{name}", encodeURIComponent(name));
    const response = await fetch(urlSearchWithName, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey
        }
    });
}

// Function for getting the 10 most recent reviews for a game by its ID
async function getMostRecentReviews(gameId){
    const urlReviewsWithId = urlReviews.replace("{id}", gameId);
    const response = await fetch(urlReviewsWithId, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey
        }
    });
}
