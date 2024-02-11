import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

function run() {
  const staticPage = document.getElementById("static-page");
  if (staticPage) {
    staticPage.innerHTML = "";
  }
  const domContainer = document.querySelector("#cards-webapp-react");
  if (!domContainer) {
    throw Error("Can not find a container for the app: #cards-webapp-react");
  }
  const root = createRoot(domContainer);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

run();
