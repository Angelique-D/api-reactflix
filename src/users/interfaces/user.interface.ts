export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  updateAt: Date;
}
