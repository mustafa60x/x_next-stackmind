import { BaseRepository } from "./baseRepository";

export class AuthRepository extends BaseRepository {
  private readonly RESOURCE = "/auth";

  /* constructor() {
    super();
  } */

  async register(username: string, password: string) {
    return this.fetch<{
      token: string;
      user: { id: string; username: string };
    }>(`${this.RESOURCE}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string, csrfToken: string) {
    return this.fetch<{
      token: string;
      user: { id: string; username: string };
    }>(`${this.RESOURCE}/login`, {
      method: "POST",
      credentials: "include", // Cookie’leri dahil et
      body: JSON.stringify({ username, password, csrfToken }),
    });
  }

  async getProfile() {
    return this.fetch<{ id: string; username: string }>(`${this.RESOURCE}/me`);
  }
}

export const authRepository = new AuthRepository();
