// INLADEN PACKAGES EN MODULES
const express = require('express');
const router = express.Router();
const path = require('path');
const { client } = require('../server');




// MIDDELWARE OM CSS TE SERVEREN MET JUISTE MIME-TYPE
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));




// MOVIEMATCHER GET
router.get('/moviematcher/genre', (req, res) => {
  res.render('movieMatcherGenre', { title: 'Homepage' });
});

// router.get('/moviematcher/decade', (req, res) => {
//   res.render('movieMatcherDecade', { title: 'Homepage' });
// });

router.get('/moviematcher/language', (req, res) => {
  res.render('movieMatcherLanguage', { title: 'Homepage' });
});




// MOVIEMATCHER POST
router.post('/moviematcher/submit', (req, res) => {

  const selectedGenres = req.body.genrePicker || req.session.selectedGenres; // const selectedDecades = req.body.decadePicker || req.session.selectedDecades;
  const selectedLanguages = req.body.languagePicker || req.session.selectedLanguages;

  req.session.selectedGenres = selectedGenres; // Save the selected genres and decades in session variables
  req.session.selectedLanguages = selectedLanguages; // req.session.selectedDecades = selectedDecades;

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




// MOVIEMATCHER RESULT GET
router.get('/moviematcher/result', async (req, res) => {

  const selectedGenres = req.session.selectedGenres; // Retrieve the selected genres, and languages from session variables
  const selectedLanguages = req.session.selectedLanguages;
  const moviesCollection = client.db('Moviemates').collection('Movies'); // Get the movies collection
  const genresArray = Array.isArray(selectedGenres) ? selectedGenres : [selectedGenres]; // const decadesArray = Array.isArray(selectedDecades) ? selectedDecades : [selectedDecades];
  const languagesArray = Array.isArray(selectedLanguages) ? selectedLanguages : [selectedLanguages];

  const profileCollection = client.db('Moviemates').collection('Users'); 
	const profile = await profileCollection
		.find()
		.sort({ _id: -1 })
		.limit(1)
		.toArray();

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

  res.render('moviematcherResult', { movies, profile: profile[0] });
});




// ROUTER EXPORTEREN
module.exports = router;


