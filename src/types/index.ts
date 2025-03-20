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
  user: User;
  created_at: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  user_id: string;
  post_id: string;
  created_at: string;
}
