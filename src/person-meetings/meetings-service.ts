import { Card, CardCRUDService } from "../crud/card-crud-service";

export interface Meeting extends Card {
  attributes: {
    dateStart: string;
    createdAt: number;
  };
}

export class MeetingsService extends CardCRUDService<Meeting> {
  get type(): string {
    return "meeting";
  }
}
