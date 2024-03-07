import { useEffect, useState } from "react";
import { SpaceProperties } from "../../space/space-props";
import { Meeting } from "../meetings-service";
import { TextareaCheckboxListComponent } from "../../textarea-list/textarea-checkbox-list.component";
import {
  DiscussionPoint,
  DiscussionPointsService,
} from "./discussion-points-service";

interface DiscussionPointsComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

class DiscussionPointCheckboxText {
  public readonly id: string;

  constructor(private discussionPoint: DiscussionPoint) {
    this.id = discussionPoint.id;
  }

  get textValue(): string {
    return this.discussionPoint.attributes.content;
  }

  get isChecked(): boolean {
    return this.discussionPoint.attributes.isComplete;
  }
}

export function DiscussionPointsComponent(
  props: DiscussionPointsComponentProperties,
): React.ReactElement {
  const service = new DiscussionPointsService();
  const [discussionPoints, setDiscussionPoints] = useState<
    DiscussionPointCheckboxText[]
  >([]);

  const createDiscussionPoint = async (text: string) => {
    await service.addOne(props.spaceID, {
      name: `Discussion point of ${props.meeting.name}`,
      parentCardID: props.meeting.id,
      attributes: {
        isComplete: false,
        order: discussionPoints.length + 1,
        content: text,
      },
    });
    loadDiscussionPoints(props.meeting.id);
  };

  const updateDiscussionPointText = async (itemID: string, text: string) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        content: text,
      },
    });
  };

  const updateDiscussionPointCompleted = async (
    itemID: string,
    isComplete: boolean,
  ) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        isComplete,
      },
    });
  };

  const loadDiscussionPoints = async (meetingID: string) => {
    const items = await service.listForParent(props.spaceID, meetingID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setDiscussionPoints(items.map((x) => new DiscussionPointCheckboxText(x)));
  };

  useEffect(() => {
    loadDiscussionPoints(props.meeting.id);
  }, []);

  return (
    <div>
      <TextareaCheckboxListComponent
        items={discussionPoints}
        newItemPlaceholder="New discussion point"
        onNewItemCreateRequest={createDiscussionPoint}
        onItemUpdateRequest={updateDiscussionPointText}
        onCheckboxUpdateRequest={updateDiscussionPointCompleted}
      />
    </div>
  );
}
