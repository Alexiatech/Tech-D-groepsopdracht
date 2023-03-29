require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
app.use(express.static('static'));
const { engine } = require('ejs');
app.use(express.urlencoded({ extended: true }));





//connectie
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Running on port: ${PORT}`));





//ejs
app.set('view engine', 'ejs');
app.set('views', './views/layout');





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


