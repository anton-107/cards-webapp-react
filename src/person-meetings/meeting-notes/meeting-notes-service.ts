import { Card, CardCRUDService } from "../../crud/card-crud-service";

export interface MeetingNote extends Card {
  attributes: {
    order: number;
    content: string;
  };
}

export class MeetingNotesService extends CardCRUDService<MeetingNote> {
  get type(): string {
    return "meeting-note";
  }
}
