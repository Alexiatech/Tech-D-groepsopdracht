// const express = require('express');
// const router = express.Router();
// const path = require('path');

// // Middleware om CSS-bestanden te serveren met het juiste MIME-type
// router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
//   setHeaders: (res) => {
//     res.setHeader('Content-Type', 'text/css');
//   }
// }));

// // Liked pagina route
// router.get('/:username/likes', async (req, res) => {

//   const db = client.db('Moviemates');
//   const user = parseInt(req.params.username);
//   const likedMovies = await db.collection('Users').find({ user }).toArray();
//   // const Movies = await db.collection('Movies').find({}).toArray();
//   res.render('likedMovies', { title: 'Likes' });
// });

// module.exports = router;
