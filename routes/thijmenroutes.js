// INLADEN PACKAGES EN MODULES
const express = require('express');
const { ObjectId } = require('mongodb'); 
const router = express.Router(); // Creëer een router-object
const path = require('path'); // Laad de 'path'-module om met bestandspaden te werken
const { client } = require('../server'); // Importeer de client uit de server-module
let fetch; // Laad de node-fetch-module in een variabele




async function getFetch() { // Importeer de node-fetch-module als deze nog niet is geïmporteerd
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  return fetch;
}




// MIDDELWARE OM CSS TE SERVEREN MET JUISTE MIME-TYPE
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {  // Stel de headers in voor het serveren van de statische bestanden
    res.setHeader('Content-Type', 'text/css'); // Stel het 'Content-Type'-header in op 'text/css'
  }
}));




// DEFINIEEER EEN ASYNCHRONE FUNCTIE 'GETMOVIESBYGENRE' DIE EEN GENRE ALS PARAMETER ACCEPTEERT
async function getMoviesByGenre(genre) {
  try {

    await client.connect(); // Probeer verbinding te maken met de database-client

    const collection = client.db('Moviemates').collection('Movies'); // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const movies = await collection.find({ Genre: genre }).toArray(); // Zoek naar films in de collectie waar het 'Genre' overeenkomt met het gegeven genre en zet het resultaat om naar een array

    return movies; // Geef de array met gevonden films terug

  } catch (error) {
    console.error('Error while fetching movies: ', error); // Als er een fout optreedt tijdens het ophalen van de films, log dan de fout in de console
  }
}




// HOME GET
router.get('/home/:username', async (req, res) => {

  try { // Roep de 'getMoviesByGenre' functie aan voor elk genre en sla de resultaten op in constante variabelen
    
    const actionMovies = await getMoviesByGenre('Action');
    const cartoonMovies = await getMoviesByGenre('Cartoon');
    const horrorMovies = await getMoviesByGenre('Horror');
    const sportMovies = await getMoviesByGenre('Sport');
    req.session.gebruikersnaam = req.params.username;

    const db = client.db('Moviemates');
    const user = req.params.username;
    const account = await db.collection('Users').find({ Username: user }).toArray();
    const userFirstname = account[0].Firstname;
    const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes } }).toArray();

    for (let i = 0; i < likedMovies.length; i++) { // Loop om alle films uit de array te halen
      const movie = likedMovies[i];
      console.log(likedMovies[0]);
    }

    res.render('home', { // Rendert de 'home' view met de opgegeven gegevens
      title: 'Homepage', // Geef de titel door aan de view
      data: likedMovies, // Geef de opgeslagen films door aan de view
      actionMovies, // Geef de actiefilms door aan de view
      cartoonMovies, // Geef de tekenfilms door aan de view
      horrorMovies, // Geef de horrorfilms door aan de view
      sportMovies, // Geef de sportfilms door aan de view
      user,
      Firstname: userFirstname
    });
  } catch (error) {
    console.error('Error while rendering home: ', error); // Als er een fout optreedt tijdens het renderen van de homepagina, log dan de fout in de console
  }
});




// MOVIEPAGE GET
router.get('/movie/:id', async (req, res) => {
  const user = req.session.gebruikersnaam;
  try {

    const collection = client.db('Moviemates').collection('Movies'); // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const movie = await collection.findOne({ _id: new ObjectId(req.params.id) }); // Zoek naar de film in de collectie met een overeenkomend '_id'-veld 
    // en zet het ObjectId van de route-parameter om naar een ObjectId type

    res.render('moviePage', { title: movie.Title, movie, user }); // Render de 'moviePage' view met de gevonden film en stel de titel in op de filmtitel

  } catch (error) {
    console.error('Error while rendering moviePage: ', error); // Als er een fout optreedt tijdens het renderen van de moviePage, log dan de fout in de console
  }
});




