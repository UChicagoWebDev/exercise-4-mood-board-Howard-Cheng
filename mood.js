document.addEventListener("DOMContentLoaded", (event) => {
    const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
    const bing_api_key = BING_API_KEY;

    function runSearch() {
        document.getElementById("resultsImageContainer").innerHTML = "";

        openResultsPane();

        let searchTerm = document.querySelector(".search input").value;
        let queryUrl = `${bing_api_endpoint}?q=${encodeURIComponent(searchTerm)}`;

        let request = new XMLHttpRequest();

        request.open("GET", queryUrl, true);
        request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
        request.setRequestHeader("Accept", "application/json");
        request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                displayImages(response.value);
            }
        };

        request.send();

        return false;
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
        let board = document.getElementById("board");
        let img = document.createElement("img");
        img.src = imageUrl;
        board.appendChild(img);
    }

    function openResultsPane() {
        document.querySelector("#resultsExpander").classList.add("open");
    }

    function closeResultsPane() {
        document.querySelector("#resultsExpander").classList.remove("open");
    }

    document.querySelector("#runSearchButton").addEventListener("click", runSearch);
    document.querySelector(".search input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            runSearch();
        }
    });

    document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
    document.querySelector("body").addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeResultsPane();
        }
    });
});
