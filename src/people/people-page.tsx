import { useEffect, useState } from "react";
import { PeopleService, Person } from "./people-service";
import { AddPersonComponent } from "./add-person.component";
import { NavLink } from "react-router-dom";
import {
  PeopleGroup,
  PeopleGroupService,
} from "../people-groups/people-groups-service";
import { SpaceProperties } from "../space/space-props";

function listToHashMap<T extends { [key: string]: any }, K extends keyof T>(
  list: T[],
  key: K,
): { [key: string]: T } {
  const hashMap: { [key: string]: T } = {};

  list.forEach((item) => {
    const itemKey = String(item[key]); // Ensure the key is a string
    hashMap[itemKey] = item;
  });

  return hashMap;
}

export function PeoplePage(props: SpaceProperties): React.ReactElement {
  const [isLoading, setLoading] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [groupsByID, setGroupsByID] = useState<{ [id: string]: PeopleGroup }>(
    {},
  );
  const [menuOpenForPerson, setMenuOpenForPerson] = useState<string | null>(
    null,
  );

  const loadPeople = async () => {
    setLoading(true);
    const peopleService = new PeopleService();
    const people = await peopleService.listAll(props.spaceID);
    setLoading(false);
    setPeople(people);
  };

  const loadGroups = async () => {
    const groupsService = new PeopleGroupService();
    const groups = await groupsService.listAll(props.spaceID);
    setGroupsByID(listToHashMap(groups, "id"));
  };

  const openPersonActionsMenu = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    personID: string,
  ) => {
    e.stopPropagation();
    setMenuOpenForPerson(personID);
  };
  const hidePersonActionsMenu = () => {
    setMenuOpenForPerson(null);
  };

  const deletePerson = async (personID: string) => {
    console.log("delete person", personID);
    const personeService = new PeopleService();
    await personeService.deleteOne(props.spaceID, personID);
    loadPeople();
  };

  useEffect(() => {
    loadPeople();
    loadGroups();
  }, []);

  return (
    <div
      className="single-page-container"
      onClick={hidePersonActionsMenu}
      data-testid="people-page-container"
    >
      <div className="content-block">
        <div className="content-section">
          <h1>People</h1>
        </div>
        <div className="content-section">
          <NavLink to="/people-groups">Manage groups</NavLink>
        </div>
        <div className="content-section">
          {isLoading && <div>Loading...</div>}
          {!isLoading && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map((p: Person) => {
                  return (
                    <tr data-testid={`person-${p.id}`} key={`person-${p.id}`}>
                      <td data-entityid={p.id}>{p.name}</td>
                      <td>{p.attributes.email}</td>
                      <td>{groupsByID[p.attributes.groupID]?.name}</td>
                      <td>
                        <div
                          data-testid={`person-actions-dropdown-menu-${p.id}`}
                          className={
                            menuOpenForPerson === p.id
                              ? "dropdown-menu open"
                              : "dropdown-menu"
                          }
                        >
                          <button
                            className="simple-button dropdown-button"
                            onClick={(e) => openPersonActionsMenu(e, p.id)}
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
                                  onClick={() => deletePerson(p.id)}
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
          <AddPersonComponent
            onPersonAdded={loadPeople}
            spaceID={props.spaceID}
          />
        </div>
      </div>
    </div>
  );
}
