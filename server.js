// Require DEPENDENCIES

const express = require('express');
const app = express();
const { engine } = require('ejs');
const port = 4000;
const bodyParser = require('body-parser');




//midlewear

// Stel een map "/static" beschikbaar voor statische bestanden
app.use(express.static('static'));

// Gebruik body-parser middleware om formuliergegevens te parseren
app.use(bodyParser.urlencoded({ extended: true }));

// Laad de data van de .env bestand
require('dotenv').config({ path: '.env' });

// Gebruik EJS als de standaard view engine
app.set('view engine', 'ejs');
app.set('views', './views/layout');




// Error 404

app.use(function (req, res) {
  res.locals.title = "Error 404"
  res.status(404).render('404', {
    path: 'Error'
  });
});





//connectie
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Running on port: ${PORT}`));

//database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_CONNECTION_STRING;

const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }
);

client.connect()
  .then((res) => console.log('@@-- connection established', res))
  .catch((err) => console.log('@@-- error', err));


//routes

app.get('/', (req, res) => {
  res.render('movieMatcherGenre', { title: 'Homepage' });
});


