//** BENODIGDE DEPENDENCIES **/

// Laad de express- en mongodb-modules
const express = require('express');
const { ObjectId } = require('mongodb');
// Creëer een router-object
const router = express.Router();
// Laad de 'path'-module om met bestandspaden te werken
const path = require('path');
// Importeer de client uit de server-module
const { client } = require('../server');
// Laad de node-fetch-module in een variabele
let fetch;

// Importeer de node-fetch-module als deze nog niet is geïmporteerd
async function getFetch() {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  return fetch;
}



//** MIDDLEWARE OM CSS BESTENDEN TE LATEN ZIEN **//

// Gebruik de router om statische bestanden te serveren vanuit de opgegeven map
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  // Stel de headers in voor het serveren van de statische bestanden
  setHeaders: (res) => {
  // Stel het 'Content-Type'-header in op 'text/css'
  res.setHeader('Content-Type', 'text/css');
  }
}));

//**  Functie om films op te halen op basis van genre **//

// Definieer een asynchrone functie 'getMoviesByGenre' die een genre als parameter accepteert
async function getMoviesByGenre(genre) {
  try {
    // Probeer verbinding te maken met de database-client
    await client.connect();
    // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const collection = client.db("Moviemates").collection("Movies");
    // Zoek naar films in de collectie waar het 'Genre' overeenkomt met het gegeven genre en zet het resultaat om naar een array
    const movies = await collection.find({ Genre: genre }).toArray();
    // Geef de array met gevonden films terug
    return movies;
  } catch (error) {
    // Als er een fout optreedt tijdens het ophalen van de films, log dan de fout in de console
    console.error("Error while fetching movies: ", error);
  } 
}

//** HOME.EJS ROUTES **/

// Homepagina

// Definieer een router.get() methode die luistert naar GET-verzoeken op het root-pad ('/')
router.get('/', async (req, res) => {
  try {
    // Roep de 'getMoviesByGenre' functie aan voor elk genre en sla de resultaten op in constante variabelen
    const actionMovies = await getMoviesByGenre("Action");
    const cartoonMovies = await getMoviesByGenre("Cartoon");
    const horrorMovies = await getMoviesByGenre("Horror");
    const sportMovies = await getMoviesByGenre("Sport");

    // Verkrijg de fetch instantie met behulp van de 'getFetch' functie
    const fetchInstance = await getFetch();
    // Voer een GET-verzoek uit naar de '/saved-movies' endpoint en sla het resultaat op in 'savedMoviesResponse'
    const savedMoviesResponse = await fetchInstance('http://localhost:4000/saved-movies');
    // Converteer het antwoord naar JSON en sla het op in 'savedMovies'
    const savedMovies = await savedMoviesResponse.json();

    // Rendert de 'home' view met de opgegeven gegevens
    res.render('home', {
      title: 'Homepage', // Geef de titel door aan de view
      savedMovies: savedMovies, // Geef de opgeslagen films door aan de view
      actionMovies, // Geef de actiefilms door aan de view
      cartoonMovies, // Geef de tekenfilms door aan de view
      horrorMovies, // Geef de horrorfilms door aan de view
      sportMovies // Geef de sportfilms door aan de view
    });
  } catch (error) {
    // Als er een fout optreedt tijdens het renderen van de homepagina, log dan de fout in de console
    console.error("Error while rendering home: ", error);
  }
});


//** MOVIEPAGE ROUTE **/

// Definieer een GET-route voor '/movie/:id', waarbij ':id' een route-parameter is die het ID van de film vertegenwoordigt
router.get('/movie/:id', async (req, res) => {
  try {
    // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const collection = client.db("Moviemates").collection("Movies");
    // Zoek naar de film in de collectie met een overeenkomend '_id'-veld en zet het ObjectId van de route-parameter om naar een ObjectId type
    const movie = await collection.findOne({ _id: new ObjectId(req.params.id) });

    // Render de 'moviePage' view met de gevonden film en stel de titel in op de filmtitel
    res.render('moviePage', { title: movie.Title, movie });
  } catch (error) {
    // Als er een fout optreedt tijdens het renderen van de moviePage, log dan de fout in de console
    console.error("Error while rendering moviePage: ", error);
  }
});


// Route om films op te slaan in 'savedMovies'
router.post('/save-movie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const collection = client.db("Moviemates").collection("Movies");
    const movie = await collection.findOne({ _id: ObjectId(movieId) });

    if (!movie) {
      throw new Error("Movie not found");
    }

    const savedMoviesCollection = client.db("Moviemates").collection("savedMovies");
    await savedMoviesCollection.insertOne(movie);

    res.redirect('/');
  } catch (error) {
    console.error("Error while saving movie: ", error);
    res.status(500).send("Kon de film niet opslaan");
  }
});

// Route om opgeslagen films op te halen
router.get('/saved-movies', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("Moviemates").collection("savedMovies");
    const savedMovies = await collection.find().toArray();
    res.json(savedMovies);
  } catch (error) {
    console.error("Error while fetching saved movies: ", error);
    res.status(500).send('Error while fetching saved movies');
  } finally {
  }
});


router.post('/toggle-movie/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  // Zoek de film in de savedMovies collectie
  const savedMovie = await client.db('Moviemates').collection('savedMovies').findOne({ _id: new ObjectId(movieId) }); // <-- Hier voeg je 'new' toe

  if (savedMovie) {
    // Verwijder de film uit de savedMovies collectie als deze al is opgeslagen
    await client.db('Moviemates').collection('savedMovies').deleteOne({ _id: new ObjectId(movieId) }); // <-- Hier voeg je 'new' toe
    res.status(200).send();
  } else {
    // Sla de film op in de savedMovies collectie als deze nog niet is opgeslagen
    const movie = await client.db('Moviemates').collection('Movies').findOne({ _id: new ObjectId(movieId) }); // <-- Hier voeg je 'new' toe
    await client.db('Moviemates').collection('savedMovies').insertOne(movie);
    res.status(201).send();
  }
});


router.get('/is-movie-saved/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  const savedMovie = await client.db('Moviemates').collection('savedMovies').findOne({ _id: new ObjectId(movieId) });

  if (savedMovie) {
    res.json(true);
  } else {
    res.json(false);
  }
});

module.exports = router;