// SAVE MOVIE POST
router.post('/save-movie/:id', async (req, res) => {
  try {

    const movieId = req.params.id; // Haal de film-ID op uit de verzoekparameters
    const collection = client.db('Moviemates').collection('Movies'); // Verkrijg de 'Movies'-collectie uit de 'Moviemates'-database
    const movie = await collection.findOne({ _id: ObjectId(movieId) }); // Zoek naar een film in de collectie met het opgegeven ID

    if (!movie) { // Controleer of de film bestaat, zo niet, gooi een foutmelding
      throw new Error('Movie not found');
    }

    const savedMoviesCollection = client.db('Moviemates').collection('Users'); // Verkrijg de 'savedMovies'-collectie uit de 'Moviemates'-database
    await savedMoviesCollection.insertOne(movie.Title); // Voeg de gevonden film toe aan de 'savedMovies'-collectie

    res.redirect('/'); // Stuur de gebruiker terug naar de hoofdpagina na het opslaan van de film
  } catch (error) {
    console.error('Error while saving movie: ', error); // Als er een fout optreedt tijdens het opslaan van de film, log dan de fout in de console
    res.status(500).send('Kon de film niet opslaan'); // Stuur een 500-foutstatus (interne serverfout) met een foutmelding
  }
});




// SAVE MOVIE GET
router.get('/saved-movies', async (req, res) => {
  try {

    await client.connect(); // Probeer verbinding te maken met de database-client
    const collection = client.db('Moviemates').collection('savedMovies'); // Verkrijg de 'savedMovies'-collectie uit de 'Moviemates'-database
    const savedMovies = await collection.find().toArray(); // Zoek naar alle opgeslagen films in de collectie en zet het resultaat om naar een array

    res.json(savedMovies); // Stuur het resultaat als JSON terug naar de client

  } catch (error) {
    console.error('Error while fetching saved movies: ', error); // Als er een fout optreedt tijdens het ophalen van de opgeslagen films, log dan de fout in de console
    res.status(500).send('Error while fetching saved movies'); // Stuur een HTTP-statuscode 500 (Internal Server Error) en een foutbericht naar de client
  } finally { // De 'finally'-blok wordt uitgevoerd na het voltooien van de 'try' of 'catch'-blok, maar in dit geval is er geen code
    // om uit te voeren, dus de 'finally'-blok is leeg
  }
});




// TOOGLE MOVIE POST
router.post('/toggle-movie/:movieId', async (req, res) => {

  const movieId = req.params.movieId; // Haal de movieId uit de route-parameters
  const user = req.session.gebruikersnaam;
  const movie = await client.db('Moviemates').collection('Movies').findOne({ _id: new ObjectId(movieId) });
  const account = await client.db('Moviemates').collection('Users').find({ Username: user }).toArray();

  console.log(account[0].Likes);

  const savedMovie = await client.db('Moviemates').collection('Users').findOne({ Likes: movie.Title }); // Zoek de film in de savedMovies collectie met behulp van het opgegeven movieId

  let saveDelete = {};

  if (account[0].Likes.includes(movie.Title)) {
    saveDelete = { $pull: { Likes: movie.Title } };
    res.status(200).send(); // Stuur een 200 OK-status om aan te geven dat de film is verwijderd
  } else {
    saveDelete = { $push: { Likes: movie.Title } };
    res.status(201).send(); // Stuur een 201 Created-status om aan te geven dat de film is opgeslagen
  }

  try {
    await client.db('Moviemates').collection('Users').updateOne({ Username: user }, saveDelete);

  } catch (err) {
    console.error(err);
    res.status(500).send('Er is een fout opgetreden bij het verwijderen van de film van de lijst met favorieten.');
  }
});





// IS MOVIE SAVED GET
router.get('/is-movie-saved/:movieId', async (req, res) => {
  
  const movieId = req.params.movieId; // Haal het 'movieId' op uit de route-parameter
  const savedMovie = await client.db('Moviemates').collection('savedMovies').findOne({ _id: new ObjectId(movieId) }); // Zoek naar de opgeslagen film in de 'savedMovies'-collectie van de 'Moviemates'-database
  // met behulp van het opgegeven 'movieId' en zet de '_id' om naar een ObjectId

  if (savedMovie) { // Als de opgeslagen film wordt gevonden, stuur dan 'true' als JSON-antwoord
    res.json(true);
  } else {
    res.json(false); // Als de opgeslagen film niet wordt gevonden, stuur dan 'false' als JSON-antwoord
  }
});




// ROUTER EXPORTEREN
module.exports = router;
