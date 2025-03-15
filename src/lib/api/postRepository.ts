import { BaseRepository } from './baseRepository';

export class PostRepository extends BaseRepository {
  async createPost(token: string, title: string, content: string) {
    return this.fetch('/api/posts/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });
  }

  async getPosts() {
    return this.fetch('/api/posts');
  }

  async createComment(token: string, postId: string, content: string) {
    return this.fetch('/api/comments/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content, postId }),
    });
  }
}

export const postRepository = new PostRepository();