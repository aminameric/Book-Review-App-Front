import axios from 'axios';
import { Book } from '../types/Book';

const BASE_URL = 'http://localhost:8080';

export const fetchBooksByUserEmail = async (email: string): Promise<Book[]> => {
  const response = await axios.get(`${BASE_URL}/books?userEmail=${email}`);
  return response.data;
};
