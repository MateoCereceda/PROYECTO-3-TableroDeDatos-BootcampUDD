const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const gallery = document.getElementById('gallery');

const apiKey = 'V45jZq6t';

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchArtworks(query);
    }
});

async function searchArtworks(query) {
    const url = `https://www.rijksmuseum.nl/api/en/collection?key=${apiKey}&q=${query}&imgonly=True`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        displayResults(data.artObjects);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(artworks) {
    gallery.innerHTML = '';

    if (artworks.length > 0) {
        const artwork = artworks[0]; // Tomamos solo la primera obra de arte

        const artDiv = document.createElement('div');
        artDiv.classList.add('artwork');

        const artImg = document.createElement('img');
        artImg.src = artwork.webImage.url;
        artDiv.appendChild(artImg);

        const artTitle = document.createElement('h2');
        artTitle.textContent = artwork.title;
        artDiv.appendChild(artTitle);

        const artArtist = document.createElement('p');
        artArtist.textContent = `Artist: ${artwork.principalOrFirstMaker}`;
        artDiv.appendChild(artArtist);

        gallery.appendChild(artDiv);
    } else {
        gallery.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}
