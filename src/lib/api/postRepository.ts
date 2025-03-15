import { BaseRepository } from './baseRepository';

export class PostRepository extends BaseRepository {
  private readonly RESOURCE = '/posts';

  async createPost(token: string, title: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });
  }

  async getPosts() {
    return this.fetch(`${this.RESOURCE}`);
  }

  async createComment(token: string, postId: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content, postId }),
    });
  }
}

export const postRepository = new PostRepository();