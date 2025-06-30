document.addEventListener('DOMContentLoaded', function() {
  var darkModeToggle = document.getElementById('dark-mode-toggle');

  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });

  // Erstelle das zweite Dropdown first
  var productSelect = document.createElement('select');
  var productDefaultOption = document.createElement('option');
  productDefaultOption.text = 'Select';
  productSelect.add(productDefaultOption);
  
  var productDropdown = document.getElementById('product');
  productDropdown.appendChild(productSelect);
  
  // Initially hide the product dropdown
  productDropdown.style.display = 'none';

  const categoryData = [
    {
        "name": "Mitarbeitertuning",
        "value": 0,
        "products": []
    },
    {
        "name": "Reparatur",
        "value": 4000,
        "products": []
    },
    {
        "name": "Anmeldung",
        "value": 15000,
        "products": []
    },
    {
        "name": "Anfahrt",
        "value": 0,
        "products": []
    },
    {
        "name": "Sonstiges",
        "value": 0,
        "products": []
    },
    {
        "name": "Verbesserungen",
        "value": 0,
        "products": [
            {
                "name": "Fulltuning",
                "value": 100000
            },
            {
                "name": "Einzelne Verbesserung",
                "value": 25000
            }
        ]
    },
    {
        "name": "Lackierungen",
        "value": 0,
        "products": [
            {
                "name": "Farbe ohne Pearl",
                "value": 15000
            },
            {
                "name": "Farbe mit Pearl",
                "value": 20000
            },
            {
                "name": "Chameleon-Farbe",
                "value": 25000
            }
        ]
    },
    {
        "name": "Optik",
        "value": 0,
        "products": [
            {
                "name": "Amaturenbrett & Innenraum",
                "value": 10000
            },
            {
                "name": "Fenstertönung",
                "value": 5000
            },
            {
                "name": "Reifen ohne Qualm",
                "value": 10000
            },
            {
                "name": "Reifen mit Qualm",
                "value": 15000
            },
            {
                "name": "Zusatzdetails",
                "value": 3000
            },
            {
                "name": "Hupe",
                "value": 1000
            },
            {
                "name": "Kennzeichen",
                "value": 500
            },
            {
                "name": "Unterboden",
                "value": 5000
            },
            {
                "name": "Xenon ohne Farbe",
                "value": 2500
            },
            {
                "name": "Xenon mit Farbe",
                "value": 5000
            },
            {
                "name": "Sticker",
                "value": 0
            }
        ]
    },
    {
        "name": "Services",
        "value": 0,
        "products": [
            {
                "name": "Reparatur",
                "value": 7500
            },
            {
                "name": "Autowäsche",
                "value": 0
            },
            {
                "name": "Radio inkl. einbauen",
                "value": 5000
            }
        ]
    },
    {
        "name": "Shop",
        "value": 0,
        "products": [
            {
                "name": "Reparaturkasten / Rep.Kit",
                "value": 10000
            },
            {
                "name": "Schwämme",
                "value": 2000
            }
        ]
    }
  ];

  var select = document.createElement('select');
  var defaultOption = document.createElement('option');
  defaultOption.text = 'Select';
  select.add(defaultOption);
  
  categoryData.forEach(function(item) {
    var option = document.createElement('option');
    option.value = item.value;
    option.text = item.name;
    select.add(option);
  });
  
  var categoryDiv = document.getElementById('category');
  categoryDiv.appendChild(select);
  
  // Function to update the product dropdown based on selected category
  function updateProductDropdown(selectedCategory) {
    // Clear existing options except the default one
    while (productSelect.options.length > 1) {
      productSelect.remove(1);
    }

    // Find the selected category and its products
    const selectedCategoryData = categoryData.find(cat => cat.name === selectedCategory);
    if (selectedCategoryData && selectedCategoryData.products && selectedCategoryData.products.length > 0) {
      // Show the product dropdown
      productDropdown.style.display = 'block';
      // Add products to the dropdown
      selectedCategoryData.products.forEach(function(product) {
        var option = document.createElement('option');
        option.value = product.value;
        // Use only the product name, no price in parentheses
        option.text = product.name;
        productSelect.add(option);
      });
    } else {
      // Hide the product dropdown if no products
      productDropdown.style.display = 'none';
    }
  }
  
  select.addEventListener('change', function() {
    var selectedOption = select.options[select.selectedIndex];
    if (selectedOption.value !== '') {
      // Update the product dropdown based on the selected category
      updateProductDropdown(selectedOption.text);
      
      // Find the selected category data
      const selectedCategoryData = categoryData.find(cat => cat.name === selectedOption.text);

      // Only add the category if it has NO products
      if (!selectedCategoryData.products || selectedCategoryData.products.length === 0) {
        // Für Tuning und Sonstiges einen Wert abfragen
        if (selectedOption.text === 'Tuning' || selectedOption.text === 'Sonstiges') {
          var customValue = prompt(`Bitte geben Sie den Wert für ${selectedOption.text} ein:`);
          if (customValue !== null) {
            var value = parseInt(customValue);
            if (!isNaN(value) && value >= 0) {
              addSelectedObject(selectedOption.text, value);
              calculate();
            } else {
              alert('Bitte geben Sie eine gültige positive Zahl ein.');
            }
          }
        } 
        // Für Anfahrt Kilometer abfragen
        else if (selectedOption.text === 'Anfahrt') {
          var kilometers = prompt('Bitte geben Sie die Anzahl der Kilometer ein:');
          if (kilometers !== null) {
            var kmValue = parseInt(kilometers);
            if (!isNaN(kmValue) && kmValue >= 0) {
              var calculatedValue = kmValue * 1000; // Kilometer * 1000
              addSelectedObject(`Anfahrt (${kmValue}km)`, calculatedValue);
              calculate();
            } else {
              alert('Bitte geben Sie eine gültige positive Zahl für die Kilometer ein.');
            }
          }
        } 
        // Für alle anderen Optionen normal fortfahren
        else {
          addSelectedObject(selectedOption.text, parseInt(selectedOption.value));
          calculate();
        }
      }
      select.selectedIndex = 0;
    } else {
      // Hide product dropdown when "Select" is chosen
      productDropdown.style.display = 'none';
    }
  });

  document.getElementById('details-dropdown').addEventListener('change', function() {
    calculate();
  });

  document.getElementById('clear-all-button').addEventListener('click', function() {
    selectedObjects = [];
    updateSelectedObjectsList();
    calculate();
  });

  document.getElementById('customer-dropdown').addEventListener('change', function() {
    var customer = this.value;
    var badgeDisplay = document.getElementById('badge-display');
    
    if (customer === 'Privatkunde') {
      var customerName = prompt('Bitte geben Sie den Namen des Kunden ein:');
      if (!customerName) {
        alert('Name ist erforderlich für Privatkunden');
        this.value = 'Privatkunde';
        badgeDisplay.textContent = '';
        return;
      }
      this.setAttribute('data-customer-name', customerName);
      badgeDisplay.textContent = `${customerName}`;
    } 
    else if (customer === 'Vertragskunde') {
      var fractionName = prompt('Bitte geben Sie den Fraktionsnamen ein:');
      var customerName = prompt('Bitte geben Sie den Namen des Kunden ein:');
      if (!fractionName || !customerName) {
        alert('Fraktionsname und Kundenname sind erforderlich für Vertragskunden');
        this.value = 'Privatkunde';
        badgeDisplay.textContent = '';
        return;
      }
      this.setAttribute('data-fraction-name', fractionName);
      this.setAttribute('data-customer-name', customerName);
      badgeDisplay.textContent = `${fractionName} - ${customerName}`;
    } 
    else {
      this.removeAttribute('data-fraction-name');
      this.removeAttribute('data-customer-name');
      badgeDisplay.textContent = '';
    }
  });

  // Füge diese neue Funktion am Anfang hinzu
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Hole den Benutzernamen aus der URL
  const userName = getUrlParameter('mitglied') || 'Unbekannt';

  console.log("@@@@@@@@@@@@@@@@@@@@@@" + userName);

  // Event Listener für das zweite Dropdown
  productSelect.addEventListener('change', function() {
    var selectedOption = productSelect.options[productSelect.selectedIndex];
    if (selectedOption.value !== '') {
      var cleanName = selectedOption.text; // Now this is just the product name

      if (cleanName === 'Sticker') {
        var customStickerValue = prompt('Bitte geben Sie den Preis für Sticker ein:');
        if (customStickerValue !== null) {
          var value = parseInt(customStickerValue);
          if (!isNaN(value) && value >= 0) {
            var roundedValue = Math.ceil(value / 1000) * 1000;
            addSelectedObject(cleanName, roundedValue);
            calculate();
          } else {
            alert('Bitte geben Sie eine gültige positive Zahl ein.');
          }
        }
      } else {
        addSelectedObject(cleanName, parseInt(selectedOption.value));
        calculate();
      }
      productSelect.selectedIndex = 0;
    }
  });
});

