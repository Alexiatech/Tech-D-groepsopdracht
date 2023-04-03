//** Definieer een asynchrone functie om opgeslagen films op te halen **//

async function fetchSavedMovies() {
    try {
      // Verzoek om opgeslagen films te ontvangen via een API-endpoint
      const response = await fetch('/saved-movies');
      // Converteer het antwoord naar JSON-formaat
      const savedMovies = await response.json();
      // Roep de functie aan om opgeslagen films weer te geven met de opgehaalde gegevens
      displaySavedMovies(savedMovies);
    } catch (error) {
      // Toon foutmelding in de console als er een fout optreedt tijdens het ophalen
      console.error('Error while fetching saved movies:', error);
    }
}




//**  Definieer een functie om de opgeslagen films weer te geven op de webpagina **/

function displaySavedMovies(savedMovies) {
    // Verkrijg de opgeslagen films lijst uit de DOM
    const savedMoviesList = document.getElementById('saved-movies-list');
    // Leeg de innerHTML van de lijst met opgeslagen films
    savedMoviesList.innerHTML = '';

    // Loop door de lijst met opgeslagen films
    for (const movie of savedMovies) {
      // Maak een nieuw 'li'-element voor elk filmitem
      const movieItem = document.createElement('li');
      // Voeg de 'film-item' class toe aan het 'li'-element
      movieItem.classList.add('film-item');

      // Voeg HTML-structuur toe aan het 'li'-element met filmgegevens
      movieItem.innerHTML = `
        <a href="/movie/${movie._id}">
          <img src="/uploads/images/films/${movie.Imgurl}" alt="${movie.Title}" class="film-image">
          <figcaption class="film-info">
            <h3 class="film-title">${movie.Title}</h3>
            <p class="film-release">Release date: ${movie.ReleaseDate}</p>
          </figcaption>
        </a>
      `;
      // Voeg het 'li'-element toe aan de lijst met opgeslagen films
      savedMoviesList.appendChild(movieItem);
    }
}




//** Roep de fetchSavedMovies-functie aan om de lijst met opgeslagen films te vullen bij het laden van de pagina **/
fetchSavedMovies();
