import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PeopleService, Person } from "./../people/people-service";
import { PersonHeaderComponent } from "./person-header.component";
import { MeetingsListComponent } from "./meetings-list.component";
import { Meeting, MeetingsService } from "./meetings-service";
import { AddNewMeetingComponent } from "./add-new-meeting.component";
import { SpaceProperties } from "../space/space-props";

export function PersonMeetingsPage(props: SpaceProperties): React.ReactElement {
  const [person, setPerson] = useState<Person | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { personID } = useParams();

  const loadPerson = async (personID: string) => {
    const peopleService = new PeopleService();
    const person = await peopleService.getOne(props.spaceID, personID);
    setPerson(person);
  };

  const loadMeetings = async (personID: string) => {
    const service = new MeetingsService();
    const meetings = await service.listForParent(props.spaceID, personID);
    meetings.sort((a, b) => b.attributes.createdAt - a.attributes.createdAt);
    setMeetings(meetings);
  };

  useEffect(() => {
    if (personID) {
      loadPerson(personID);
      loadMeetings(personID);
    }
    setPerson(null);
  }, [location, personID]);

  return (
    <div className="single-page-container">
      {personID && person && (
        <div>
          <PersonHeaderComponent person={person} />
          <div className="content-block content-block-box-container">
            <AddNewMeetingComponent
              person={person}
              onMeetingAdded={() => loadMeetings(personID)}
              spaceID={props.spaceID}
            />
            <MeetingsListComponent
              meetings={meetings}
              spaceID={props.spaceID}
            />
          </div>
        </div>
      )}
    </div>
  );
}
