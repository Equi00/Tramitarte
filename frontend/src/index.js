import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ojseedpow7eya4ne.us.auth0.com"
      clientId="mtwlRPa0mHPrfTP7ZULvKF2HFOyzQnoJ"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/verificacion",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
