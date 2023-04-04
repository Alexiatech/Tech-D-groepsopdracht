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

router.get('/', (req, res) => {
  res.render('signup', { title: 'sign in'});
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'register'});
});




// registreren voor de website
router.post('/submit', async (req, res) => {
  
      const userName = req.body.Username;
      const firstName = req.body.Firstname;
      const lastName = req.body.Lastname;
      const Phonenumber = req.body.Phonenumber; 
      const birthday = req.body.birthday;
      const email = req.body.email;
      const City = req.body.city;
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);

        const userdata = {
          Username: userName,
          Firstname: firstName,
          Lastname: lastName,
          Phonenumber: Phonenumber,
          password: hashedPassword,
          city: City,
          email: email,
          dateOfBirth: birthday,
          Likes: []
        };

        console.log(userdata);
        await moviesUser.insertOne(userdata);

         // Maak sessie aan voor de gebruiker bij het registreren
        req.session.user = userdata;

        // redirect the user to the confirmation page
        res.redirect('/');

      
    });


    


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


    

