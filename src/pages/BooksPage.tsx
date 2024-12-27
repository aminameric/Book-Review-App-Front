import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Book } from "../types/Book";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: any[] }>({});
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get email from query parameters
  const email = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    if (!email) {
      setError("User email is missing. Please login.");
      navigate("/"); // Redirect back to login
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books/user?email=${email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }
        const data = await response.json();

        setBooks(data);

        // Group books by category
        const grouped = groupBooksByCategory(data);
        setGroupedBooks(grouped);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again.");
      }
    };

    fetchBooks();
  }, [email]);

 // Group books by category
 const groupBooksByCategory = (books: Book[]) => {
    return books.reduce((acc, book) => {
      const categoryName = book.category?.name || "Uncategorized"; // Use `category.name` from the nested object
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  };
  
  
  
  
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  
  return (
    <div>
      {Object.keys(groupedBooks).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {groupedBooks[category].map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> by {book.author}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  
}

export default BooksPage;
