import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";
import * as React from "react";
import { LeftMenuLinks } from "./navigation/left-menu-links";
import { HomePage } from "./home/people-page";
import { PeoplePage } from "./people/people-page";
import { PeopleGroupsPage } from "./people-groups/people-groups-page";
import { LeftMenuPeopleGroups } from "./navigation/left-menu-people-groups";

export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <div id="app-root">
        <div className="layout">
          <div className="vertical-menu">
            <h1 className="menu-block menu-header" data-testid="greeting">Cards app</h1>
            <LeftMenuLinks />
            <LeftMenuPeopleGroups />
          </div>

          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/people-groups" element={<PeopleGroupsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
