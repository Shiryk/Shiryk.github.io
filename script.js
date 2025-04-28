document.addEventListener('DOMContentLoaded', function() {
  var darkModeToggle = document.getElementById('dark-mode-toggle');

  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });

  const data = [
    {
        "name": "Tuning",
        "value": 0
    },
    {
        "name": "Reparatur",
        "value": 4000
    },
    {
        "name": "Anmeldung",
        "value": 10000
    },
    {
        "name": "Anfahrt",
        "value": 0
    },
    {
        "name": "Sonstiges",
        "value": 0
    }
  ];

  var select = document.createElement('select');
  var defaultOption = document.createElement('option');
  defaultOption.text = 'Select';
  select.add(defaultOption);
  
  data.forEach(function(item) {
    var option = document.createElement('option');
    option.value = item.value;
    option.text = item.name;
    select.add(option);
  });
  
  var itemsDiv = document.getElementById('items');
  itemsDiv.appendChild(select);
  
  select.addEventListener('change', function() {
    var selectedOption = select.options[select.selectedIndex];
    if (selectedOption.value !== '') {
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
      select.selectedIndex = 0;
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
    
    if (customer === 'Police Department') {
      // Zeige Prompt mit vorausgefülltem "PD-"
      var badgeNumber = prompt('Bitte geben Sie die Dienstnummer ein:', 'PD-');
      
      // Prüfe ob eine Nummer eingegeben wurde und ob sie mit "PD-" beginnt
      if (!badgeNumber || badgeNumber === 'PD-') {
        alert('Dienstnummer ist erforderlich für Police Department');
        this.value = 'Private';
        badgeDisplay.textContent = '';
        return;
      }
      
      // Stelle sicher, dass "PD-" am Anfang steht
      if (!badgeNumber.startsWith('PD-')) {
        badgeNumber = 'PD-' + badgeNumber;
      }
      
      this.setAttribute('data-badge', badgeNumber);
      badgeDisplay.textContent = `#${badgeNumber}`;
    } else {
      this.removeAttribute('data-badge');
      badgeDisplay.textContent = '';
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
    listItem.appendChild(document.createTextNode(obj.name));
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
  
  if (customer === 'Police Department') {
    var badgeNumber = customerDropdown.getAttribute('data-badge');
    customer = `Police Department (${badgeNumber})`;
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
          inline: true
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
          name: "Multiplikator",
          value: `${((multiplier * 100) - 100)}%`,
          inline: true
        },
        {
          name: "Gesamtbetrag",
          value: `$${formattedSum}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  fetch('https://discord.com/api/webhooks/1309571416911511593/01VOx7FUk_9OqsbBlhsec-fKJu4DhUBSth5lBuYt38dlmpgA4qwufR5xuPjcbD6WoAPK', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookData)
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
