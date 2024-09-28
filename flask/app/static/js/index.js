
document.addEventListener('DOMContentLoaded', function() {
const capitalSearch = document.getElementById('main-search-bar');
const capitalSuggestions = document.getElementById('capital-suggestions');
const countryInfo = document.getElementById('country-info');
const countryTable = document.getElementById('country-table').getElementsByTagName('tbody')[0];
const mapDiv = document.getElementById('map');
const capitals = window.capitalsData;
let map;
let selectedIndex = -1;

capitalSearch.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const filteredCapitals = capitals.filter(capital => 
        capital.toLowerCase().startsWith(searchValue)
    );

    capitalSuggestions.innerHTML = '';
    filteredCapitals.forEach((capital, index) => {
        const li = document.createElement('li');
        li.textContent = capital;
        li.addEventListener('click', function() {
            capitalSearch.value = capital;
            capitalSuggestions.innerHTML = '';
            submitCapital(capital);
        });
        capitalSuggestions.appendChild(li);
    });
    selectedIndex = -1;
});

capitalSearch.addEventListener('keydown', function(e) {
    const suggestions = capitalSuggestions.getElementsByTagName('li');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        updateSelectedSuggestion();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelectedSuggestion();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0) {
            capitalSearch.value = suggestions[selectedIndex].textContent;
            capitalSuggestions.innerHTML = '';
            submitCapital(capitalSearch.value);
        } else {
            submitCapital(this.value);
        }
    }
});

function updateSelectedSuggestion() {
    const suggestions = capitalSuggestions.getElementsByTagName('li');
    for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].classList.toggle('selected', i === selectedIndex);
    }
    if (selectedIndex >= 0) {
        suggestions[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function updateMap(lat, lon) {
    mapDiv.style.display = 'block';
    if (!map) {
        map = L.map('map').setView([lat, lon], 5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: '© Basemaps contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 5);
    }
    L.marker([lat, lon]).addTo(map);
}

function submitCapital(capital) {
    let formData = new FormData();
    formData.append('capital', capital);
    
    fetch('/submit-capital', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
        displayCountryInfo(data);
        updateMap(data.latitude_sdc, data.longitude_sdc);
    });
}

function displayCountryInfo(data) {
    countryTable.innerHTML = '';
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'latitude_sdc' && key !== 'longitude_sdc') {
            const row = countryTable.insertRow();
            const keyCell = row.insertCell(0);
            const valueCell = row.insertCell(1);
            keyCell.textContent = key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
            valueCell.textContent = value;
        }
    }
    countryInfo.style.display = 'block';
}

});