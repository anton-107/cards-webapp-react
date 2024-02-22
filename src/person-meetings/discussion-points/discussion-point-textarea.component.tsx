import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  DiscussionPoint,
  DiscussionPointsService,
} from "./discussion-points-service";
import { STANDARD_DEBOUNCE_TIMEOUT_MS, debounce } from "../../ui/debounce";

interface DiscussionPointTextareaComponentProperties {
  discussionPoint: DiscussionPoint;
  focusStartPosition: number | null;
  onMoveToNext: (startPosition: number) => void;
  onMoveToPrevious: (startPosition: number) => void;
}

export function DiscussionPointTextareaComponent(
  props: DiscussionPointTextareaComponentProperties,
): React.ReactElement {
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const [editedText, setEditedText] = useState<string | null>(null);

  const updateDiscussionPoint = async () => {
    if (editedText === null) {
      return;
    }
    const service = new DiscussionPointsService();
    await service.updateOne({
      ...props.discussionPoint,
      attributes: {
        ...props.discussionPoint.attributes,
        content: editedText,
      },
    });
  };

  const debouncedUpdateDiscussionPoint = debounce(
    updateDiscussionPoint,
    STANDARD_DEBOUNCE_TIMEOUT_MS,
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // save on enter:
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textareaElement) {
        textareaElement.current?.blur();
      }
      await debouncedUpdateDiscussionPoint();
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
      );
    }
    // navigate to the prev textarea:
    if (e.code === "ArrowUp") {
      e.preventDefault();
      e.preventDefault();
      props.onMoveToPrevious(
        textareaElement.current ? textareaElement.current.selectionStart : 0,
      );
    }
  };

  useEffect(() => {
    if (props.focusStartPosition !== null) {
      console.log(
        "I need to focus on my textarea at",
        props.focusStartPosition,
      );
      textareaElement.current?.focus();
      textareaElement.current?.setSelectionRange(
        props.focusStartPosition,
        props.focusStartPosition,
      );
    }
  }, [props.focusStartPosition]);

  return (
    <textarea
      ref={textareaElement}
      value={editedText || props.discussionPoint.attributes.content}
      onChange={(e) => setEditedText(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e)}
      onBlur={() => debouncedUpdateDiscussionPoint()}
      className="lightweight-textarea lightweight-editor-checkbox"
      rows={1}
      cols={100}
    ></textarea>
  );
}
