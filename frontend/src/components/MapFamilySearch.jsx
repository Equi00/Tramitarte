import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logo.png";
import familySearch from "../data/familySearch"

function MapFamilySearch({bool}) {
    useEffect(() => {
      const centroDelPais = [-34.6989, -65.0379677];
      const map = L.map("mapFamilySearch").setView(centroDelPais, 5);
  
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
  
      const iconoTramitarte = L.icon({
        iconUrl: logo,
        iconSize: [50, 50],
        iconAnchor: [10, 10],
        popupAnchor: [0, 0],
      });
  
      familySearch.map((familySearch) => {
        let latitud, longitud;
        [latitud, longitud] = [familySearch.latitud, familySearch.longitud];
        L.marker([latitud, longitud], {
          icon: iconoTramitarte,
        }).addTo(map).bindPopup(`<b>${familySearch.direccion}</b><br>
          ${familySearch.ciudad}<br>
          <i>${familySearch.telefono}</i><br>
          <i>${familySearch.email}</i><br>
          `).openPopup();
          // <a href=${consulado.url} target="_blank">Página 🔗</a>
      });
      
      return () => {
        map.remove();
      };
    }, [bool]);
  
    return <div id="mapFamilySearch" style={{ height: "450px" }}></div>;
  }
  
  export default MapFamilySearch;