import * as React from "react";
import { Meeting } from "./meetings-service";
import { DiscussionPointsComponent } from "./discussion-points/discussion-points.component";
import { SpaceProperties } from "../space/space-props";
import { MeetingsActionsComponent } from "./meetings-actions.component";

interface MeetingsListComponentProperties extends SpaceProperties {
  meetings: Meeting[];
  onMeetingDeletionRequest: (meetingID: string) => void;
}

export function MeetingsListComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const formatDate = (timestamp: number): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (err) {
      return "Invalid date";
    }
  };

  return (
    <div>
      {props.meetings.map((meeting) => {
        return (
          <div key={`meeting-${meeting.id}`} className="content-box">
            <div className="right-side">
              <MeetingsActionsComponent
                meetingID={meeting.id}
                onMeetingDeletionRequest={() =>
                  props.onMeetingDeletionRequest(meeting.id)
                }
              />
            </div>
            {meeting.name} on {formatDate(meeting.attributes.dateStart)} (#
            {meeting.id}, {meeting.attributes.createdAt})
            <h3>Discussion points</h3>
            <DiscussionPointsComponent
              meeting={meeting}
              spaceID={props.spaceID}
            />
            <h3>Notes</h3>
            <p>...</p>
            <h3>Action points</h3>
            <p>...</p>
          </div>
        );
      })}
    </div>
  );
}
