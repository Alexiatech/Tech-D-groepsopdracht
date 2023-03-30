// Require DEPENDENCIES
const express = require('express');
const app = express();
const { engine } = require('ejs');
const port = 4000;
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');


// Importeer routebestanden
const alexiaRoutes = require('./routes/alexiaroutes');
const larsRoutes = require('./routes/larsroutes');
const lynnRoutes = require('./routes/lynnroutes');
const thijmenRoutes = require('./routes/thijmenroutes');
const youriRoutes = require('./routes/youriroutes');
const algemeneroutes = require('./routes/algemeneroutes');

// Middleware
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config({ path: '.env' });

// Gebruik EJS als de standaard view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Gebruik de geïmporteerde routes als middleware
app.use(alexiaRoutes);
app.use(larsRoutes);
app.use(lynnRoutes);
app.use(thijmenRoutes);
app.use(youriRoutes);
app.use(algemeneroutes);

// Error 404
app.use(function (req, res) {
  res.locals.title = "Error 404"
  res.status(404).render('404', {
    path: 'Error'
  });
});

// Connectie
const PORT = process.env.PORT || port;
app.listen(PORT, console.log(`Running on port: ${PORT}`));

// Database

const uri = process.env.DB_CONNECTION_STRING;
console.log('URI:', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
client.connect()
.then((res) => console.log('@@-- connection established', res))
.catch((err) => console.log('@@-- error', err));


