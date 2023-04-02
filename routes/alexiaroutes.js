const { client } = require('../server');
const express = require('express');
const router = express.Router();
const path = require('path');
const {start} = require('repl');

const session = require('express-session');


const bcrypt = require ('bcrypt');





// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));


router.use(session({
  secret: 'gwzauj27y36478i3uejfjeh73ye', // dit moet een lange en willekeurige string zijn
  resave: false,
  saveUninitialized: true
}));


// Hier komen je routes
const moviesUser = client.db('Moviemates').collection('Users');

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'sign in'});
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'register'});
});

router.get('/home', (req, res) => {
  res.render('home', { title: 'Homepage'});
});


// registreren voor de website

router.post('/submit', async (req, res) => {
      const name = req.body.name;
      const birthday = req.body.birthday;
      const email = req.body.email;
      const password = req.body.password;
      // const confirmPassword = req.body.password2;
      // const error = "Password don't match";

      console.log(name, email, password, birthday);
      
      const hashedPassword = await bcrypt.hash(password, 10);

        const userdata = {
          name: name,
          pwd: hashedPassword,
          email: email,
          birthday: birthday,
        }

        console.log(userdata);
        await moviesUser.insertOne(userdata);

         // Maak sessie aan voor de gebruiker bij het registreren
        req.session.user = userdata;

        // redirect the user to the confirmation page
        res.redirect('/signup');

      
    });

    // deze werkt nog niet 


    // express session aanmelden 
    router.post('/login', async (req, res) => {
      const emailSignin = req.body.emailsign;
      const passwordSignin = req.body.passwordsign;
      console.log(moviesUser)
    
      const user = await moviesUser.findOne({ email: emailSignin });
    
      if (!user) {
        return res.render('signup', { title: 'sign in', error: 'Invalid email or password' });
      }
    
      const isMatch = await bcrypt.compare(passwordSignin, user.pwd);
    
      if (!isMatch) {
        return res.render('signup', { title: 'sign in', error: 'Invalid email or password' });
      }
    
      req.session.user = user;
    
      res.redirect('/home');
    });
    



    module.exports = router;


    

