export interface User {
  id: string;
  username: string;
  password: string; // Hashlenmiş hali saklanacak
}

export const users: User[] = [];
