import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PeopleService, Person } from "../people/people-service";
import { PersonHeaderComponent } from "../person-meetings/person-header.component";
import { SpaceProperties } from "../space/space-props";

export function PersonObjectivesPage(
  props: SpaceProperties,
): React.ReactElement {
  const [person, setPerson] = useState<Person | null>(null);
  const { personID } = useParams();

  const loadPerson = async (personID: string) => {
    const peopleService = new PeopleService();
    const person = await peopleService.getOne(props.spaceID, personID);
    setPerson(person);
  };

  useEffect(() => {
    if (personID) {
      loadPerson(personID);
    }
    setPerson(null);
  }, [location, personID]);

  return (
    <div className="single-page-container">
      {person && (
        <div>
          <PersonHeaderComponent person={person} />
          <div className="content-block">Objectives</div>
        </div>
      )}
    </div>
  );
}
