import { useEffect, useState } from "react";
import { SpaceProperties } from "../../space/space-props";
import { Meeting } from "../meetings-service";
import { ActionItem, ActionItemsService } from "./action-items-service";
import { TextareaCheckboxListComponent } from "../../textarea-list/textarea-checkbox-list.component";

interface ActionItemsComponentProperties extends SpaceProperties {
  meeting: Meeting;
}

class ActionItemCheckboxText {
  public readonly id: string;

  constructor(private actionItem: ActionItem) {
    this.id = actionItem.id;
  }

  get textValue(): string {
    return this.actionItem.attributes.content;
  }

  get isChecked(): boolean {
    return this.actionItem.attributes.isComplete;
  }
}

export function ActionItemsComponent(
  props: ActionItemsComponentProperties,
): React.ReactElement {
  const service = new ActionItemsService();
  const [actionItems, setActionItems] = useState<ActionItemCheckboxText[]>([]);

  const createActionItem = async (text: string) => {
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

  const updateActionItemText = async (itemID: string, text: string) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        content: text,
      },
    });
  };

  const updateActionItemCompleted = async (
    itemID: string,
    isComplete: boolean,
  ) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        isComplete,
      },
    });
  };

  const loadActionItems = async (meetingID: string) => {
    const items = await service.listForParent(props.spaceID, meetingID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setActionItems(items.map((x) => new ActionItemCheckboxText(x)));
  };

  useEffect(() => {
    loadActionItems(props.meeting.id);
  }, []);

  return (
    <div>
      <TextareaCheckboxListComponent
        items={actionItems}
        newItemPlaceholder="New action item"
        onNewItemCreateRequest={createActionItem}
        onItemUpdateRequest={updateActionItemText}
        onCheckboxUpdateRequest={updateActionItemCompleted}
      />
    </div>
  );
}
