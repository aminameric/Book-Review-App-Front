import { Category } from './Category';

export interface Book {
    id: number;
    title: string;
    author: string;
    readingStatus: string;
    categoryId: number;
    category: Category; // Include the category object here
    userBooks: any[];
}