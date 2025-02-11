import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import logo from "../assets/logo.png";
import consulados from "../data/consulados";

function Map({bool}) {
  useEffect(() => {
    const centroDelPais = [-34.6989, -65.0379677];
    const map = L.map("map").setView(centroDelPais, 5);

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

    consulados.map((consulado) => {
      let latitud, longitud;
      [latitud, longitud] = [consulado.latitud, consulado.longitud];
      L.marker([latitud, longitud], {
        icon: iconoTramitarte,
      }).addTo(map).bindPopup(`<b>${consulado.direccion}</b><br>
        ${consulado.ciudad}<br>
        <i>${consulado.telefono}</i><br>
        `).openPopup();
        // <a href=${consulado.url} target="_blank">Página 🔗</a>
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
