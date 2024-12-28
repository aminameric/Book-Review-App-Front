import { Category } from './Category';

export interface Book {
    id: number;
    title: string;
    author: string;
    readingStatus: string;
    categoryId: number;
    category: Category; 
    userBooks: any[];
    review?: {
        content: string;
        rating: number;
    };
}