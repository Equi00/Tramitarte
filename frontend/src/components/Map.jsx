import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import logo from "../assets/logo.png";
import consulates from "../data/consulates";

function Map({bool}) {
  useEffect(() => {
    const countryCenter = [-34.6989, -65.0379677];
    const map = L.map("map").setView(countryCenter, 5);

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

    consulates.map((consulate) => {
      let latitude, longitude;
      [latitude, longitude] = [consulate.latitude, consulate.longitude];
      L.marker([latitude, longitude], {
        icon: iconoTramitarte,
      }).addTo(map).bindPopup(`<b>${consulate.address}</b><br>
        ${consulate.city}<br>
        <i>${consulate.phone}</i><br>
        `).openPopup();
    });
    

    function buscarLocalizacion(e) {
      L.marker(e.latlng).addTo(map);
    }

    function errorLocalizacion(e) {
      alert(
        "No es posible encontrar su ubicación. ¿Activaste la geolocalización?"
      );
    }

    // const marker2 = L.marker([-34.582208, -58.402466], { icon: myIcon }).addTo(
    //   map
    // );
    // const marker3 = L.marker([-34.584394, -58.578618], { icon: myIcon }).addTo(
    //   map
    // );
    // const marker4 = L.marker([-34.649641, -58.61749], { icon: myIcon }).addTo(
    //   map
    // );

    // map.on("locationerror", errorLocalizacion);
    // map.on("locationfound", buscarLocalizacion);
    // map.locate({ setView: true, maxZoom: 12 });

    return () => {
      map.remove();
    };
  }, [bool]);

  return <div id="map" style={{ height: "450px" }}></div>;
}

export default Map;
