const { client } = require('../server');
const express = require('express');
const router = express.Router();
const path = require('path');
const { start } = require('repl');



// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// Hier komen je routes
const moviesUser = client.db('Moviemates').collection('Users');

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'sign in' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'register' });
});




router.post('/submit', async (req, res) => {
  const name = req.body.name;
  const birthday = req.body.birthday;
  const email = req.body.email;
  const password = req.body.password;


  console.log(name, email, password, birthday);

    const userdata = {
      name: name,
      pwd: password, 
      email: email,
      birthday: birthday,
    }

    console.log(userdata);
    await moviesUser.insertOne(userdata);

    // redirect the user to the confirmation page
    res.redirect('/signup');
  
});

module.exports = router;