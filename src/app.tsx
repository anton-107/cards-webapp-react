import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";
import * as React from "react";
import { LeftMenuLinks } from "./navigation/left-menu-links";
import { HomePage } from "./home/people-page";
import { PeoplePage } from "./people/people-page";
import { PeopleGroupsPage } from "./people-groups/people-groups-page";
import { LeftMenuPeopleGroups } from "./navigation/left-menu-people-groups";
import { PersonMeetingsPage } from "./person-meetings/person-meetings.page";
import { PersonActionItemsPage } from "./person-action-items/person-action-items.page";
import { PersonObjectivesPage } from "./person-objectives/person-objectives.page";

export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <div id="app-root">
        <div className="layout">
          <div className="vertical-menu">
            <h1 className="menu-block menu-header" data-testid="greeting">
              Cards app
            </h1>
            <LeftMenuLinks />
            <LeftMenuPeopleGroups />
          </div>

          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route
                path="/person/:personID"
                element={<PersonMeetingsPage />}
              />
              <Route
                path="/person/:personID/meetings"
                element={<PersonMeetingsPage />}
              />
              <Route
                path="/person/:personID/action-items"
                element={<PersonActionItemsPage />}
              />
              <Route
                path="/person/:personID/objectives"
                element={<PersonObjectivesPage />}
              />
              <Route path="/people-groups" element={<PeopleGroupsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
