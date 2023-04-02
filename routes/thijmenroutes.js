const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const path = require('path');
const { client } = require('../server');
// Laat node-fetch inladen
let fetch;

async function getFetch() {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  return fetch;
}



// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// Functie om films op te halen op basis van genre
async function getMoviesByGenre(genre) {
  try {
    await client.connect();
    const collection = client.db("Moviemates").collection("Movies");
    const movies = await collection.find({ Genre: genre }).toArray();
    return movies;
  } catch (error) {
    console.error("Error while fetching movies: ", error);
  } finally {
 
  }
}

// HOME ROUTE

// Homepagina
router.get('/', async (req, res) => {
  try {
    const actionMovies = await getMoviesByGenre("Action");
    const cartoonMovies = await getMoviesByGenre("Cartoon");
    const horrorMovies = await getMoviesByGenre("Horror");
    const sportMovies = await getMoviesByGenre("Sport");

    // Haal opgeslagen films op met behulp van de /saved-movies route
    const fetchInstance = await getFetch();
    const savedMoviesResponse = await fetchInstance('http://localhost:4000/saved-movies');
    const savedMovies = await savedMoviesResponse.json();

    res.render('home', {
      title: 'Homepage',
      savedMovies: savedMovies,
      actionMovies,
      cartoonMovies,
      horrorMovies,
      sportMovies
    });
  } catch (error) {
    console.error("Error while rendering home: ", error);
  }
});

// MoviePage route
router.get('/movie/:id', async (req, res) => {
  try {
    const collection = client.db("Moviemates").collection("Movies");
    const movie = await collection.findOne({ _id: new ObjectId(req.params.id) });
    
    res.render('moviePage', { title: movie.Title, movie });
  } catch (error) {
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