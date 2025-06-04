const input = document.getElementById("search-input");
const btn = document.getElementById("search-btn");
const gallery = document.querySelector(".gallery-wrapper");

const DEFAULT_IMAGE = "/images/coming-soon.jpg";

let currentPage = 1;
const ITEMS_PER_PAGE = 12;
let currentSearchQuery = ""; // for tracking search mode

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageIndicator = document.getElementById("page-indicator");

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

function loadInitialArt(page = 1) {
    fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ITEMS_PER_PAGE}`)
        .then(respond => respond.json())
        .then(data => {
            displayArtworks(data.data);
            pageIndicator.textContent = `Page ${currentPage}`;
        })
        .catch(error => {
            gallery.innerHTML = "<p>Error loading artwork.</p>";
            console.error(error);
        });
}

function handleSearch(page = 1) {
    const query = input.value.trim();
    if (!query) return;

    gallery.innerHTML = "<p>Searching...</p>";
    currentSearchQuery = query;

    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=${ITEMS_PER_PAGE}&page=${page}`)
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
            pageIndicator.textContent = `Page ${currentPage}`;
        })
        .catch(err => {
            gallery.innerHTML = "<p>Error fetching search results.</p>";
            console.error(err);
        });
}


btn.addEventListener("click", () => {
    currentPage = 1;
    handleSearch(currentPage);
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    if (currentSearchQuery) {
        handleSearch(currentPage);
    } else {
        loadInitialArt(currentPage);
    }
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        if (currentSearchQuery) {
            handleSearch(currentPage);
        } else {
            loadInitialArt(currentPage);
        }
    }
});


loadInitialArt();
