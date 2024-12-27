import axios from 'axios';
import { Category } from '../types/Category';

const BASE_URL = 'http://localhost:8080';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};
