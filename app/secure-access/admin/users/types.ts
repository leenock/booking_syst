export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export type NewUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
} 