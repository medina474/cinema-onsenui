'use strict';

let listeMarqueurs = new Set(); //Ensemble d'éléments uniques
const clusters = L.markerClusterGroup();
function afficheCarte() {
  listeMarqueurs = new Set();

  const map = L.map('map').setView([45, 0], 13);

  map.addEventListener("moveend", function () {
    getCinemas(map);
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  map.addLayer(clusters);

  map.locate({ setView: true, maxZoom: 15 });
}

async function getCinemas(map) {

  const b = map.getBounds();

  const data = await fetch("https://morseweiswlpykaugwtd.supabase.co/rest/v1/rpc/etablissements_in_view", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcnNld2Vpc3dscHlrYXVnd3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5NTcxMjgsImV4cCI6MjAyMjUzMzEyOH0.UV5XCINWe-Jaw6_-787Veh-LxjzUVudArvrgH6Ycf30"
    },
    body: JSON.stringify({ "min_lat": b._southWest.lat, "min_long": b._southWest.lng, "max_lat": b._northEast.lat, "max_long": b._northEast.lng })
  });

  //console.log(data.headers.get("content-type"))
  const etablissements = await data.json();

  for (let e of etablissements) {

    if (listeMarqueurs.has(e.etablissement_id)) continue;

    clusters.addLayer(L.marker([e.lat, e.long])
      .bindPopup(`<strong>${e.nom}</strong><br>
        ${e.ville}`));

    listeMarqueurs.add(e.etablissement_id);
  }
}
