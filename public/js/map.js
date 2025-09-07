L.mapquest.key = mapToken;
const map = L.mapquest.map('map', {
  center: [lat, lon],
  layers: L.mapquest.tileLayer('map'),
  zoom: 9
});

const marker = L.marker([lat, lon], {
  icon: L.mapquest.icons.marker(),
  draggable: false
}).addTo(map);

marker.bindPopup(`<b>${place}</b><p>We are here !</p>`).openPopup();
