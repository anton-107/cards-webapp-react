import * as React from "react";
import { Meeting } from "./meetings-service";
import { DiscussionPointsComponent } from "./discussion-points/discussion-points.component";
import { SpaceProperties } from "../space/space-props";
import { MeetingsActionsComponent } from "./meetings-actions.component";
import { MeetingDateComponent } from "./meeting-date.component";

interface MeetingsListComponentProperties extends SpaceProperties {
  meetings: Meeting[];
  onMeetingDeletionRequest: (meetingID: string) => void;
  onMeetingStartDateChangeRequest: (meetingID: string, newDate: number) => void;
}

export function MeetingsListComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const updateMeetingStartDate = async (
    meetingID: string,
    newDate: number,
  ): Promise<void> => {
    props.onMeetingStartDateChangeRequest(meetingID, newDate);
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
            {meeting.name} on
            <span>
              <MeetingDateComponent
                meeting={meeting}
                onDateChange={(newDate: number) =>
                  updateMeetingStartDate(meeting.id, newDate)
                }
              />
            </span>
            (#
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
