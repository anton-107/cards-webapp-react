import * as React from "react";
import { Meeting } from "../meetings-service";
import { MeetingNote, MeetingNotesService } from "./meeting-notes-service";
import { useEffect, useRef, useState } from "react";
import { SpaceProperties } from "../../space/space-props";
import { MeetingNoteTextareaComponent } from "./meeting-note-textarea.component";

interface MeetingsListComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

export const END_OF_LINE_POSITION = -2;

export function MeetingsNotesComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const meetingNotesService = new MeetingNotesService();

  const newPointElement = useRef(null);
  const [newMeetingNoteText, setNewMeetingNoteText] = useState<string>("");
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [focusElementIndex, setFocusElementIndex] = useState<number>(-1);
  const [focusStartPosition, setFocusStartPosition] = useState<number>(-1);

  const createMeetingNote = async (text: string) => {
    setNewMeetingNoteText("");
    await meetingNotesService.addOne(props.spaceID, {
      name: `Meeting note of ${props.meeting.name}`,
      parentCardID: props.meeting.id,
      attributes: {
        order: meetingNotes.length + 1,
        content: text,
      },
    });
    loadMeetingNotes(props.meeting.id);
  };

  const createOnEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMeetingNoteText) {
        await createMeetingNote(newMeetingNoteText);
      }
    }
  };

  const loadMeetingNotes = async (meetingID: string) => {
    const points = await meetingNotesService.listForParent(
      props.spaceID,
      meetingID,
    );
    points.sort((a, b) => a.attributes.order - b.attributes.order);
    setMeetingNotes(points);
  };

  const focusOnNextMeetingNote = (
    currentIndex: number,
    startPosition: number,
    isEndOfLine: boolean,
  ) => {
    if (meetingNotes.length > currentIndex + 1) {
      setFocusElementIndex(currentIndex + 1);
      setFocusStartPosition(isEndOfLine ? END_OF_LINE_POSITION : startPosition);
    }
  };

  const focusOnPreviousMeetingNote = (
    currentIndex: number,
    startPosition: number,
    isEndOfLine: boolean,
  ) => {
    if (currentIndex - 1 >= 0) {
      setFocusElementIndex(currentIndex - 1);
      setFocusStartPosition(isEndOfLine ? END_OF_LINE_POSITION : startPosition);
    }
  };

  useEffect(() => {
    loadMeetingNotes(props.meeting.id);
  }, []);

  return (
    <div>
      {meetingNotes.map((meetingNote, index) => {
        return (
          <div key={`discussion-point-${meetingNote.id}`}>
            <span>&bull; </span>
            <MeetingNoteTextareaComponent
              spaceID={props.spaceID}
              meetingNote={meetingNote}
              onMoveToNext={(startPosition, isEndOfLine) =>
                focusOnNextMeetingNote(index, startPosition, isEndOfLine)
              }
              onMoveToPrevious={(startPosition, isEndOfLine) =>
                focusOnPreviousMeetingNote(index, startPosition, isEndOfLine)
              }
              focusStartPosition={
                index === focusElementIndex ? focusStartPosition : null
              }
            />
          </div>
        );
      })}
      <textarea
        ref={newPointElement}
        value={newMeetingNoteText}
        className="lightweight-textarea"
        placeholder="New note"
        rows={1}
        cols={100}
        onChange={(e) => setNewMeetingNoteText(e.target.value)}
        onKeyDown={(e) => createOnEnter(e)}
      ></textarea>
    </div>
  );
}
