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

// Definieer een router.get() methode die luistert naar GET-verzoeken op het root-pad ('/')
router.get('/home/:username', async (req, res) => {
  try {
    // Roep de 'getMoviesByGenre' functie aan voor elk genre en sla de resultaten op in constante variabelen
    const actionMovies = await getMoviesByGenre("Action");
    const cartoonMovies = await getMoviesByGenre("Cartoon");
    const horrorMovies = await getMoviesByGenre("Horror");
    const sportMovies = await getMoviesByGenre("Sport");

    // // Verkrijg de fetch instantie met behulp van de 'getFetch' functie
    // const fetchInstance = await getFetch();
    // // Voer een GET-verzoek uit naar de '/saved-movies' endpoint en sla het resultaat op in 'savedMoviesResponse'
    // const savedMoviesResponse = await fetchInstance('http://localhost:4000/saved-movies');
    // // Converteer het antwoord naar JSON en sla het op in 'savedMovies'
    // const savedMovies = await savedMoviesResponse.json();

    const db = client.db('Moviemates');
    const user = parseInt(req.params.username);
    const account = await db.collection('Users').find({ Username: req.params.username }).toArray();
    const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes } }).toArray();

    //loop om alle films uit de array te halen
    for (let i = 0; i < likedMovies.length; i++) {
      const movie = likedMovies[i];
      console.log(likedMovies[0]);
    }


    // Rendert de 'home' view met de opgegeven gegevens
    res.render('home', {
      title: 'Homepage', // Geef de titel door aan de view
      data: likedMovies, // Geef de opgeslagen films door aan de view
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
    // Zoek naar de film in de collectie met een overeenkomend '_id'-veld 
    // en zet het ObjectId van de route-parameter om naar een ObjectId type
    const movie = await collection.findOne({ _id: new ObjectId(req.params.id) });

    // Render de 'moviePage' view met de gevonden film en stel de titel in op de filmtitel
    res.render('moviePage', { title: movie.Title, movie });
  } catch (error) {
    // Als er een fout optreedt tijdens het renderen van de moviePage, log dan de fout in de console
    console.error("Error while rendering moviePage: ", error);
  }
});




//** ROUTE OM 'FILMS' op te slaan in de collectie 'savedMovies' **/

// Definieer een routehandler voor een POST-verzoek naar '/save-movie/:id'
router.post('/save-movie/:id', async (req, res) => {
  try {
    // Haal de film-ID op uit de verzoekparameters
    const movieId = req.params.id;
    // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const collection = client.db("Moviemates").collection("Movies");
    // Zoek naar een film in de collectie met het opgegeven ID
    const movie = await collection.findOne({ _id: ObjectId(movieId) });

    // Controleer of de film bestaat, zo niet, gooi een foutmelding
    if (!movie) {
      throw new Error("Movie not found");
    }

    // Verkrijg de 'savedMovies'-collectie uit de 'Moviemates'-database
    const savedMoviesCollection = client.db("Moviemates").collection("Users");
    // Voeg de gevonden film toe aan de 'savedMovies'-collectie
    await savedMoviesCollection.insertOne(movie.Title);

    // Stuur de gebruiker terug naar de hoofdpagina na het opslaan van de film
    res.redirect('/');
  } catch (error) {
    // Als er een fout optreedt tijdens het opslaan van de film, log dan de fout in de console
    console.error("Error while saving movie: ", error);
    // Stuur een 500-foutstatus (interne serverfout) met een foutmelding
    res.status(500).send("Kon de film niet opslaan");
  }
});




//** ROUTE OM OPGESLAGEN FILMS OP TE HALEN VAN DE DATABASE **/

// Definieer een route voor het ophalen van opgeslagen films met de GET-methode op het pad '/saved-movies'
router.get('/saved-movies', async (req, res) => {
  try {
    // Probeer verbinding te maken met de database-client
    await client.connect();
    // Verkrijg de 'savedMovies'-collectie uit de 'Moviemates'-database
    const collection = client.db("Moviemates").collection("savedMovies");
    // Zoek naar alle opgeslagen films in de collectie en zet het resultaat om naar een array
    const savedMovies = await collection.find().toArray();
    // Stuur het resultaat als JSON terug naar de client
    res.json(savedMovies);
  } catch (error) {
    // Als er een fout optreedt tijdens het ophalen van de opgeslagen films, log dan de fout in de console
    console.error("Error while fetching saved movies: ", error);
    // Stuur een HTTP-statuscode 500 (Internal Server Error) en een foutbericht naar de client
    res.status(500).send('Error while fetching saved movies');
  } finally {
    // De 'finally'-blok wordt uitgevoerd na het voltooien van de 'try' of 'catch'-blok, maar in dit geval is er geen code
    // om uit te voeren, dus de 'finally'-blok is leeg
  }
});




//** ROUTE OM DE STATUS VAN FILMS TE VERANDEREN **/

// Definieer een route voor het aanroepen van POST '/toggle-movie/:movieId'
router.post('/toggle-movie/:movieId', async (req, res) => {
  // Haal de movieId uit de route-parameters
  const movieId = req.params.movieId;
  const movie = await client.db('Moviemates').collection('Movies').findOne({ _id: new ObjectId(movieId) });
  const account = await client.db('Moviemates').collection('Users').find({ Username: 'Larsvv' }).toArray();
  const user = 'Larsvv';

  console.log(account[0].Likes);


  // Zoek de film in de savedMovies collectie met behulp van het opgegeven movieId
  const savedMovie = await client.db('Moviemates').collection('Users').findOne({ Likes: movie.Title });


  let saveDelete = {};


  if (account[0].Likes.includes(movie.Title)) {
    saveDelete = { $pull: { Likes: movie.Title } };
    // Stuur een 200 OK-status om aan te geven dat de film is verwijderd
    res.status(200).send();
  } else {
    saveDelete = { $push: { Likes: movie.Title } };
    // Stuur een 201 Created-status om aan te geven dat de film is opgeslagen
    res.status(201).send();
  }

  try {
    await client.db('Moviemates').collection('Users').updateOne({ Username: user }, saveDelete);

  } catch (err) {
    console.error(err);
    res.status(500).send('Er is een fout opgetreden bij het verwijderen van de film van de lijst met favorieten.');
  }
});





//** ROUTE OM OPGESLAGEN STATUS TE CONTROLEREN EN BEHOUDEN **/

// Definieer een route-handler voor GET-verzoeken naar '/is-movie-saved/:movieId'
router.get('/is-movie-saved/:movieId', async (req, res) => {
  // Haal het 'movieId' op uit de route-parameter
  const movieId = req.params.movieId;

  // Zoek naar de opgeslagen film in de 'savedMovies'-collectie van de 'Moviemates'-database
  // met behulp van het opgegeven 'movieId' en zet de '_id' om naar een ObjectId
  const savedMovie = await client.db('Moviemates').collection('savedMovies').findOne({ _id: new ObjectId(movieId) });

  // Als de opgeslagen film wordt gevonden, stuur dan 'true' als JSON-antwoord
  if (savedMovie) {
    res.json(true);
  } else {
    // Als de opgeslagen film niet wordt gevonden, stuur dan 'false' als JSON-antwoord
    res.json(false);
  }
});




// Exporteer het 'router'-object zodat het beschikbaar is voor andere modules die het 
// willen importeren en gebruiken
module.exports = router;
