import { API_ROOT } from "../environment";

export const BEARER_TOKEN = "BEARER_TOKEN";

interface SignInResult {
  isAuthenticated: boolean;
}
interface AuthenticationResult {
  isAuthenticated: boolean;
  username: string;
}

export class AuthService {
  public async signIn(
    username: string,
    password: string,
  ): Promise<SignInResult> {
    const request = await fetch(`${API_ROOT}/auth/signin`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: username,
        password: password,
      }),
      credentials: "include",
    });
    const resp = await request.json();
    localStorage.setItem(BEARER_TOKEN, resp.bearerToken);

    return {
      isAuthenticated: false,
    };
  }
  public async checkAuthentication(): Promise<AuthenticationResult> {
    const request = await fetch(`${API_ROOT}/auth/whoami`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(BEARER_TOKEN)}`,
      },
      credentials: "include",
    });
    const resp = await request.json();

    return resp;
  }
  public async signOut(): Promise<void> {
    const request = await fetch(`${API_ROOT}/auth/signout`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    await request.blob();
    localStorage.setItem(BEARER_TOKEN, "");
  }
}
