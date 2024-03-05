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
import { AuthService } from "./auth/auth-service";
import { useEffect, useState } from "react";
import { LoginForm } from "./auth/login-form";
import { UserMenu } from "./auth/user-menu";
import { SpaceService } from "./space/space-service";

export function App(): React.ReactElement {
  const authService = new AuthService();
  const spaceService = new SpaceService();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [spaceID, setSpaceID] = useState<string | null>(null);
  const [spaceWarningMessage, setSpaceWarningMessage] = useState<string | null>(
    null,
  );

  const checkCurrentUser = async () => {
    setIsCheckingAuth(true);
    const resp = await authService.checkAuthentication();
    setIsAuthenticated(resp.isAuthenticated);
    setUserName(resp.username);
    setIsCheckingAuth(false);
  };

  const findUserSpace = async () => {
    if (!isAuthenticated) {
      return;
    }
    const spaces = await spaceService.listAll();
    if (spaces.length < 1) {
      setSpaceWarningMessage(
        "You do not have spaces assigned to your username. Please contact your administrator",
      );
      return;
    }
    if (spaces.length > 1) {
      setSpaceWarningMessage(
        "You have more than one space assigned to your username. This application only supports a single space. Please contact your administrator",
      );
      return;
    }
    setSpaceID(spaces[0].spaceID);
    setSpaceWarningMessage(null);
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  useEffect(() => {
    findUserSpace();
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <div id="app-root">
        <div className="layout">
          {isAuthenticated && (
            <div className="vertical-menu">
              <h1 className="menu-block menu-header">Cards app</h1>
              <div className="menu-separator"></div>
              <LeftMenuLinks />
              <div className="menu-separator"></div>
              {spaceID && <LeftMenuPeopleGroups spaceID={spaceID} />}
            </div>
          )}

          <div className="content">
            {!isCheckingAuth && !isAuthenticated && (
              <div className="content-block" data-testid="login-form-wrapper">
                <LoginForm onSignIn={checkCurrentUser} />
              </div>
            )}
            {isCheckingAuth && <div className="content-block">Loading...</div>}

            {userName && (
              <div className="top-bar">
                <div className="top-bar-section"></div>
                <div className="top-bar-section-side" data-testid="greeting">
                  <UserMenu userName={userName} onSignOut={checkCurrentUser} />
                </div>
              </div>
            )}

            {spaceWarningMessage && (
              <div className="content-block">
                <strong>ATTENTION:</strong> ${spaceWarningMessage}
              </div>
            )}

            {isAuthenticated && spaceID && (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/people"
                  element={<PeoplePage spaceID={spaceID} />}
                />
                <Route
                  path="/person/:personID"
                  element={<PersonMeetingsPage spaceID={spaceID} />}
                />
                <Route
                  path="/person/:personID/meetings"
                  element={<PersonMeetingsPage spaceID={spaceID} />}
                />
                <Route
                  path="/person/:personID/action-items"
                  element={<PersonActionItemsPage spaceID={spaceID} />}
                />
                <Route
                  path="/person/:personID/objectives"
                  element={<PersonObjectivesPage spaceID={spaceID} />}
                />
                <Route
                  path="/people-groups"
                  element={<PeopleGroupsPage spaceID={spaceID} />}
                />
              </Routes>
            )}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
