import { Card, CardCRUDService } from "../../crud/card-crud-service";

export interface DiscussionPoint extends Card {
  attributes: {
    isComplete: boolean;
    order: number;
    content: string;
  };
}

export class DiscussionPointsService extends CardCRUDService<DiscussionPoint> {
  get type(): string {
    return "discussion-point";
  }
}
