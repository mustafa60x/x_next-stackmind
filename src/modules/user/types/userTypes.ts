export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface UserState {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
  }
  