var selectedObjects = [];

function addSelectedObject(name, value) {
  var existingObjectIndex = selectedObjects.findIndex(obj => obj.name === name);
  if (existingObjectIndex !== -1) {
    selectedObjects[existingObjectIndex].quantity++;
  } else {
    selectedObjects.push({name: name, value: value, quantity: 1});
  }
  updateSelectedObjectsList();
}

function removeSelectedObject(index) {
  selectedObjects.splice(index, 1);
  updateSelectedObjectsList();
  calculate();
}

function updateSelectedObjectsList() {
  var selectedObjectsList = document.getElementById('selected-objects');
  selectedObjectsList.innerHTML = '';
  selectedObjects.forEach(function(obj, index) {
    var listItem = document.createElement('li');
    var quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = obj.quantity;
    quantityInput.classList.add('quantity-input');
    quantityInput.addEventListener('input', function() {
      var newQuantity = parseInt(quantityInput.value);
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        if (newQuantity === 0) {
          removeSelectedObject(index);
        } else {
          selectedObjects[index].quantity = newQuantity;
          calculate();
        }
      }
    });
    listItem.appendChild(quantityInput);

    // Always show the actual value used (rounded for Sticker)
    listItem.appendChild(document.createTextNode(
      `${obj.name} ($${obj.value.toLocaleString()})`
    ));

    var removeButton = document.createElement('button');
    removeButton.innerText = 'X';
    removeButton.addEventListener('click', function() {
      removeSelectedObject(index);
    });
    listItem.appendChild(removeButton);
    selectedObjectsList.appendChild(listItem);
  });
}

