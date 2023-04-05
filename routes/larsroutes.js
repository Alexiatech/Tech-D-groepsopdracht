// INLADEN PACKAGES EN MODULES
const { client } = require('../server');
const express = require('express');
const router = express.Router();
const path = require('path');




// LIKES GET
router.get('/likes/:username', async (req, res) => {

  const db = client.db('Moviemates');
  req.session.gebruikersnaam = req.params.username;
  const user = req.params.username;
  const account = await db.collection('Users').find({ Username: req.params.username }).toArray();
  const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes } }).toArray();

  console.log(user);

  for (let i = 0; i < likedMovies.length; i++) {
    const movie = likedMovies[i];
    console.log(likedMovies[0]);
  }

  res.render('likedMovies', { title: 'Likes', data: likedMovies, username: account[0].Username, user });
});




// DELETE MOVIES POST
router.post('/deleteMovie/:username', async (req, res) => {
  
  const db = client.db('Moviemates');
  let titles = req.body.movie; 
  const user = req.params.username;
  const account = await db.collection('Users').find({ Username: req.params.username }).toArray();
  const likedMovies = await db.collection('Movies').find({ Title: { $in: account[0].Likes.filter((title) => !titles.includes(title)) } }).toArray();

  console.log(user);
  console.log(titles);

  let query = {};

  if (Array.isArray(titles)) {
    query = { $pull: { Likes: { $in: titles } } };
  } else {
    query = { $pull: { Likes: titles } };
  }

  console.log(user);
  console.log(titles);

  try {
    await db.collection('Users').updateOne({ Username: user }, query);
    res.render('likedMovies', { title: 'Likes', data: likedMovies, username: account[0].Username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Er is een fout opgetreden bij het verwijderen van de film van de lijst met favorieten.');
  }
});




// ROUTER EXPORTEREN
module.exports = router;


