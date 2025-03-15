export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  score: number;
  createdAt: string;
}

export const users: User[] = [];
export const posts: Post[] = [];
export const comments: Comment[] = [];