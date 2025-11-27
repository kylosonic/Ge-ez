import { User } from '../types';

const USERS_KEY = 'stylehive_users';
const CURRENT_USER_KEY = 'stylehive_user';

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

const getUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const registerUser = (name: string, email: string, password: string): AuthResponse => {
  const users = getUsers();
  
  if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'Account with this email already exists.' };
  }

  const newUser = {
    name,
    email,
    password, 
    role: 'customer',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto-login
  const { password: _, ...userWithoutPass } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
  
  return { success: true, user: userWithoutPass as User };
};

export const loginUser = (email: string, password: string): AuthResponse => {
  // Hardcoded Admin for easy access
  if (email === 'admin@geezshirts.com' && password === 'admin123') {
    const adminUser: User = {
      name: "Ge'ez Admin",
      email: 'admin@geezshirts.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=1c1917&color=fff'
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }

  const users = getUsers();
  const foundUser = users.find((u: any) => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (foundUser) {
    const { password: _, ...userWithoutPass } = foundUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
    return { success: true, user: userWithoutPass as User };
  }

  return { success: false, message: 'Invalid email or password.' };
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};