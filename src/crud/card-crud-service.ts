import {
  CardsCRUDApi,
  UpdateCardDto,
} from "cards-webserver-client-ts-axios/dist/api";

import { API_ROOT } from "../environment";

type CardAttributes = {
  [key: string]: string | number | boolean | null | string[];
};

export interface Card {
  id: string;
  name: string;
  parentCardID: string | "";
  attributes: CardAttributes;
}

interface CardUpdateRecord extends UpdateCardDto {
  id?: string;
  type?: string;
}

type AttributesType<T extends Card> = T["attributes"];

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

  public async listAll(spaceID: string): Promise<T[]> {
    const resp = await this.api.cardControllerFindAllInSpace({
      spaceID,
      type: this.type,
    });
    return resp.data as unknown as T[];
  }

  public async listForParent(
    spaceID: string,
    parentCardID: string,
  ): Promise<T[]> {
    const resp = await this.api.cardControllerFindChildren({
      spaceID,
      type: this.type,
      parentID: parentCardID,
    });
    return resp.data as unknown as T[];
  }
  public async getOne(spaceID: string, cardID: string): Promise<T> {
    const resp = await this.api.cardControllerFindOne({
      spaceID,
      id: cardID,
      type: this.type,
    });
    return resp.data as unknown as T;
  }
  public async addOne(spaceID: string, addRequest: Omit<T, "id">) {
    const resp = await this.api.cardControllerCreate({
      type: this.type,
      createCardDto: {
        ...addRequest,
        spaceID,
      },
    });
    return resp.data as unknown as T;
  }
  public async updateOne(spaceID: string, updateRequest: T) {
    const dto: CardUpdateRecord = { ...updateRequest, spaceID };
    delete dto.id;
    delete dto.type;
    const resp = await this.api.cardControllerUpdate({
      id: updateRequest.id,
      type: this.type,
      updateCardDto: dto,
    });
    return resp.data as unknown as T;
  }
  public async updateAttributes(
    spaceID: string,
    cardID: string,
    updateRequest: { attributes: Partial<AttributesType<T>> },
  ) {
    const resp = await this.api.cardControllerUpdateCardAttributes({
      id: cardID,
      type: this.type,
      updateCardAttributesDto: {
        spaceID,
        attributes: updateRequest.attributes,
      },
    });
    return resp.data as unknown as T;
  }
  public async deleteOne(spaceID: string, cardID: string) {
    const resp = await this.api.cardControllerRemove({
      spaceID,
      type: this.type,
      id: cardID,
    });
    return resp.data as unknown as T;
  }
}
