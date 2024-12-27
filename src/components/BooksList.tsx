import React, { useEffect, useState } from 'react';
import { fetchBooksByUserEmail } from '../api/bookApi';
import { Book } from '../types/Book';
import { useSearchParams } from 'react-router-dom';

const BooksList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooksByUserEmail(email);
        setBooks(data);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [email]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const groupedBooks = books.reduce((acc: any, book) => {
    acc[book.category.name] = acc[book.category.name] || [];
    acc[book.category.name].push(book);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedBooks).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {groupedBooks[category].map((book: Book) => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BooksList;
