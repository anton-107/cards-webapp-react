import * as React from "react";
import { Meeting } from "../meetings-service";
import {
  DiscussionPoint,
  DiscussionPointsService,
} from "./discussion-points-service";
import { useEffect, useRef, useState } from "react";
import { DiscussionPointTextareaComponent } from "./discussion-point-textarea.component";
import { SpaceProperties } from "../../space/space-props";

interface MeetingsListComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

export const END_OF_LINE_POSITION = -2;

export function DiscussionPointsComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  const newPointElement = useRef(null);
  const [newDiscussionPointText, setNewDiscussionPointText] =
    useState<string>("");
  const [discussionPoints, setDiscussionPoints] = useState<DiscussionPoint[]>(
    [],
  );
  const [focusElementIndex, setFocusElementIndex] = useState<number>(-1);
  const [focusStartPosition, setFocusStartPosition] = useState<number>(-1);

  const createDiscussionPoint = async (text: string) => {
    const service = new DiscussionPointsService();
    setNewDiscussionPointText("");
    await service.addOne(props.spaceID, {
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
    const points = await service.listForParent(props.spaceID, meetingID);
    points.sort((a, b) => a.attributes.order - b.attributes.order);
    setDiscussionPoints(points);
  };

  const focusOnNextDiscussionPoint = (
    currentIndex: number,
    startPosition: number,
    isEndOfLine: boolean,
  ) => {
    if (discussionPoints.length > currentIndex + 1) {
      setFocusElementIndex(currentIndex + 1);
      setFocusStartPosition(isEndOfLine ? END_OF_LINE_POSITION : startPosition);
    }
  };

  const focusOnPreviousDiscussionPoint = (
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
    loadDiscussionPoints(props.meeting.id);
  }, []);

  return (
    <div>
      {discussionPoints.map((discussionPoint, index) => {
        return (
          <div key={`discussion-point-${discussionPoint.id}`}>
            <input type="checkbox" className="lightweight-editor-checkbox" />
            <DiscussionPointTextareaComponent
              spaceID={props.spaceID}
              discussionPoint={discussionPoint}
              onMoveToNext={(startPosition, isEndOfLine) =>
                focusOnNextDiscussionPoint(index, startPosition, isEndOfLine)
              }
              onMoveToPrevious={(startPosition, isEndOfLine) =>
                focusOnPreviousDiscussionPoint(
                  index,
                  startPosition,
                  isEndOfLine,
                )
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
