import * as React from "react";
import { useRef, useState } from "react";
import {
  DiscussionPoint,
  DiscussionPointsService,
} from "./discussion-points-service";
import { STANDARD_DEBOUNCE_TIMEOUT_MS, debounce } from "../../ui/debounce";

interface DiscussionPointTextareaComponentProperties {
  discussionPoint: DiscussionPoint;
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

  const updateDiscussionPointTextOnEnter = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textareaElement) {
        textareaElement.current?.blur();
      }
      await debouncedUpdateDiscussionPoint();
    }
  };

  return (
    <textarea
      ref={textareaElement}
      value={editedText || props.discussionPoint.attributes.content}
      onChange={(e) => setEditedText(e.target.value)}
      onKeyDown={(e) => updateDiscussionPointTextOnEnter(e)}
      onBlur={() => debouncedUpdateDiscussionPoint()}
      className="lightweight-textarea lightweight-editor-checkbox"
      rows={1}
      cols={100}
    ></textarea>
  );
}
