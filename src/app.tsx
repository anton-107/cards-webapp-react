import "./app.css";
import * as React from "react";

export function App(): React.ReactElement {
  return (
    <div id="app-root">
      <div className="layout">
        <h1 data-testid="greeting">Cards!</h1>
      </div>
    </div>
  );
}
