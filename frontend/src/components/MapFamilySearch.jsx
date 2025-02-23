import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logo.png";
import familySearch from "../data/familySearch"

function MapFamilySearch({bool}) {
    useEffect(() => {
      const countryCenter = [-34.6989, -65.0379677];
      const map = L.map("mapFamilySearch").setView(countryCenter, 5);
  
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
  
      const tramitarteIcon = L.icon({
        iconUrl: logo,
        iconSize: [50, 50],
        iconAnchor: [10, 10],
        popupAnchor: [0, 0],
      });
  
      familySearch.map((familySearch) => {
        let latitude, longitude;
        [latitude, longitude] = [familySearch.latitude, familySearch.longitude];
        L.marker([latitude, longitude], {
          icon: tramitarteIcon,
        }).addTo(map).bindPopup(`<b>${familySearch.address}</b><br>
          ${familySearch.city}<br>
          <i>${familySearch.phone}</i><br>
          <i>${familySearch.email}</i><br>
          `).openPopup();
      });
      
      return () => {
        map.remove();
      };
    }, [bool]);
  
    return <div id="mapFamilySearch" style={{ height: "450px" }}></div>;
  }
  
  export default MapFamilySearch;