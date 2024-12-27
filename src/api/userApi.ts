import axios from 'axios';
import { User } from '../types/User';

const BASE_URL = 'http://localhost:8080';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
};
