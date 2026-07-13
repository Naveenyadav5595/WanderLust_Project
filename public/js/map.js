const map = L.map("map", {
    scrollWheelZoom: false
}).setView(
    [coordinates[1], coordinates[0]],
    13
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const googleMapsLink = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`
    <div style="text-align:center; min-width:220px;">
        <h5>${listingTitle}</h5>

        <p>📍 ${listingLocation}, ${listingCountry}</p>

        <a
            href="${googleMapsLink}"
            target="_blank"
            class="btn btn-sm btn-dark"
            style="margin-top:8px;"
        >
            📍 Open in Google Maps
        </a>

        <br><br>

        <small>Stay with WanderLust ❤️</small>
    </div>
`)
.openPopup();