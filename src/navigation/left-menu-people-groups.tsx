import * as React from "react";
import { NavLink } from "react-router-dom";
import { PeopleService, Person } from "../people/people-service";
import {
  PeopleGroup,
  PeopleGroupService,
} from "../people-groups/people-groups-service";
import { useEffect, useState } from "react";
import { SpaceProperties } from "../space/space-props";

export function LeftMenuPeopleGroups(
  props: SpaceProperties,
): React.ReactElement {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<PeopleGroup[]>([]);

  const loadPeople = async () => {
    const peopleService = new PeopleService();
    const people = await peopleService.listAll(props.spaceID);
    setPeople(people);
  };

  const loadGroups = async () => {
    const groupsService = new PeopleGroupService();
    const groups = await groupsService.listAll(props.spaceID);
    setGroups(groups);
  };

  useEffect(() => {
    loadPeople();
    loadGroups();
  }, []);

  return (
    <div>
      <div className="menu-block">
        {groups.map((group: PeopleGroup) => {
          return (
            <div key={`group-${group.id}`}>
              <h3 className="menu-header">{group.name}</h3>
              <ul className="menu-links">
                {people
                  .filter(
                    (person: Person) => person.attributes.groupID === group.id,
                  )
                  .map((person: Person) => {
                    return (
                      <li key={`person-navlink-${person.id}`}>
                        <NavLink
                          to={`/person/${person.id}`}
                          className={({ isActive }) =>
                            isActive ? "active-nav-link" : ""
                          }
                        >
                          {person.name}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
              <div className="menu-separator"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
