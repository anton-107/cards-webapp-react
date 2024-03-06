import { Card, CardCRUDService } from "../../crud/card-crud-service";

export interface ActionItem extends Card {
  attributes: {
    isComplete: boolean;
    order: number;
    content: string;
  };
}

export class ActionItemsService extends CardCRUDService<ActionItem> {
  get type(): string {
    return "action-item";
  }
}
