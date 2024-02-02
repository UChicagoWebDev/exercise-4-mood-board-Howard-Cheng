const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY;

function runSearch() {
    // TODO: Clear the results pane before you run a new search
    document.getElementById("resultsImageContainer").innerHTML = "";

    openResultsPane();

    // TODO: Build your query by combining the bing_api_endpoint and a query attribute
    //  named 'q' that takes the value from the search bar input field.
    let searchTerm = document.querySelector(".search input").value;
    let queryUrl = `${bing_api_endpoint}?q=${encodeURIComponent(searchTerm)}`;

    let request = new XMLHttpRequest();

    // TODO: Construct the request object and add appropriate event listeners to
    // handle responses. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
    //
    //   - You'll want to specify that you want json as your response type
    //   - Look for your data in event.target.response
    //   - When adding headers, also include the commented out line below. See the API docs at:
    // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
    //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
    //     display them to the user
    //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
    //
    // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
    request.open("GET", queryUrl, true);
    request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
    request.setRequestHeader("Accept", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            displayImages(response.value);
        }
    };

    // TODO: Send the request
    request.send();

    return false; // Keep this; it keeps the browser from sending the event
    // further up the DOM chain. Here, we don't want to trigger
    // the default form submission behavior.
}

function displayImages(images) {
    let container = document.getElementById("resultsImageContainer");
    images.forEach(function (image) {
        let img = document.createElement("img");
        img.src = image.thumbnailUrl;
        img.alt = image.name;
        img.onclick = function () {
            addImageToMoodBoard(image.contentUrl);
        };
        container.appendChild(img);
    });
}

function addImageToMoodBoard(imageUrl) {
    let moodBoard = document.getElementById("moodBoard");
    let img = document.createElement("img");
    img.src = imageUrl;
    moodBoard.appendChild(img);
}

function openResultsPane() {
    // This will make the results pane visible.
    document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
    // This will make the results pane hidden again.
    document.querySelector("#resultsExpander").classList.remove("open");
}

function displayRelatedSearches(relatedSearches) {
    let relatedContainer = document.getElementById("relatedSearchContainer");
    // Clear previous related searches
    relatedContainer.innerHTML = "";
    relatedSearches.forEach(function (search) {
        let button = document.createElement("button");
        button.textContent = search.text;
        button.onclick = function () {
            runSearch(search.text);
        };
        relatedContainer.appendChild(button);
    });
}

// This will
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        runSearch();
    }
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        closeResultsPane();
    }
});
