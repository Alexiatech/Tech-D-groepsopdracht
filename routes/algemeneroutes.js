// INLADEN PACKAGES EN MODULES
const express = require('express');
const router = express.Router();
const path = require('path');




// MIDDELWARE OM CSS TE SERVEREN MET JUISTE MIME-TYPE
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));




// ROUTER EXPORTEREN
module.exports = router;
