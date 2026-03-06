import L from "leaflet";
import "leaflet.markercluster";

const BASE_MAP_OPTIONS = {
    center: [50.85, 4.35], // Default center on Belgium
    zoom: 8,
};

const getMarkerMeta = (el) => ({
    name: el.dataset.name ?? "",
    address: el.dataset.address ?? "",
    postalcode: el.dataset.postalcode ?? "",
    city: el.dataset.city ?? "",
    country: el.dataset.countryName ?? el.dataset.country ?? "",
});

const buildPopupContent = ({ name, address, postalcode, city, country }) => {
    let html = '<div class="map-info text-sm space-y-0.25">';

    if (name) {
        html += `<div class="font-semibold text-base">${name}</div>`;
    }

    const addressLines = [];
    if (address) addressLines.push(address);
    const locality = [postalcode, city].filter(Boolean).join(" ").trim();
    if (locality) addressLines.push(locality);
    if (country) addressLines.push(country);

    if (addressLines.length) {
        html += '<div class="leading-tight">';
        addressLines.forEach((line) => {
            html += `<div>${line}</div>`;
        });
        html += "</div>";
    }

    html += "</div>";
    return html;
};

const createCustomIcon = () => {
    return L.divIcon({
        html: `<img src="/assets/icons/pin.svg" alt="" style="width: 32px; height: auto;">`,
        className: "leaflet-custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const initKaffeesLeafletMap = () => {
    const mapContainer = document.querySelector("[data-kaffees-map]");
    if (!mapContainer) {
        return;
    }

    // Clear any existing map instance
    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
        mapContainer.innerHTML = "";
    }

    const componentRoot = mapContainer.closest("[data-kaffees-component]") ?? document;
    const markerElements = Array.from(componentRoot.querySelectorAll("[data-kaffees-marker]"));

    const map = L.map(mapContainer, {
        ...BASE_MAP_OPTIONS,
        zoomControl: true,
        attributionControl: false,
    });

    // Add CartoDB Positron tiles (minimalistic light style)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
    }).addTo(map);

    const customIcon = createCustomIcon();
    const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div class="h-10 w-10 rounded-full text-white flex items-center justify-center font-bold" style="background-color: #ea580c;">${count}</div>`,
                className: "leaflet-cluster-marker",
                iconSize: [40, 40],
            });
        },
    });

    const bounds = L.latLngBounds();

    markerElements.forEach((el) => {
        const lat = parseFloat(el.dataset.lat || "");
        const lng = parseFloat(el.dataset.lng || "");
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
        }

        bounds.extend([lat, lng]);

        const marker = L.marker([lat, lng], { icon: customIcon });
        const meta = getMarkerMeta(el);
        const popupContent = buildPopupContent(meta);

        if (popupContent) {
            marker.bindPopup(popupContent);
        }

        markers.addLayer(marker);
    });

    map.addLayer(markers);

    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
        // Limit max zoom after fitting bounds
        if (map.getZoom() > 14) {
            map.setZoom(14);
        }
    }
};

const initializeMaps = () => {
    initKaffeesLeafletMap();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMaps);
} else {
    initializeMaps();
}

// Re-initialize maps after any HTMX/Sprig swap
document.body.addEventListener("htmx:afterSettle", () => {
    initializeMaps();
});
