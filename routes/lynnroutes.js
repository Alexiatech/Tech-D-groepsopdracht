// INLADEN PACKAGES EN MODULES
const { client } = require('../server');
const express = require('express');
const router = express.Router();
const path = require('path');




// MIDDELWARE OM CSS TE SERVEREN MET JUISTE MIME-TYPE
router.use('/static/styles', express.static(path.join(__dirname, '../static/styles'), { setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
}}));




// PROFILE POST
router.post('/profile', async (req, res) => { 
	
	console.log(req.body);

	const {
		Firstname, 
		Lastname,
		dateOfBirth, 
		city,
		email, 
		Phonenumber, 
		password
    } = req.body;  

	const locationName = req.body.locationName || '' 

	const collection = client.db('Moviemates').collection('Users');

	await collection.findOneAndUpdate({}, {
		$set: {
			Firstname: Firstname, 
			Lastname: Lastname,
			dateOfBirth: dateOfBirth, 
			city: city,
			locationName: locationName,
			email: email, 
			Phonenumber: Phonenumber, 
			password: password
    	}
	});

	res.redirect('/profile'); 
});




// PROFILE GET
router.get('/profile', onProfile);

async function onProfile(req, res) { 

	const collection = client.db('Moviemates').collection('Users'); 
	const profile = await collection.findOne({}); 

	res.render('profile', {
		profile    
	});
};




// EDIT PROFILE GET
router.get('/editProfile', editProfile); 

async function editProfile(req, res) {

	const collection = client.db('Moviemates').collection('Users'); 
	const profile = await collection.findOne(); 

	res.render('editProfile', { 
		profile    
	});
};




// ROUTER EXPORTEREN
module.exports = router;
