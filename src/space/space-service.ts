import { SpaceCRUDApi } from "cards-webserver-client-ts-axios/dist/api";

import { API_ROOT } from "../environment";

interface Space {
  spaceID: string;
}

export class SpaceService {
  private get api(): SpaceCRUDApi {
    return new SpaceCRUDApi(
      {
        isJsonMime: () => true,
        accessToken: localStorage.getItem("BEARER_TOKEN") || "",
      },
      API_ROOT,
    );
  }

  public async listAll(): Promise<Space[]> {
    const resp = await this.api.spaceControllerFindAll();
    return (resp.data as unknown as { spaces: Space[] }).spaces;
  }
}
