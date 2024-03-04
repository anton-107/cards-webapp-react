import * as React from "react";
import { Person } from "../people/people-service";
import { MeetingsService } from "./meetings-service";
import { SpaceProperties } from "../space/space-props";

interface AddNewMeetingComponentProperties extends SpaceProperties {
  person: Person;
  onMeetingAdded: () => void;
}

export function AddNewMeetingComponent(
  props: AddNewMeetingComponentProperties,
): React.ReactElement {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const createMeeting = async () => {
    const service = new MeetingsService();
    const dateStart = formatDate(new Date());
    await service.addOne(props.spaceID, {
      name: `1x1 Meeting with ${props.person.name}`,
      parentCardID: props.person.id,
      attributes: {
        dateStart: dateStart,
        createdAt: Date.now(),
      },
    });
    props.onMeetingAdded();
  };

  return (
    <div className="form-field-block">
      <button className="form-button" onClick={() => createMeeting()}>
        Add new meeting
      </button>
    </div>
  );
}