function calculate() {
  var sum = 0;
  var multiplier = parseFloat(document.getElementById('details-dropdown').value);
  
  selectedObjects.forEach(function(obj) {
    // Kein Aufschlag für Reparatur, Anfahrt und Anmeldungen
    if (obj.name.startsWith('Reparatur') || obj.name.startsWith('Anfahrt') || obj.name.startsWith('Anmeldung')) {
      sum += obj.value * obj.quantity;
    } else {
      sum += obj.value * obj.quantity * multiplier;
    }
  });
  
  const formattedSum = sum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  document.getElementById('result').innerText = '$' + formattedSum;
}

function sendToDiscord() {
  var multiplier = parseFloat(document.getElementById('details-dropdown').value);
  var customerDropdown = document.getElementById('customer-dropdown');
  var customer = customerDropdown.value;
  var sum = 0;
  
  // Hole den Benutzernamen aus der URL
  const userName = new URLSearchParams(window.location.search).get('mitglied') || 'Unbekannt';
  
  // Formatiere den Kundennamen basierend auf der Auswahl
  if (customer === 'Privatkunde') {
    var customerName = customerDropdown.getAttribute('data-customer-name');
    customer = `Privatkunde (${customerName})`;
  } 
  else if (customer === 'Vertragskunde') {
    var fractionName = customerDropdown.getAttribute('data-fraction-name');
    var customerName = customerDropdown.getAttribute('data-customer-name');
    customer = `Vertragskunde: ${fractionName} - ${customerName}`;
  }
  
  selectedObjects.forEach(function(obj) {
    // Kein Aufschlag für Reparatur, Anfahrt und Anmeldungen
    if (obj.name.startsWith('Reparatur') || obj.name.startsWith('Anfahrt') || obj.name.startsWith('Anmeldung')) {
      sum += obj.value * obj.quantity;
    } else {
      sum += obj.value * obj.quantity * multiplier;
    }
  });
  
  let formattedSum = sum.toFixed(2);
  formattedSum = formattedSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  const webhookData = {
    embeds: [{
      title: "Neue Berechnung",
      color: 0x460fc5,
      fields: [
        {
          name: "Kunde",
          value: customer,
          inline: false
        },
        {
          name: "Ausgewählte Objekte",
          value: selectedObjects.map(obj => {
            let itemText;
            if (obj.name.startsWith('Anfahrt')) {
              const km = obj.name.match(/\((\d+)km\)/)[1];
              itemText = `${obj.name} ($1'000/km)`;
            } else {
              itemText = `${obj.name} x${obj.quantity} ($${obj.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} pro Stück)`;
            }
            // Füge (Kein Aufschlag) hinzu für spezielle Items
            if (obj.name.startsWith('Reparatur') || obj.name.startsWith('Anfahrt') || obj.name.startsWith('Anmeldung')) {
              itemText += ' (Kein Aufschlag)';
            }
            return itemText;
          }).join('\n') || "Keine Objekte ausgewählt",
          inline: false
        },
        {
          name: "Rabatt",
          value: `${((multiplier * 100) - 100)}%`,
          inline: true
        },
        {
          name: "Gesamtbetrag",
          value: `$${formattedSum}`,
          inline: true
        },        
        {
          name: "Erstellt von",
          value: userName,
          inline: false
        },
      ],
      timestamp: new Date().toISOString()
    }]
  };


  const BACKEND_URL = 'https://los-santos-customs.vercel.app/api/send';
  const env = 'prod';

  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ webhookData, env })
  })
  .then(() => alert('Erfolgreich an Discord gesendet!'))
  .catch(error => {
    console.error('Error:', error);
    alert('Fehler beim Senden an Discord');
  });
}

// Event Listener für den Discord Button (füge dies zum DOMContentLoaded Event hinzu)
document.getElementById('send-to-discord').addEventListener('click', sendToDiscord);

calculate();
document.body.classList.toggle('dark-mode');
