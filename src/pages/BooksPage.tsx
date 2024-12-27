import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Book } from "../types/Book";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: any[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", categoryName: "", readingStatus: "", userId: localStorage.getItem("userId")});

  const location = useLocation();
  const navigate = useNavigate();

  // API base URL from environment variable
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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
        const response = await fetch(`${apiBaseUrl}/books/user?email=${email}`);
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
  }, [email, apiBaseUrl]);

  // Group books by category
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
        const response = await fetch(`${apiBaseUrl}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBook),
        });

        if (!response.ok) {
            throw new Error("Failed to add the book.");
        }

        const addedBook = await response.json();

        // Refresh books after adding
        setBooks((prevBooks) => [...prevBooks, addedBook]);
        setGroupedBooks(groupBooksByCategory([...books, addedBook]));

        setIsModalOpen(false);
        setNewBook({
            title: "",
            author: "",
            categoryName: "",
            readingStatus: "",
            userId: localStorage.getItem("userId"),
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
      <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>

      {Object.keys(groupedBooks).map((category) => (
        <CategoryCard key={category}>
          <CategoryHeader>{category}</CategoryHeader>
          <BooksContainer>
            {groupedBooks[category].map((book) => (
              <BookItem key={book.id}>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
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
                handleAddBook();
              }}
            >
              <Input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Category Name"
                value={newBook.categoryName}
                onChange={(e) => setNewBook({ ...newBook, categoryName: e.target.value })}
              />
              <Select
                value={newBook.readingStatus}
                onChange={(e) => setNewBook({ ...newBook, readingStatus: e.target.value })}
              >
                <option value="">Select Reading Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Select>
              <ModalButton type="submit">Add</ModalButton>
              <CancelButton onClick={() => setIsModalOpen(false)}>Cancel</CancelButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </BooksWrapper>
  );
};


// Styled Components


const CategoriesGrid = styled.div`

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;


const BooksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #FAF3E0;
  min-height: 100vh;
`;

const CategoryCard = styled.div`
  background: #F9F9F9;
  border-radius: 12px;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryHeader = styled.h2`
  background: #B7A57A;
  color: #4A4A4A;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1rem;
`;

const BooksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const BookItem = styled.div`
  background: #FFFFFF;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 120px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    color: #555;
    margin: 0;
  }
`;

const BooksGrid = styled.div`

  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const BookCard = styled.div`
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 180px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const BookTitle = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: block;
`;

const AuthorText = styled.span`
  font-size: 1rem;
  color: #555;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 2rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #B7A57A;
    box-shadow: 0 0 0 2px rgba(183, 165, 122, 0.2);
  }
`;

const AddButton = styled.button`
  background: #B7A57A;
  color: #4A4A4A;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButton = styled.button`
  background: #B7A57A;
  color: #4A4A4A;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #F9F9F9;
  color: #4A4A4A;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;
`;

export default BooksPage;
