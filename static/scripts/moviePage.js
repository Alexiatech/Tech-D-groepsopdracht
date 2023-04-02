// Verkrijg de "add-to-movies" knop
const addToMoviesButton = document.querySelector('.add-to-movies');

// STERRENBEOORDELING FUNCTIE

// Functie om de geselecteerde beoordeling naar de server te sturen
function stuurBeoordeling(beoordeling) {
    console.log("Beoordeling verzonden: " + beoordeling);
}

// Verkrijg de beoordelingssterren container
const beoordelingsSterrenContainer = document.getElementById('beoordelingsSterren');

// Voeg een event listener toe voor de 'change'-gebeurtenis
beoordelingsSterrenContainer.addEventListener('change', (e) => {
    // Controleer of het doel van het event een invoerveld is
    if (e.target.tagName.toLowerCase() === 'input') {
        // Verkrijg de geselecteerde beoordeling
        const geselecteerdeBeoordeling = parseInt(e.target.id.slice(2));

        // Roep de stuurBeoordeling-functie aan met de geselecteerde beoordeling
        stuurBeoordeling(geselecteerdeBeoordeling);
    }
});

// DE TEKST OP DE DETAILPAGINA "READ MORE

// Verkrijg de "read-more" knop
const readMoreBtn = document.querySelector('.read-more');
// Verkrijg de "read-less" knop
const readLessBtn = document.querySelector('.read-less');
// Verkrijg de "more-text" container
const moreText = document.querySelector('.more-text');

// Update de 'click' eventlistener voor readMoreBtn
readMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moreText.style.display = 'block';
    readMoreBtn.style.display = 'none';
    readLessBtn.style.display = 'block';
});

// Update de 'click' eventlistener voor readLessBtn
readLessBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moreText.style.display = 'none';
    readMoreBtn.style.display = 'block';
    readLessBtn.style.display = 'none';
});

// Voeg een eventlistener toe voor de "add-to-movies" knop wanneer de pagina is geladen
document.addEventListener('DOMContentLoaded', async () => {
      const addToMoviesButton = document.querySelector('.add-to-movies');
      // Dit stukje heb ik extra toegevoegd om de rode knop consistent ook als
      // De gebruiker weg gaat uit de moviePage.ejs
      // Verkrijg de film-ID van de "add-to-movies" knop
      const movieId = addToMoviesButton.dataset.id;

      // Controleer of de film al is opgeslagen en werk de knop bij
      const isSaved = await checkIfMovieIsSaved(movieId);
      updateToggleButton(isSaved);

  addToMoviesButton.addEventListener('click', async (e) => {
      e.preventDefault();

      // Verkrijg de film-ID van de "add-to-movies" knop
      const movieId = addToMoviesButton.dataset.id;

      // Controleer of de film al is opgeslagen en werk de knop bij
      const isSaved = await checkIfMovieIsSaved(movieId);
      updateToggleButton(isSaved);

      // Roep de toggleSavedMovie-functie aan en krijg de nieuwe opgeslagen status
      const saved = await toggleSavedMovie(movieId);

      // Werk de knop bij op basis van de nieuwe opgeslagen status
      updateToggleButton(saved);

      // Toon een alert op basis van de nieuwe opgeslagen status
      if (saved && !isSaved) {
          alert('Film opgeslagen');
      } else if (!saved && isSaved) {
          alert('Film verwijderd uit de lijst');
      }
  });
});

// Update de button om de tekst en kleur te veranderen aan de hand van de status
function updateToggleButton(saved) {
  const toggleButton = document.querySelector('.add-to-movies');
  const starImage = toggleButton.querySelector('img'); // Voeg deze regel toe

  // Verander de tekst, kleur en klasse van de knop op basis van de opgeslagen status
  if (saved) {
      toggleButton.classList.add('saved');
      toggleButton.querySelector('span').textContent = "REMOVE 'MOVIES YOU LIKE'";
      starImage.src = "/uploads/images/home/stergevuld.png"; // Voeg deze regel toe
  } else {
      toggleButton.classList.remove('saved');
      toggleButton.querySelector('span').textContent = "ADD TO 'MOVIES YOU LIKE'";
      starImage.src = "/uploads/images/home/stertransparant.png"; // Voeg deze regel toe
  }
}


// Functie om de opgeslagen status van een film te wijzigen
async function toggleSavedMovie(movieId) {
  try {
      const response = await fetch(`/toggle-movie/${movieId}`, { method: 'POST' });
      return response.status === 201;
  } catch (error) {
      console.error('Error while toggling movie:', error);
      return false;
  }
}

async function checkIfMovieIsSaved(movieId) {
  try {
    const response = await fetch(`/is-movie-saved/${movieId}`);
    const isSaved = await response.json();
    return isSaved;
  } catch (error) {
    console.error('Error while checking if movie is saved:', error);
    return false;
  }
}

