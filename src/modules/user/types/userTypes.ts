export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface UserState {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
  }
  