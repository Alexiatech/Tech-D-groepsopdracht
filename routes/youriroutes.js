const { client } = require('../server.js');
const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// MOVIEMATCHER ROUTE

router.get('/moviematcher/genre', (req, res) => {
  

  res.render('movieMatcherGenre', { title: 'Homepage' });
});

router.post('/submit', (req, res) => {
  const selectedGenres = req.body.genrePicker || req.session.selectedGenres;
  const selectedDecades = req.body.decadePicker || req.session.selectedDecades;
  const selectedLanguages = req.body.languagePicker || req.session.languageDecades;

  // Save the selected genres and decades in session variables
  req.session.selectedGenres = selectedGenres;
  req.session.selectedDecades = selectedDecades;
  req.session.selectedLanguages = selectedLanguages;

  console.log(selectedGenres, "------", selectedDecades, "-------", selectedLanguages)
  if (req.query.from === 'decade') {
    res.redirect('/moviematcher/language?from=decade');
  }

  if (req.query.from === 'genre') {
    res.redirect('/moviematcher/decade?from=genre');
  }

  if (req.query.from === 'language') {
    res.redirect('/moviematcher/result?from=language');
  }

});

router.get('/moviematcher/decade', (req, res) => {
  res.render('movieMatcherDecade', { title: 'Homepage' });
});

router.get('/moviematcher/language', (req, res) => {
  res.render('movieMatcherLanguage', { title: 'Homepage' });
});

router.get('/moviematcher/result', async (req, res) => {
  // Connect to the database
  // await client.connect();

  // // Get the movies collection
  // const moviesCollection = client.db('Moviemates').collection('Movies');

  // // Find all movies
  // const movies = await moviesCollection.find().toArray();

  res.render('moviematcherResult', {});
});

module.exports = router;


