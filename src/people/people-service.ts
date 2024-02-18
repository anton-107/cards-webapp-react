import {
  CardsCRUDApi,
  CreateCardDto,
} from "cards-webserver-client-ts-axios/dist/api";

export interface Person {
  id: string;
  name: string;
  attributes: {
    email: string;
  };
}

export type PersonCreationRequest = Omit<Person, "id">;

export type AddPersonRequest = CreateCardDto;

const API_ROOT = `http://localhost:3000`;
const api = new CardsCRUDApi({ isJsonMime: () => true }, API_ROOT);

export class PeopleService {
  public async listAll(): Promise<Person[]> {
    const resp = await api.cardControllerFindAll({
      type: "person",
    });
    return resp.data as unknown as Person[];
  }
  public async addOne(person: PersonCreationRequest) {
    const resp = await api.cardControllerCreate({
      type: "person",
      createCardDto: {
        ...person,
        spaceID: "space-1",
        parentTaskID: "",
      },
    });
    return resp.data as unknown as Person[];
  }
  public async deleteOne(personID: string) {
    const resp = await api.cardControllerRemove({
      type: "person",
      id: personID,
    });
    return resp.data as unknown as Person[];
  }
}
