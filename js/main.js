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
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '';

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

        const artistCount = {};

        artworks.forEach((artwork) => {
            const artist = artwork.principalOrFirstMaker;
            if (artistCount.hasOwnProperty(artist)) {
                artistCount[artist]++;
            } else {
                artistCount[artist] = 1;
            }
        });

        chartContainer.innerHTML = '<canvas id="artChart"></canvas>'; // Agrega el elemento canvas aquí
        const ctx = document.getElementById('artChart').getContext('2d');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [artwork.principalOrFirstMaker],
                datasets: [
                    {
                        label: 'Número de obras de arte del arísta que Rijksmuseum Art Gallery tiene en posesión',
                        data: [artistCount[artwork.principalOrFirstMaker]],
                        backgroundColor: [
                            'rgba(60, 60, 60, 0.2)',
                        ],
                        borderColor: [
                            'rgba(90, 90, 90, 1)',
                        ],
                        borderWidth: 1
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        gallery.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}
