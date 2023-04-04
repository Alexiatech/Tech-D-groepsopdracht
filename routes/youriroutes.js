const express = require('express');
const router = express.Router();
const path = require('path');
const { client } = require('../server');





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

// router.get('/moviematcher/decade', (req, res) => {
//   res.render('movieMatcherDecade', { title: 'Homepage' });
// });

router.get('/moviematcher/language', (req, res) => {
  res.render('movieMatcherLanguage', { title: 'Homepage' });
});




router.post('/moviematcher/submit', (req, res) => {
  const selectedGenres = req.body.genrePicker || req.session.selectedGenres;
  // const selectedDecades = req.body.decadePicker || req.session.selectedDecades;
  const selectedLanguages = req.body.languagePicker || req.session.selectedLanguages;

  // Save the selected genres and decades in session variables
  req.session.selectedGenres = selectedGenres;
  // req.session.selectedDecades = selectedDecades;
  req.session.selectedLanguages = selectedLanguages;

  console.log(selectedGenres, "-------", selectedLanguages)
  if (req.query.from === 'genre') {
    res.redirect('/moviematcher/language?from=genre');
  }

  // if (req.query.from === 'genre') {
  //   res.redirect('/moviematcher/decade?from=genre');
  // }

  if (req.query.from === 'language') {
    res.redirect('/moviematcher/result?from=language');
  }
});




router.get('/moviematcher/result', async (req, res) => {

  // Retrieve the selected genres, decades, and languages from session variables
  const selectedGenres = req.session.selectedGenres;
  // const selectedDecades = req.session.selectedDecades;
  const selectedLanguages = req.session.selectedLanguages;

  // Get the movies collection
  const moviesCollection = client.db('Moviemates').collection('Movies');

  const genresArray = Array.isArray(selectedGenres) ? selectedGenres : [selectedGenres];
  // const decadesArray = Array.isArray(selectedDecades) ? selectedDecades : [selectedDecades];
  const languagesArray = Array.isArray(selectedLanguages) ? selectedLanguages : [selectedLanguages];
  
  const movies = await moviesCollection.find({
    $and: [
      { "Genre": { $in: genresArray } },
      // { "Decade": { $in: decadesArray } },
      { "Language": { $in: languagesArray } }
    ]
  }).toArray();

  console.log("Selected Genres:", selectedGenres);
console.log("Genres Array:", genresArray);
console.log("Movies:", movies);

  res.render('moviematcherResult', { movies });
});




module.exports = router;


