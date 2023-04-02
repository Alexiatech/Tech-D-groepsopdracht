// load packages and modules
const { client } = require('../server');
const express = require('express');
const router = express.Router();
const path = require('path');




// load static files
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), { setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
}}));




// profile POST
router.post('/profile', async (req, res) => { 
	console.log(req.body);

	const {
		firstName, 
		lastName,
		dateOfBirth, 
		email, 
		phoneNumber, 
		password
    } = req.body;  

	const collection = client.db('Moviemates').collection('Users');

	await collection.findOneAndUpdate({}, {
		$set: {
			firstName: firstName, 
			lastName: lastName,
			dateOfBirth: dateOfBirth, 
			email: email, 
			phoneNumber: phoneNumber, 
			password: password
    	}
	});

	res.redirect('/profile'); 
});




// profile GET
router.get('/profile', onProfile);

async function onProfile(req, res) { 
	const collection = client.db('Moviemates').collection('Users'); 
	const profile = await collection.findOne({}); 

	res.render('profile', {
		profile    
	});
};




// edit profile GET
router.get('/editProfile', editProfile); 

async function editProfile(req, res) {
	const collection = client.db('Moviemates').collection('Users'); 
	const profile = await collection.findOne(); 

	res.render('editProfile', { 
		profile    
	});
};




// export router module
module.exports = router;
