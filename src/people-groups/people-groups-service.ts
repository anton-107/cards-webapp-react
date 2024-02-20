import { Card, CardCRUDService } from "../crud/card-crud-service";

export interface PeopleGroup extends Card {
  id: string;
  name: string;
  attributes: Record<string, never>;
}

export class PeopleGroupService extends CardCRUDService<PeopleGroup> {
  get type(): string {
    return "people-group";
  }
}
