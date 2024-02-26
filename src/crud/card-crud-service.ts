import {
  CardsCRUDApi,
  UpdateCardDto,
} from "cards-webserver-client-ts-axios/dist/api";

import { API_ROOT } from "../environment";

export interface Card {
  id: string;
  name: string;
  parentCardID: string | "";
  attributes: { [key: string]: string | number | boolean | null };
}

interface CardUpdateRecord extends UpdateCardDto {
  id?: string;
  type?: string;
}

export abstract class CardCRUDService<T extends Card> {
  abstract get type(): string;

  private get api(): CardsCRUDApi {
    return new CardsCRUDApi(
      {
        isJsonMime: () => true,
        accessToken: localStorage.getItem("BEARER_TOKEN") || "",
      },
      API_ROOT,
    );
  }

  public async listAll(): Promise<T[]> {
    const resp = await this.api.cardControllerFindAll({
      type: this.type,
    });
    return resp.data as unknown as T[];
  }

  public async listForParent(parentCardID: string): Promise<T[]> {
    const resp = await this.api.cardControllerFindChildren({
      type: this.type,
      parentID: parentCardID,
    });
    return resp.data as unknown as T[];
  }
  public async getOne(cardID: string): Promise<T> {
    const resp = await this.api.cardControllerFindOne({
      id: cardID,
      type: this.type,
    });
    return resp.data as unknown as T;
  }
  public async addOne(addRequest: Omit<T, "id">) {
    const resp = await this.api.cardControllerCreate({
      type: this.type,
      createCardDto: {
        ...addRequest,
        spaceID: "space-1",
      },
    });
    return resp.data as unknown as T[];
  }
  public async updateOne(updateRequest: T) {
    const dto: CardUpdateRecord = { ...updateRequest, spaceID: "space-1" };
    delete dto.id;
    delete dto.type;
    const resp = await this.api.cardControllerUpdate({
      id: updateRequest.id,
      type: this.type,
      updateCardDto: dto,
    });
    return resp.data as unknown as T[];
  }
  public async deleteOne(cardID: string) {
    const resp = await this.api.cardControllerRemove({
      type: this.type,
      id: cardID,
    });
    return resp.data as unknown as T[];
  }
}
