import { useEffect, useState } from "react";
import { PeopleGroupService, PeopleGroup } from "./people-groups-service";
import { AddGroupComponent } from "./add-group.component";
import { NavLink } from "react-router-dom";
import { SpaceProperties } from "../space/space-props";

export function PeopleGroupsPage(props: SpaceProperties): React.ReactElement {
  const [isLoading, setLoading] = useState(false);
  const [groups, setGroups] = useState<PeopleGroup[]>([]);
  const [menuOpenForGroup, setMenuOpenForGroup] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    const peopleService = new PeopleGroupService();
    const people = await peopleService.listAll(props.spaceID);
    setLoading(false);
    setGroups(people);
  };

  const openItemActionsMenu = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    personID: string,
  ) => {
    e.stopPropagation();
    setMenuOpenForGroup(personID);
  };
  const hideItemActionsMenu = () => {
    setMenuOpenForGroup(null);
  };

  const deleteItem = async (personID: string) => {
    const personeService = new PeopleGroupService();
    await personeService.deleteOne(props.spaceID, personID);
    loadItems();
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div
      className="single-page-container"
      onClick={hideItemActionsMenu}
      data-testid="people-page-container"
    >
      <div className="content-block">
        <div className="content-section">
          <h1>Groups</h1>
        </div>
        <div className="content-section">
          <NavLink to="/people">🔙 Back to people</NavLink>
        </div>
        <div className="content-section">
          {isLoading && <div>Loading...</div>}
          {!isLoading && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Group name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((p: PeopleGroup) => {
                  return (
                    <tr data-testid={`group-${p.id}`} key={`group-${p.id}`}>
                      <td data-entityid={p.id}>{p.name}</td>
                      <td>
                        <div
                          data-testid={`people-group-actions-dropdown-menu-${p.id}`}
                          className={
                            menuOpenForGroup === p.id
                              ? "dropdown-menu open"
                              : "dropdown-menu"
                          }
                        >
                          <button
                            className="simple-button dropdown-button"
                            onClick={(e) => openItemActionsMenu(e, p.id)}
                            data-testid={`person-actions-menu-button-${p.id}`}
                          >
                            <span className="material-symbols-outlined">
                              more_horiz
                            </span>
                          </button>
                          <div className="dropdown-content dropdown-content-person-actions">
                            <ul className="actions-list">
                              <li className="warning-action">
                                <a
                                  href="#"
                                  onClick={() => deleteItem(p.id)}
                                  data-testid={`action-delete-person-${p.id}`}
                                >
                                  Delete this person entry
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="content-section">
          <AddGroupComponent onItemAdded={loadItems} spaceID={props.spaceID} />
        </div>
      </div>
    </div>
  );
}
