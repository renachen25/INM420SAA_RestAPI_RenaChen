// Define global constants
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

    if (!response.ok) {
        throw new Error("Failed to fetch game data");
    }

    const data = await response.json();
    return data.data;
}

// Function for getting the 10 most recent reviews for a game by its ID
async function getMostRecentReviews(gameId) {
    const urlReviewsWithId = urlReviews.replace("{id}", gameId);
    const response = await fetch(urlReviewsWithId, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey
        }
    });
}

// Search Button Event Listener
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query === "") {
        alert("Please enter a game name");
        return;
    }
    try {
        data = await searchGameByName(query);
        displayResults(data);
    } catch (error) {
        console.error(error);
        resultsGrid.innerHTML = "<p>Something went wrong. Try again.</p>";
    }
});

// Function for displaying search results in the results grid
function displayResults(data) {
    resultsGrid.innerHTML = "";

    if (!data || data.length === 0) {
        resultsGrid.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.search.forEach((game) => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        card.innerHTML = `
        <div class="game-info">
            <h3>${game.name}</h3>
            <p>Price: ${game.price}</p>
            <img src="${game.image}" alt="${game.name} image">
        </div>
      `;

        resultsGrid.appendChild(card);
    });
}
