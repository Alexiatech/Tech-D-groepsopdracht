// Require DEPENDENCIES
const express = require('express');
const app = express();
const { engine } = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 4000;

// Middleware
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config({ path: '.env' });
app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true
}));


// Gebruik EJS als de standaard view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Connectie
const PORT = process.env.PORT || port;
app.listen(PORT, console.log(`Running on port: ${PORT}`));

// Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_CONNECTION_STRING;

const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }
);

client.connect()
  .then((res) => console.log('@@-- connection established', res))
  .catch((err) => console.log('@@-- error', err));

// Importeer routebestanden
const alexiaRoutes = require('./routes/alexiaroutes');
const larsRoutes = require('./routes/larsroutes');
const lynnRoutes = require('./routes/lynnroutes');
const thijmenRoutes = require('./routes/thijmenroutes');
const youriRoutes = require('./routes/youriroutes');
const algemeneroutes = require('./routes/algemeneroutes');

// Gebruik de geïmporteerde routes als middleware
app.use(alexiaRoutes);
// app.use(larsRoutes);
app.use(lynnRoutes);
app.use(thijmenRoutes);
app.use(youriRoutes);
app.use(algemeneroutes);

app.get('/moviematcher/result', async (req, res) => {

  // // Get the movies collection
  const moviesCollection = client.db('Moviemates').collection('Movies');
  const moviesCollectionFind = moviesCollection.find();
  const moviesData = await moviesCollectionFind.toArray();
  console.log(moviesData);

  // // Find all movies
  // const movies = await moviesCollection.find().toArray();

  res.render('moviematcherResult', {});
});

// Liked pagina route
app.get('/likes/:username', async (req, res) => {

  const db = client.db('Moviemates');
  const user = parseInt(req.params.username);
  const account = await db.collection('Users').find({ Username: req.params.username }).toArray();
  const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes } }).toArray();

  //loop om alle films uit de array te halen
  for (let i = 0; i < likedMovies.length; i++) {
    const movie = likedMovies[i];
    console.log(likedMovies[0]);
  }

  res.render('likedMovies', { title: 'Likes', data: likedMovies, username: account[0].Username });
});

// Delete movies route
app.post('/deleteMovie/:username', async (req, res) => {
  const db = client.db('Moviemates');
  let titles = req.body.movie; // veronderstel dat dit een array is van titels die verwijderd moeten worden
  const user = req.params.username;
  const account = await db.collection('Users').find({ Username: req.params.username }).toArray();
  const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes.filter((title) => !titles.includes(title)) } }).toArray();

  console.log(user);
  console.log(titles);

  try {
    await db.collection('Users').updateOne({ Username: user }, { $pull: { Likes: { $in: titles } } });

    res.render('likedMovies', { title: 'Likes', data: likedMovies, username: account[0].Username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Er is een fout opgetreden bij het verwijderen van de film van de lijst met favorieten.');
  }
});


// Error 404
app.use(function (req, res) {
  res.locals.title = "Error 404"
  res.status(404).render('404', {
    path: 'Error'
  });
});



module.exports = { app, client };
