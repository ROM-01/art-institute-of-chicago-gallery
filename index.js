const input = document.getElementById("search-input");
const btn = document.getElementById("search-btn");
const gallery = document.querySelector(".gallery-wrapper");

const DEFAULT_IMAGE = "/images/coming-soon.jpg";

function displayArtworks(artworks) {
    gallery.innerHTML = "";

    artworks.forEach(art => {
        const imageId = art.image_id;
        const imageUrl = imageId
            ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
            : DEFAULT_IMAGE;

        const artDiv = document.createElement("div");
        artDiv.classList.add("artwork");
        artDiv.innerHTML = `
            <h3>${art.title || 'Title unavailable'}</h3>
            <img src="${imageUrl}" alt="${art.title || 'Untitled'}">
        `;
        gallery.appendChild(artDiv);
    });
}

// Fetch 1
function loadInitialArt() {
    fetch("https://api.artic.edu/api/v1/artworks?page=5&limit=12")
        .then(respond => respond.json())
        .then(data => {
            displayArtworks(data.data);
        })
        .catch(error => {
            gallery.innerHTML = "<p>Error loading artwork.</p>";
            console.error(error);
        });
}

// Week 14 Second Fetch: Search Feature
function handleSearch() {
    const query = input.value.trim();
    if (!query) return;

    gallery.innerHTML = "<p>Searching...</p>";

    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=12`)
        .then(respond => respond.json())
        .then(data => {
            const ids = data.data.map(item => item.id);
            if (ids.length === 0) {
                gallery.innerHTML = "<p>No results found.</p>";
                return;
            }

            return fetch(`https://api.artic.edu/api/v1/artworks?ids=${ids.join(',')}`);
        })
        .then(respond => respond.json())
        .then(data => {
            displayArtworks(data.data);
        })
        .catch(err => {
            gallery.innerHTML = "<p>Error fetching search results.</p>";
            console.error(err);
        });
}

btn.addEventListener("click", handleSearch);

loadInitialArt();
