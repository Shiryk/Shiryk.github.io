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
  var multiplier = parseInt(document.getElementById('details-dropdown').value);
  selectedObjects.forEach(function(obj) {
    sum += obj.value * obj.quantity * multiplier;
  });
  document.getElementById('result').innerText = sum;
}

calculate();
document.body.classList.toggle('dark-mode');
