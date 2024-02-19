import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PeopleService, Person } from "../people/people-service";
import { PersonHeaderComponent } from "./../person-meetings/person-header.component";

export function PersonActionItemsPage(): React.ReactElement {
  const [person, setPerson] = useState<Person | null>(null);
  const { personID } = useParams();

  const loadPerson = async (personID: string) => {
    const peopleService = new PeopleService();
    const person = await peopleService.getOne(personID);
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
      {person && <PersonHeaderComponent person={person} />}
      <div className="content-block">Action items</div>
    </div>
  );
}
