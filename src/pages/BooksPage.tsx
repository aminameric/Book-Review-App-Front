import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {AddButton, BooksWrapper, CategoryCard, CategoryHeader, BooksContainer, BookItem, Stars, ReviewSection, ModalOverlay, ModalContent, Input, Select, ModalButton, CancelButton, ErrorMessage, OptionalHeading, LogoutButton, HeaderActions} from "../styles/BooksPageStyles"; // Adjust the path as necessary
  
import { Book } from "../types/Book";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: Book[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    categoryName: "",
    readingStatus: "",
    reviewContent: "",
    reviewRating: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/"); // Redirect to login page
  };

  const email = new URLSearchParams(location.search).get("email");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!email) {
      setError("User email is missing. Please login.");
      navigate("/");
      return;
    }

    const fetchBooks = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/books/user?email=${email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }
        const data = await response.json();
        setBooks(data);
        setGroupedBooks(groupBooksByCategory(data));
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again.");
      }
    };

    fetchBooks();
  }, [email]);

  const groupBooksByCategory = (books: Book[]) => {
    return books.reduce((acc, book) => {
      const categoryName = book.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  };

  const handleAddBook = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBook,
          userId: parseInt(userId || "0"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add the book.");
      }

      const addedBook = await response.json();
      setBooks((prevBooks) => [...prevBooks, addedBook]);
      setGroupedBooks(groupBooksByCategory([...books, addedBook]));
      setIsModalOpen(false);
      setNewBook({
        title: "",
        author: "",
        categoryName: "",
        readingStatus: "",
        reviewContent: "",
        reviewRating: 0,
      });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <BooksWrapper>
    <HeaderActions>
    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
  </HeaderActions>
      {Object.keys(groupedBooks).map((category) => (
        <CategoryCard key={category}>
          <CategoryHeader>{category}</CategoryHeader>
          <BooksContainer>
            {groupedBooks[category].map((book) => (
              <BookItem key={book.id}>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <p>
                  <strong>Reading Progress:</strong> {book.readingStatus}
                </p>
                {book.review ? (
                  <ReviewSection>
                    <p>
                      <strong>Review:</strong> {book.review.content}
                    </p>
                    <Stars>{"★".repeat(book.review.rating)}</Stars>
                  </ReviewSection>
                ) :null}
              </BookItem>
            ))}
          </BooksContainer>
        </CategoryCard>
      ))}

{isModalOpen && (
  <ModalOverlay>
    <ModalContent>
      <h2>Add a New Book</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddBook(); // Ensure this handles optional fields correctly
        }}
      >
        <Input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Category Name"
          value={newBook.categoryName}
          onChange={(e) => setNewBook({ ...newBook, categoryName: e.target.value })}
          required
        />
        <Select
          value={newBook.readingStatus}
          onChange={(e) => setNewBook({ ...newBook, readingStatus: e.target.value })}
          required
        >
          <option value="">Select Reading Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>

        {/* Optional Fields Section */}
        <OptionalHeading>Optional Review Details</OptionalHeading>
        <Input
          type="text"
          placeholder="Summary of Review"
          value={newBook.reviewContent}
          onChange={(e) => setNewBook({ ...newBook, reviewContent: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Review Rating (1-5)"
          value={newBook.reviewRating || ""}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              reviewRating: parseInt(e.target.value) || 0,
            })
          }
          min="1"
          max="5"
        />
        <ModalButton type="submit">Add</ModalButton>
        <CancelButton onClick={() => setIsModalOpen(false)}>Cancel</CancelButton>
      </form>
    </ModalContent>
  </ModalOverlay>
)}

    </BooksWrapper>
  );
};



export default BooksPage;
