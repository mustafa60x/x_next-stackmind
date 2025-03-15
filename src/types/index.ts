export interface User {
  id: string;
  username: string;
}

export interface DecodedToken {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  score: number;
  createdAt: string;
}
