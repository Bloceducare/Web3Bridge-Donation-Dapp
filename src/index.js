import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId="QDDcI1iLWsVuTLvFfHyng911stwshWsLM68iZQoJ"
      serverUrl="https://82nhufnjhogx.usemoralis.com:2053/server"
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>
);
