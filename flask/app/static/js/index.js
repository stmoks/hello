document.addEventListener('DOMContentLoaded', function() {
const capitalSearch = document.getElementById('main-chat-bar');
const countryInfo = document.getElementById('country-info');
const countryTable = document.getElementById('country-table').getElementsByTagName('tbody')[0];
const mapDiv = document.getElementById('map');
const capitals = window.citiesData;
let map;
let marker;
let countryLayer;
let detailedLayer, defaultLayer;
let currentLayer;
let selectedIndex = -1;
let isMuted = true;

capitalSearch.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();  
});



function initMap() {
    map = L.map('map').setView([0, 0], 3);
    
    // Detailed layer group
    detailedLayer = L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
        L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            opacity: 0.5
        }),
        L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            opacity: 0.3
        })
    ]);

    // Default layer (OpenStreetMap with amenities)
    defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    currentLayer = defaultLayer;
    currentLayer.addTo(map);

    map.on('click', onMapClick);
}

function switchLayer() {
    map.removeLayer(currentLayer);
    if (currentLayer === defaultLayer) {
        currentLayer = detailedLayer;
    } else {
        currentLayer = defaultLayer;
    }
    currentLayer.addTo(map);
}

function updateMap(lat, lon, cityName, countryCode, flagColors) {
    mapDiv.style.display = 'block';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px';

    if (!map) {
        initMap();
    }

    map.flyTo([lat, lon], 7, {
        duration: 2,
        easeLinearity: 0.25
    });

    if (marker) {
        map.removeLayer(marker);
    }

    if (countryLayer) {
        map.removeLayer(countryLayer);
    }

    // Custom man icon
    let manIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    marker = L.marker([lat, lon], {icon: manIcon, draggable: true}).addTo(map);
    
    marker.on('dragstart', function(e) {
        map.getContainer().style.cursor = 'grabbing';
    });

    marker.on('dragend', function(e) {
        map.getContainer().style.cursor = '';
        let newLatLng = e.target.getLatLng();
        reverseGeocode(newLatLng.lat, newLatLng.lng);
    });

    // Highlight country
    fetch(`https://nominatim.openstreetmap.org/search?country=${countryCode}&polygon_geojson=1&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                countryLayer = L.geoJSON(data[0].geojson, {
                    style: {
                        fillColor: flagColors[0],
                        fillOpacity: 0.3,
                        color: flagColors[1],
                        weight: 2
                    }
                }).addTo(map);
            }
        });

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Add mouseover event to pronounce city names
    map.on('mousemove', function(e) {
        if (!isMuted) {
            let latlng = e.latlng;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`)
                .then(response => response.json())
                .then(data => {
                    let placeName = data.name || data.address.city || data.address.town || data.address.village;
                    if (placeName) {
                        pronounceCity(placeName);
                    }
                });
        }
    });
}

function onMapClick(e) {
    let lat = e.latlng.lat.toFixed(4);
    let lng = e.latlng.lng.toFixed(4);
    reverseGeocode(lat, lng);
}

function reverseGeocode(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            let placeName = data.name || data.address.city || data.address.town || data.address.village || 'Unknown location';
            let searchBar = document.getElementById('main-chat-bar');
            
            if (placeName === 'Unknown location') {
                searchBar.style.backgroundColor = '#FFBF00'; // Amber shade
                // Find the closest known place
                fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&limit=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            placeName = `Near ${data[0].name || data[0].display_name}`;
                        }
                        searchBar.value = placeName;
                        updateCountryInfo(data[0]);
                    });
            } else {
                searchBar.style.backgroundColor = '';
                searchBar.value = placeName;
                updateCountryInfo(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateCountryInfo(data) {
    displayCountryInfo(data);
}

function displayCountryInfo(data) {
    const countryTable = document.getElementById('country-table').getElementsByTagName('tbody')[0];
    countryTable.innerHTML = '';
    const relevantInfo = {
        'name': data.name,
        'display_name': data.display_name,
        'lat': data.lat,
        'lon': data.lon,
        'type': data.type,
        'address': data.address,
        'category': data.category
    };
    for (const [key, value] of Object.entries(relevantInfo)) {
        if (value) {
            const row = countryTable.insertRow();
            const keyCell = row.insertCell(0);
            const valueCell = row.insertCell(1);
            keyCell.textContent = key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
            valueCell.textContent = typeof value === 'object' ? JSON.stringify(value) : value;
        }
    }
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
        updateMap(data.latitude_sdc, data.longitude_sdc, capital, data.country_code, data.flag_colors);
    });
}

function pronounceCity(cityName) {
    let utterance = new SpeechSynthesisUtterance(cityName);
    speechSynthesis.speak(utterance);
}

function toggleMute() {
    isMuted = !isMuted;
    let muteButton = document.getElementById('mute-button');
    muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    const layerSwitch = document.getElementById('layer-switch');
    layerSwitch.addEventListener('change', switchLayer);

    const muteButton = document.getElementById('mute-button');
    muteButton.addEventListener('click', toggleMute);
});

document.head.insertAdjacentHTML('beforeend', `
<style>
    .city-popup {
        cursor: pointer;
        padding: 5px;
        background: white;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .leaflet-grab {
        cursor: grab;
    }
    .leaflet-grabbing {
        cursor: grabbing;
    }
</style>
`);

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('city-popup')) {
        let cityName = e.target.textContent;
        console.log('Clicked on city:', cityName);
        // Here you can add any action you want to perform when a city name is clicked
    }
});

});