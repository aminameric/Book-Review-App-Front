// components/BookList.tsx
import React from 'react';
import BookItemComponent from "./BookItem";
import { CategoryCard, CategoryHeader, BooksContainer } from "../styles/BooksPageStyles";
import { Book } from "../types/Book";

// Define the props type for better clarity
interface BookListProps {
    groupedBooks: { [key: string]: Book[] };
    handleEdit: (book: Book) => void;
    confirmDelete: (bookId: number) => void;
}

const BookList: React.FC<BookListProps> = ({ groupedBooks, handleEdit, confirmDelete }) => (
    <>
        {Object.keys(groupedBooks).map((category) => (
            <CategoryCard key={category}>
                <CategoryHeader>{category}</CategoryHeader>
                <BooksContainer>
                    {groupedBooks[category].map((book) => (
                        <BookItemComponent
                            key={book.id}
                            book={book}
                            handleEdit={handleEdit}
                            confirmDelete={confirmDelete}
                        />
                    ))}
                </BooksContainer>
            </CategoryCard>
        ))}
    </>
);

export default BookList;
