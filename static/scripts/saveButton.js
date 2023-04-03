const saveButton = document.querySelector('#save-button') // Variable aanmaken voor #save-button
const inputValue = document.querySelectorAll('.input-value') // Variable aanmaken voor .input-value
const requiredInputs = document.querySelectorAll('.input-value[required]') 
const inputValueArray = [...inputValue] // Variable aanmaken met een array waarin de input value vast wordt gelegd
const inputWithStartValues = inputValueArray.map((inputValue) => { // inputValueArray omzetten naar een nieuwe array (inputWithStartValues)
	return { // Objecten creëren voor de huidige objecten in de loop
		inputValue: inputValue,
		value: inputValue.value,
	}
})

saveButton.disabled = true // Variable die bovenaan is gedeclareerd wordt standaard op disabled gezet
saveButton.style.backgroundColor = 'gray' // Geef button zonder veranderingen grijze kleur

inputValue.forEach((item, index) => { // Voor elke input value...

	item.addEventListener('keyup', (event) => { // Voeg een keyup eventlistener toe (check of er wordt getypt in een input field)

		const filteredArray = inputWithStartValues.filter((item) => { // inputWithStartValues filteren 
			return item.inputValue.value !== item.value // Kijken of inputValue verschilt ten opzichte van value
		})

		const isAllRequiredValid = Array.from(requiredInputs).every( // Check of alle vereiste invoervelden correct zijn ingevuld
			(requiredInput) => requiredInput.checkValidity()
		)

		if (filteredArray.length && isAllRequiredValid) {
			saveButton.disabled = false // Als de lengte van de array groter dan 0 is, dan wordt de button unlocked
			saveButton.style.backgroundColor = 'green' // Geef button groene kleur als er een verandering is gemaakt en alle vereiste input fields ingevuld zijn
		} else {
			saveButton.disabled = true // Als de lengte van de array kleiner is dan 0, dan is de button disabled
			saveButton.style.backgroundColor = 'red' // Geef button rode kleur als de vereiste input fields niet (goed) ingevuld zijn of als
		}
	})
})