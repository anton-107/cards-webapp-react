import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { MeetingNote, MeetingNotesService } from "./meeting-notes-service";
import { STANDARD_DEBOUNCE_TIMEOUT_MS, debounce } from "../../ui/debounce";
import { END_OF_LINE_POSITION } from "./meeting-notes.component";
import { SpaceProperties } from "../../space/space-props";

interface MeetingNoteTextareaComponentProperties extends SpaceProperties {
  meetingNote: MeetingNote;
  focusStartPosition: number | null;
  onMoveToNext: (startPosition: number, isLastCharacter: boolean) => void;
  onMoveToPrevious: (startPosition: number, isLastCharacter: boolean) => void;
}

export function MeetingNoteTextareaComponent(
  props: MeetingNoteTextareaComponentProperties,
): React.ReactElement {
  const service = new MeetingNotesService();
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const [editedText, setEditedText] = useState<string | null>(null);

  const updateItem = async () => {
    if (editedText === null) {
      return;
    }
    await service.updateOne(props.spaceID, {
      ...props.meetingNote,
      attributes: {
        ...props.meetingNote.attributes,
        content: editedText,
      },
    });
  };

  const debouncedUpdateItem = debounce(
    updateItem,
    STANDARD_DEBOUNCE_TIMEOUT_MS,
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // save on enter:
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textareaElement) {
        textareaElement.current?.blur();
      }
      await debouncedUpdateItem();
      return;
    }
    // blur on escape (will trigger save):
    if (e.code === "Escape") {
      e.preventDefault();
      if (textareaElement) {
        textareaElement.current?.blur();
      }
      return;
    }
    // navigate to the next textarea:
    if (e.code === "ArrowDown") {
      e.preventDefault();
      props.onMoveToNext(
        textareaElement.current ? textareaElement.current.selectionStart : 0,
        textareaElement.current?.selectionStart ===
          textareaElement.current?.value.length,
      );
    }
    // navigate to the prev textarea:
    if (e.code === "ArrowUp") {
      e.preventDefault();
      e.preventDefault();
      props.onMoveToPrevious(
        textareaElement.current ? textareaElement.current.selectionStart : 0,
        textareaElement.current?.selectionStart ===
          textareaElement.current?.value.length,
      );
    }
  };

  useEffect(() => {
    if (props.focusStartPosition !== null) {
      textareaElement.current?.focus();

      let startPosition = props.focusStartPosition;
      if (
        textareaElement.current &&
        props.focusStartPosition === END_OF_LINE_POSITION
      ) {
        startPosition = textareaElement.current.value.length;
      }

      textareaElement.current?.setSelectionRange(startPosition, startPosition);
    }
  }, [props.focusStartPosition]);

  return (
    <textarea
      ref={textareaElement}
      value={editedText || props.meetingNote.attributes.content}
      onChange={(e) => setEditedText(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e)}
      onBlur={() => debouncedUpdateItem()}
      className="lightweight-textarea lightweight-editor-checkbox"
      rows={1}
      cols={100}
    ></textarea>
  );
}
