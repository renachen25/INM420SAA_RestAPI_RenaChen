// Define global constants
const urlSearch = "https://games-details.p.rapidapi.com/search?sugg={name}";
const apiHost = "games-details.p.rapidapi.com";
const apiKey = "59cfa79471msh99b02c0ca956f2dp1c7f2cjsne7a4f3148dcf";
const urlReviews = "https://games-details.p.rapidapi.com/reviews/toprated/{id}?limit=5&offset=0";
const buttonViewText = "View Top Reviews";
const buttonCloseText = "Hide Reviews";

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
    console.log(`Fetching reviews from: ${urlReviewsWithId}`);
    const response = await fetch(urlReviewsWithId, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }

    const data = await response.json();
    console.log("Received reviews data:", data);
    return data.data.reviews;
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

        // Create the main article element
        const article = document.createElement('article');
        article.classList.add('game-info');

        // Create the game-basic div
        const gameBasicDiv = document.createElement('div');
        gameBasicDiv.classList.add('game-basic');

        // Create the game-overview div
        const gameOverviewDiv = document.createElement('div');
        gameOverviewDiv.classList.add('game-overview');

        // Create and append the h3 element for the game name
        const gameNameHeading = document.createElement('h3');
        gameNameHeading.textContent = game.name;
        gameOverviewDiv.appendChild(gameNameHeading);

        // Create and append the paragraph for the game price
        const gamePriceParagraph = document.createElement('p');
        gamePriceParagraph.textContent = `Price: ${game.price}`;
        gameOverviewDiv.appendChild(gamePriceParagraph);

        // Append the game-overview div to the game-basic div
        gameBasicDiv.appendChild(gameOverviewDiv);

        // Create the img-button div
        const imgButtonDiv = document.createElement('div');
        imgButtonDiv.classList.add('img-button');

        // Create and append the image element
        const gameImage = document.createElement('img');
        gameImage.src = game.image;
        gameImage.alt = `${game.name} image`;
        imgButtonDiv.appendChild(gameImage);

        // Create and append the button element
        const reviewsButton = document.createElement('button');
        reviewsButton.classList.add('reviews-button');
        reviewsButton.textContent = buttonViewText;
        reviewsButton.onclick = async (event) => await displayGameReviews(event.currentTarget, game.id);
        imgButtonDiv.appendChild(reviewsButton);

        // Append the img-button div to the game-basic div
        gameBasicDiv.appendChild(imgButtonDiv);

        // Create the game-reviews div
        const gameReviewsDiv = document.createElement('div');
        gameReviewsDiv.classList.add('game-reviews');

        // Append all elements to the article
        article.appendChild(gameBasicDiv);
        article.appendChild(gameReviewsDiv);

        // Append the article to the card element
        card.appendChild(article);

        resultsGrid.appendChild(card);
    });
}

// Function for displaying the most recent reviews for a game when the "View Top Reviews" button is clicked
async function displayGameReviews(button, gameId) {
    const gameBasicElement = button.closest(".game-basic");
    const reviewsContainer = gameBasicElement.nextElementSibling;

    if (reviewsContainer.style.display === "block") {
        reviewsContainer.style.display = "none";
        button.textContent = buttonViewText;
        return;
    }

    reviewsContainer.innerHTML = "";
    try {
        reviews = await getMostRecentReviews(gameId);
        if (!reviews || reviews.length === 0) {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.innerHTML = "<p>No reviews found.</p>";
            reviewsContainer.appendChild(reviewElement);
        } else {
            reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
                reviewElement.innerHTML = `
                        <h4>${review.title}</h4>
                        <p>${review.content}</p>
                    `;
                reviewsContainer.appendChild(reviewElement);
            });
        }
    } catch (error) {
        console.error(error);
        reviewsContainer.innerHTML = "<p>Failed to load reviews.</p>";
    };

    reviewsContainer.style.display = "block";
    button.textContent = buttonCloseText;
    return;
}
