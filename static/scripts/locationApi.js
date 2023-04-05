function getLocation() { // Controleer of geolocatie wordt ondersteund door de browser

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition) // Als geolocatie wordt ondersteund, haal de huidige locatie op en roep de functie showPosition aan
	} else {
		x.innerHTML = 'Geolocation is not supported by this browser.' // Als geolocatie niet wordt ondersteund, laat een bericht zien aan de gebruiker
	}
}

function showPosition(pos) {
	
	console.log(pos.coords) // Toon de coördinaten van de locatie in de console

	document.querySelector ( // Verberg het 4e label in het formulier in de sectie van de hoofdpagina
		'main section:nth-of-type(2) form label:nth-of-type(4)'
	).style.display = 'none'

	document.querySelector ( // Verberg het 4e input in het formulier in de sectie van de hoofdpagina
		'main section:nth-of-type(2) form input:nth-of-type(4)'
	).style.display = 'none'

	const map = L.map('map').setView ( // Maak een nieuwe Leaflet kaart aan met de coördinaten van de huidige locatie
		[pos.coords.latitude, pos.coords.longitude],
		13
	)

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // Voeg een OpenStreetMap-tegel-laag toe aan de kaart
		maxZoom: 19,
		attribution: 'My city',
	}).addTo(map)

	const locationData = { // Maak een object aan met de locatiegegevens
		latitude: pos.coords.latitude,
		longitude: pos.coords.longitude,
	}

	fetch ( // Gebruik Nominatim van OpenStreetMap om de locatiegegevens op te halen en de locatie naam in het inputveld te plaatsen
		`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${locationData.latitude}&lon=${locationData.longitude}`
	)
		.then((response) => response.json())
		.then((data) => {
			const locationName = data.address.city || data.address.town || data.address.village || 'Unknown location'
			document.querySelector('#locationName').value = locationName
		})
		.catch((error) => {
			console.error('Error with saving data: ', error)
		})

	document.querySelector('.location').style.height = '18em' // Pas de hoogte van de .location div aan
	document.querySelector('.location .location-text label').style.display = 'block' // Laat label weer zien
}

getLocation() // Roep de getLocation functie aan om de locatie op te halen


