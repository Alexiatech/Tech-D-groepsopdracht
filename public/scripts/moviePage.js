// STERRENBEOORDELING FUNCTIE

// Functie om de geselecteerde beoordeling naar de server te sturen
function stuurBeoordeling(beoordeling) {
  
    console.log("Beoordeling verzonden: " + beoordeling);
  }
  
  // Verkrijg de beoordelingssterren container
  const beoordelingsSterrenContainer = document.getElementById('beoordelingsSterren');
  
  // Voeg een event listener toe voor de 'change'-gebeurtenis
  beoordelingsSterrenContainer.addEventListener('change', (e) => {
    // Controleer of het doel van het event een invoerveld is
    if (e.target.tagName.toLowerCase() === 'input') {
      // Verkrijg de geselecteerde beoordeling
      const geselecteerdeBeoordeling = parseInt(e.target.id.slice(2));
  
      // Roep de stuurBeoordeling-functie aan met de geselecteerde beoordeling
      stuurBeoordeling(geselecteerdeBeoordeling);
    }
  });

// DE TEKST OP DE DETAILPAGINA "READ MORE

const readMoreBtn = document.querySelector('.read-more');
const readLessBtn = document.querySelector('.read-less');
const moreText = document.querySelector('.more-text');
const showLessBtn = document.querySelector('.show-less-btn');

// Update de 'click' eventlistener voor readMoreBtn
readMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moreText.style.display = 'block';
    readMoreBtn.style.display = 'none';
    readLessBtn.style.display = 'block'; // Voeg deze regel toe
});

readLessBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moreText.style.display = 'none';
    readMoreBtn.style.display = 'block';
    readLessBtn.style.display = 'none';
});

showLessBtn.addEventListener('click', () => {
    moreText.style.display = 'none';
    readMoreBtn.style.display = 'block';
});

  
  