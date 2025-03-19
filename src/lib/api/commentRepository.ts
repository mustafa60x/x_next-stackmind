import { BaseRepository } from './baseRepository';

export class CommentRepository extends BaseRepository {
  private readonly RESOURCE = '/comments';

  async createComment(postId: string, content: string) {
    return this.fetch(`${this.RESOURCE}/create`, {
      method: 'POST',
      body: JSON.stringify({ content, postId }),
    });
  }
}

export const commentRepository = new CommentRepository();