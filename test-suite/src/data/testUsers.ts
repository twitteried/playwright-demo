export interface User {
  username: string;
  password: string;
  role: 'admin' | 'customer' | 'manager';
  email: string;
}

export const users: Record<string, User> = {
  admin: {
    username: 'admin@example.com',
    password: 'admin_password',
    role: 'admin',
    email: 'admin@example.com'
  },
  manager: {
    username: 'manager@example.com',
    password: 'manager_password',
    role: 'manager',
    email: 'manager@example.com'
  },
  customer: {
    username: 'customer@example.com',
    password: 'customer_password',
    role: 'customer',
    email: 'customer@example.com'
  },
};