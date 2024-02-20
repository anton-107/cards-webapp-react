import * as React from "react";
import { Meeting } from "./meetings-service";

interface MeetingsListComponentProperties {
  meetings: Meeting[];
}

export function MeetingsListComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  return (
    <div>
      {props.meetings.map((meeting) => {
        return (
          <div key={`meeting-${meeting.id}`}>
            {meeting.name} on {meeting.attributes.dateStart} (#{meeting.id},{" "}
            {meeting.attributes.createdAt})
          </div>
        );
      })}
    </div>
  );
}
