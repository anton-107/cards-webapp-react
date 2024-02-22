import * as React from "react";
import { Meeting } from "../meetings-service";
import {
  DiscussionPoint,
  DiscussionPointsService,
} from "./discussion-points-service";
import { useEffect, useRef, useState } from "react";
import { DiscussionPointTextareaComponent } from "./discussion-point-textarea.component";

interface MeetingsListComponentProperties {
  meeting: Meeting;
}

export function DiscussionPointsComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const newPointElement = useRef(null);
  const [newDiscussionPointText, setNewDiscussionPointText] =
    useState<string>("");
  const [discussionPoints, setDiscussionPoints] = useState<DiscussionPoint[]>(
    [],
  );

  const createDiscussionPoint = async (text: string) => {
    const service = new DiscussionPointsService();
    setNewDiscussionPointText("");
    await service.addOne({
      name: `Discussion point for ${props.meeting.name}`,
      parentCardID: props.meeting.id,
      attributes: {
        isComplete: false,
        order: discussionPoints.length + 1,
        content: text,
      },
    });
    loadDiscussionPoints(props.meeting.id);
  };

  const createDiscussionPointOnEnter = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newDiscussionPointText) {
        await createDiscussionPoint(newDiscussionPointText);
      }
    }
  };

  const loadDiscussionPoints = async (meetingID: string) => {
    const service = new DiscussionPointsService();
    const points = await service.listForParent(meetingID);
    points.sort((a, b) => a.attributes.order - b.attributes.order);
    setDiscussionPoints(points);
  };

  useEffect(() => {
    loadDiscussionPoints(props.meeting.id);
  }, []);

  return (
    <div>
      {discussionPoints.map((discussionPoint) => {
        return (
          <div key={`discussion-point-${discussionPoint.id}`}>
            <input type="checkbox" className="lightweight-editor-checkbox" />
            <DiscussionPointTextareaComponent
              discussionPoint={discussionPoint}
            />
          </div>
        );
      })}
      <textarea
        ref={newPointElement}
        value={newDiscussionPointText}
        className="lightweight-textarea"
        placeholder="New point"
        rows={1}
        cols={100}
        onChange={(e) => setNewDiscussionPointText(e.target.value)}
        onKeyDown={(e) => createDiscussionPointOnEnter(e)}
      ></textarea>
    </div>
  );
}
