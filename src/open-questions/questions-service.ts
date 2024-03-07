import { Card, CardCRUDService } from "../crud/card-crud-service";

export interface Question extends Card {
  attributes: {
    isCrossedOff: boolean;
    order: number;
    content: string;
    recipients: string[];
  };
}

export class QuestionsService extends CardCRUDService<Question> {
  get type(): string {
    return "question";
  }
}
