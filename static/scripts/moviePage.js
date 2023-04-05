//**  Verkrijg de "add-to-movies" knop **/
const addToMoviesButton = document.querySelector('.add-to-movies');




//** STERRENBEOORDELING FUNCTIE **/

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




//** DE TEKST OP DE DETAILPAGINA "READ MORE **/

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




//** Voeg een eventlistener toe voor de "add-to-movies" knop wanneer de pagina is geladen **/
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




//** Update de button om de tekst en kleur te veranderen aan de hand van de status **/

// Functie om de knop bij te werken op basis van de opgeslagen status (saved)
function updateToggleButton(saved) {
    // Selecteer de knop met de klasse '.add-to-movies'
    const toggleButton = document.querySelector('.add-to-movies');
    // Selecteer de afbeelding (img) binnen de knop
    const starImage = toggleButton.querySelector('img');

    // Controleer of de film is opgeslagen (saved) of niet
    if (saved) {
        // Voeg de klasse 'saved' toe aan de knop als de film is opgeslagen
        toggleButton.classList.add('saved');
        // Verander de tekst van de knop naar "REMOVE 'MOVIES YOU LIKE'"
        toggleButton.querySelector('span').textContent = "REMOVE 'MOVIES YOU LIKE'";
        // Verander de bron (src) van de ster-afbeelding naar de gevulde ster
        starImage.src = "/uploads/images/home/stergevuld.png";
    } else {
        // Verwijder de klasse 'saved' van de knop als de film niet is opgeslagen
        toggleButton.classList.remove('saved');
        // Verander de tekst van de knop naar "ADD TO 'MOVIES YOU LIKE'"
        toggleButton.querySelector('span').textContent = "ADD TO 'MOVIES YOU LIKE'";
        // Verander de bron (src) van de ster-afbeelding naar de transparante ster
        starImage.src = "/uploads/images/home/stertransparant.png";
    }
}



//** Functie om de opgeslagen status van een film te wijzigen **/

// Definieer een asynchronische functie genaamd 'toggleSavedMovie' die een 'movieId' als parameter accepteert
async function toggleSavedMovie(movieId) {
    // Probeer het volgende codeblok uit te voeren
    try {
        // Stuur een POST-verzoek naar de server om de opgeslagen status van de film te wijzigen
        // en wacht op het antwoord (door 'await' te gebruiken)
        const response = await fetch(`/toggle-movie/${movieId}`, { method: 'POST' });

        // Controleer of de statuscode van het antwoord 201 is (wat betekent dat het succesvol was)
        // en retourneer 'true' als dat het geval is
        return response.status === 201;
    } catch (error) { // Als er een fout optreedt tijdens het uitvoeren van de 'try' codeblok
        // Log de fout in de console met een beschrijvend bericht
        console.error('Error while toggling movie:', error);

        // Retourneer 'false' omdat de actie niet succesvol was
        return false;
    }
}



//** Definieer een asynchrone functie genaamd 'checkIfMovieIsSaved' die de opgeslagen status van een film controleert **//
async function checkIfMovieIsSaved(movieId) {
    // Probeer het volgende blok code uit te voeren
    try {
        // Stuur een fetch-verzoek naar de server om de opgeslagen status van de film met de gegeven film-ID te controleren
        const response = await fetch(`/is-movie-saved/${movieId}`);
        // Wacht op de server om te reageren en parse het JSON-antwoord om te controleren of de film is opgeslagen
        const isSaved = await response.json();
        // Geef de waarde van 'isSaved' terug (true als de film is opgeslagen, false als dit niet het geval is)
        return isSaved;
    } catch (error) {
        // Als er een fout optreedt tijdens de uitvoering van het try-blok, log dan de fout in de console
        console.error('Error while checking if movie is saved:', error);
        // Geef 'false' terug, omdat er een fout is opgetreden en het niet mogelijk is om te controleren of de film is opgeslagen
        return false;
    }
}


