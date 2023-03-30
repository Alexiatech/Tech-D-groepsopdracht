const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware om CSS-bestanden te serveren met het juiste MIME-type
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));

// Voeg hier je andere routes toe

module.exports = router;
