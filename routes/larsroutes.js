const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// Liked pagina route
router.get('/likes', async (req, res) => {
  res.render('likedMovies', { title: 'Likes' });
  const db = client.db('Moviemates').collection('Movies');
  const zoekKeukens = await db.find({}).toArray();
  res.render('filter', { layout: 'index', title: 'Filter', data: zoekKeukens });
});

module.exports = router;
