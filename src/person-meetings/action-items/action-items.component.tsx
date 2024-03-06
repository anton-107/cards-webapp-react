import { useEffect, useState } from "react";
import { SpaceProperties } from "../../space/space-props";
import { TextareaListComponent } from "../../textarea-list/textarea-list.component";
import { Meeting } from "../meetings-service";
import { ActionItem, ActionItemsService } from "./action-items-service";

interface ActionItemsComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

class ActionItemText {
  public readonly id: string;

  constructor(private actionItem: ActionItem) {
    this.id = actionItem.id;
  }

  get textValue(): string {
    return this.actionItem.attributes.content;
  }
}

export function ActionItemsComponent(
  props: ActionItemsComponentProperties,
): React.ReactElement {
  const service = new ActionItemsService();
  const [actionItems, setActionItems] = useState<ActionItemText[]>([]);

  const createActionItem = async (text: string) => {
    console.log("createActionItem", text);

    await service.addOne(props.spaceID, {
      name: `Action item of ${props.meeting.name}`,
      parentCardID: props.meeting.id,
      attributes: {
        isComplete: false,
        order: actionItems.length + 1,
        content: text,
      },
    });
    loadActionItems(props.meeting.id);
  };

  const updateActionItem = async (itemID: string, text: string) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        content: text,
      },
    });
  };

  const loadActionItems = async (meetingID: string) => {
    const items = await service.listForParent(props.spaceID, meetingID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setActionItems(items.map((x) => new ActionItemText(x)));
  };

  useEffect(() => {
    loadActionItems(props.meeting.id);
  }, []);

  return (
    <div>
      <TextareaListComponent
        items={actionItems}
        newItemPlaceholder="New action item"
        onNewItemCreateRequest={createActionItem}
        onItemUpdateRequest={updateActionItem}
      />
    </div>
  );
}
