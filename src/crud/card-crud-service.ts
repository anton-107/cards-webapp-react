import { CardsCRUDApi } from "cards-webserver-client-ts-axios/dist/api";

const API_ROOT = `http://localhost:3000`;
const api = new CardsCRUDApi({ isJsonMime: () => true }, API_ROOT);

export interface Card {
  id: string;
  name: string;
  parentCardID: string | "";
  attributes: { [key: string]: string | number | boolean | null };
}

export abstract class CardCRUDService<T extends Card> {
  abstract get type(): string;

  public async listAll(): Promise<T[]> {
    const resp = await api.cardControllerFindAll({
      type: this.type,
    });
    return resp.data as unknown as T[];
  }

  public async listForParent(parentCardID: string): Promise<T[]> {
    const resp = await api.cardControllerFindChildren({
      type: this.type,
      parentID: parentCardID,
    });
    return resp.data as unknown as T[];
  }
  public async getOne(cardID: string): Promise<T> {
    const resp = await api.cardControllerFindOne({
      id: cardID,
      type: this.type,
    });
    return resp.data as unknown as T;
  }
  public async addOne(addRequest: Omit<T, "id">) {
    const resp = await api.cardControllerCreate({
      type: this.type,
      createCardDto: {
        ...addRequest,
        spaceID: "space-1",
      },
    });
    return resp.data as unknown as T[];
  }
  public async deleteOne(cardID: string) {
    const resp = await api.cardControllerRemove({
      type: this.type,
      id: cardID,
    });
    return resp.data as unknown as T[];
  }
}
