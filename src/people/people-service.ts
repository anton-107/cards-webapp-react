export interface Person {
  id: string;
  name: string;
  email: string;
}

export interface AddPersonRequest {
  "person-name": string;
  "person-email": string;
}

const API_ROOT = `http://localhost:3000`;

export class PeopleService {
  public async listAll(): Promise<Person[]> {
    const request = await fetch(`${API_ROOT}/card/checkbox`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const resp = await request.json();
    return resp;
  }
  public async addOne(person: AddPersonRequest) {
    const request = await fetch(`${API_ROOT}/person`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
      credentials: "include",
    });
    const resp = await request.json();
    return resp;
  }
  public async deleteOne(personID: string) {
    const request = await fetch(`${API_ROOT}/delete-person`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "person-id": personID }),
      credentials: "include",
    });
    const resp = await request.json();
    return resp;
  }
}
