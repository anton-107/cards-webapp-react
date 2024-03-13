import * as React from "react";
import { Meeting } from "./meetings-service";
import { DiscussionPointsComponent } from "./discussion-points/discussion-points.component";
import { SpaceProperties } from "../space/space-props";
import { MeetingsActionsComponent } from "./meetings-actions.component";
import { MeetingDateComponent } from "./meeting-date.component";
import { MeetingsNotesComponent } from "./meeting-notes/meeting-notes.component";
import { ActionItemsComponent } from "./action-items/action-items.component";
import { OpenQuestionsInPersonMeetingComponent } from "./open-questions/open-questions-in-person-meeting.component";
import { Person } from "../people/people-service";

interface MeetingsListComponentProperties extends SpaceProperties {
  meetings: Meeting[];
  person: Person;
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
            <h4>Open questions:</h4>
            <OpenQuestionsInPersonMeetingComponent
              spaceID={props.spaceID}
              person={props.person}
            />
            <h3>Notes</h3>
            <MeetingsNotesComponent meeting={meeting} spaceID={props.spaceID} />
            <h3>Action points</h3>
            <ActionItemsComponent meeting={meeting} spaceID={props.spaceID} />
          </div>
        );
      })}
    </div>
  );
}
