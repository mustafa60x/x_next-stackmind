import { BaseRepository } from './baseRepository';

export class CommentRepository extends BaseRepository {
  private readonly RESOURCE = '/comments';

  async createComment(token: string, postId: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content, postId }),
    });
  }
}

export const commentRepository = new CommentRepository();