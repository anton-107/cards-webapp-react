import * as React from "react";
import { Meeting } from "../meetings-service";
import { MeetingNote, MeetingNotesService } from "./meeting-notes-service";
import { useEffect, useRef, useState } from "react";
import { SpaceProperties } from "../../space/space-props";
import { TextareaListComponent } from "../../textarea-list/textarea-list.component";

interface MeetingsListComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

class MeetingNoteText {
  public readonly id: string;

  constructor(private meetingNote: MeetingNote) {
    this.id = meetingNote.id;
  }

  get textValue(): string {
    return this.meetingNote.attributes.content;
  }
}

export function MeetingsNotesComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const service = new MeetingNotesService();
  const [meetingNotes, setMeetingNotes] = useState<MeetingNoteText[]>([]);

  const createMeetingNote = async (text: string) => {
    await service.addOne(props.spaceID, {
      name: `Meeting note of ${props.meeting.name}`,
      parentCardID: props.meeting.id,
      attributes: {
        order: meetingNotes.length + 1,
        content: text,
      },
    });
    loadMeetingNotes(props.meeting.id);
  };

  const updateMeetingNote = async (itemID: string, text: string) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        content: text,
      },
    });
  };

  const loadMeetingNotes = async (meetingID: string) => {
    const items = await service.listForParent(props.spaceID, meetingID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setMeetingNotes(items.map((x) => new MeetingNoteText(x)));
  };

  useEffect(() => {
    loadMeetingNotes(props.meeting.id);
  }, []);

  return (
    <div>
      <TextareaListComponent
        items={meetingNotes}
        newItemPlaceholder="New note"
        onNewItemCreateRequest={createMeetingNote}
        onItemUpdateRequest={updateMeetingNote}
      />
    </div>
  );
}
