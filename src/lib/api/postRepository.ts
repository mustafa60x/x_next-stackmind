import { BaseRepository } from './baseRepository';

export class PostRepository extends BaseRepository {
  private readonly RESOURCE = '/posts';

  async createPost(title: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  }

  async getPosts() {
    return this.fetch(`${this.RESOURCE}`);
  }

  async getPost(id: string) {
    return this.fetch(`${this.RESOURCE}/${id}`);
  }

  async createComment(postId: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      body: JSON.stringify({ content, postId }),
    });
  }
}

export const postRepository = new PostRepository();