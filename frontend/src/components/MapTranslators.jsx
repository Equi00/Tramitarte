import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logo.png";
import translators from "../data/translators"

function MapTranslators({bool}) {
    useEffect(() => {
      const countryCenter = [-34.6989, -65.0379677];
      const map = L.map("mapTranslators").setView(countryCenter, 5);
  
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
  
      translators.map((translator) => {
        let latitude, longitude;
        [latitude, longitude] = [translator.latitude, translator.longitude];
        L.marker([latitude, longitude], {
          icon: iconoTramitarte,
        }).addTo(map).bindPopup(`<b>${translator.address}</b><br>
          ${translator.city}<br>
          <i>${translator.phone}</i><br>
          `).openPopup();
      });
      
      return () => {
        map.remove();
      };
    }, [bool]);
  
    return <div id="mapTranslators" style={{ height: "450px" }}></div>;
  }
  
  export default MapTranslators;