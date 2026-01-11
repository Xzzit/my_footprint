// --- 1. Map Initialization ---
// Initialize Leaflet map centered roughly on China
const map = L.map('map').setView([35.0, 105.0], 4);

// Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// --- 2. State Management ---
let lifeEvents = [];      // Stores all event data from JSON
let currentIndex = 0;     // Tracks the current event index
let currentMarker = null; // Reference to the active marker on map

// --- 3. Data Loading ---
// Fetch JSON data and initialize the first event
function loadLifeData() {
    // Add timestamp to prevent browser caching during development
    fetch('data.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            lifeEvents = data;
            console.log(`Data loaded: ${lifeEvents.length} events found.`);
            
            // Render the first event immediately
            showEvent(currentIndex);
        })
        .catch(error => console.error('Failed to load data:', error));
}

// --- 4. Core Rendering Logic ---
// Renders the marker and handles camera movement for a specific event
function showEvent(index) {
    const item = lifeEvents[index];
    
    // A. Cleanup: Remove the previous marker if it exists
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // B. Create Marker: Add new marker at coordinates
    currentMarker = L.marker(item.coordinates).addTo(map);

    // C. Content: Prepare HTML content for the popup
    const popupContent = `
        <div class="my-popup-content">
            <div class="popup-date">${item.date}</div>
            <div class="popup-title">${item.title}</div>
            <div class="popup-desc">${item.description}</div>
        </div>
    `;
    currentMarker.bindPopup(popupContent);

    // D. Smart Camera Transition (The "Director" Logic)
    const targetZoom = item.zoom || 7;
    const startLatLng = map.getCenter();
    const targetLatLng = L.latLng(item.coordinates);
    
    // Calculate distance (meters) and check if target is visible in current viewport
    const distance = map.distance(startLatLng, targetLatLng);
    const isVisible = map.getBounds().contains(targetLatLng);
    const isZoomChanged = map.getZoom() !== targetZoom;

    // Scenario 1: Stationary (Distance < 10m AND Zoom unchanged)
    // Action: No camera movement, just open popup. Prevents jitter.
    if (distance < 10 && !isZoomChanged) {
        currentMarker.openPopup();
    }
    
    // Scenario 2: Long Distance / Off-screen (Target not visible)
    // Action: Slow cinematic flight, open popup AFTER arrival.
    else if (!isVisible) {
        map.flyTo(item.coordinates, targetZoom, {
            duration: 1.5,      // Slower animation
            easeLinearity: 0.1  // High arc (zoom out then in)
        });

        // Event listener: Open popup only when flight ends
        map.once('moveend', () => {
            currentMarker.openPopup();
        });
    }

    // Scenario 3: Short Distance / On-screen (Target is visible)
    // Action: Fast pan, open popup IMMEDIATELY.
    else {
        currentMarker.openPopup(); // Immediate feedback
        map.flyTo(item.coordinates, targetZoom, {
            duration: 0.5,        // Faster animation
            easeLinearity: 0.8  // Low arc (flatter movement)
        });
    }
}

// --- 5. Interaction Controls ---
// Handle "Next" button click (Circular navigation)
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % lifeEvents.length;
    showEvent(currentIndex);
});

// Handle "Previous" button click (Circular navigation)
document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + lifeEvents.length) % lifeEvents.length;
    showEvent(currentIndex);
});

// --- 6. Start Application ---
loadLifeData();