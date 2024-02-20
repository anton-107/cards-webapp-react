import { Card, CardCRUDService } from "../crud/card-crud-service";

export interface Person extends Card {
  attributes: {
    email: string;
    groupID: string;
  };
}

export class PeopleService extends CardCRUDService<Person> {
  get type(): string {
    return "person";
  }
}
