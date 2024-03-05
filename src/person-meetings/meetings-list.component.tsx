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
            {meeting.name} on {meeting.attributes.dateStart} (#{meeting.id},{" "}
            {meeting.attributes.createdAt})<h3>Discussion points</h3>
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
