// components/BookItem.tsx
import React from 'react';
import { Book } from '../types/Book';
import { BookItem, Stars, ReviewSection, IconWrapper, EditIcon, DeleteIcon } from "../styles/BooksPageStyles";

// Define the type for props
interface BookItemProps {
    book: Book;
    handleEdit: (book: Book) => void;
    confirmDelete: (bookId: number) => void;
}

const BookItemComponent: React.FC<BookItemProps> = ({ book, handleEdit, confirmDelete }) => (
    <BookItem>
        {book.review && <Stars>{"★".repeat(book.review.rating)}</Stars>}
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p><strong>Reading Progress:</strong> {book.readingStatus}</p>
        {book.review && (
            <ReviewSection>
                <p><strong>Review:</strong> {book.review.content}</p>
            </ReviewSection>
        )}
        <IconWrapper>
            <EditIcon onClick={() => handleEdit(book)}>✏️</EditIcon>
            <DeleteIcon onClick={() => confirmDelete(book.id)}>🗑️</DeleteIcon>
        </IconWrapper>
    </BookItem>
);

export default BookItemComponent;
