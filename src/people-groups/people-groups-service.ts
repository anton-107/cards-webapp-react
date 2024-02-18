import { CardsCRUDApi } from "cards-webserver-client-ts-axios/dist/api";

export interface PeopleGroup {
  id: string;
  name: string;
  attributes: Record<string, never>;
}

export type PeopleGroupCreationRequest = Omit<PeopleGroup, "id">;

const API_ROOT = `http://localhost:3000`;
const api = new CardsCRUDApi({ isJsonMime: () => true }, API_ROOT);

const resourceType = "people-group";

export class PeopleGroupService {
  public async listAll(): Promise<PeopleGroup[]> {
    const resp = await api.cardControllerFindAll({
      type: resourceType,
    });
    return resp.data as unknown as PeopleGroup[];
  }
  public async addOne(person: PeopleGroupCreationRequest) {
    const resp = await api.cardControllerCreate({
      type: resourceType,
      createCardDto: {
        ...person,
        spaceID: "space-1",
        parentTaskID: "",
      },
    });
    return resp.data as unknown as PeopleGroup[];
  }
  public async deleteOne(personID: string) {
    const resp = await api.cardControllerRemove({
      type: resourceType,
      id: personID,
    });
    return resp.data as unknown as PeopleGroup[];
  }
}
