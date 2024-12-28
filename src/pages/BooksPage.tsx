import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {AddButton, BooksWrapper, CategoryCard, CategoryHeader, BooksContainer, BookItem, Stars, ReviewContent, ModalOverlay, ModalContent, Input, Select, ModalButton, CancelButton, ErrorMessage, OptionalHeading, LogoutButton, HeaderActions, Progress, ReadingProgressLabel, ReviewSection, Navbar, Logo, NavText, GenerateButton, IconWrapper, EditIcon, DeleteIcon} from "../styles/BooksPageStyles"; 
import LogoImage from "../assets/logobook.png";  
import { Book } from "../types/Book";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: Book[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCategory, setGeneratedCategory] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
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

    const fetchReviewsForBooks = async (books: Book[]) => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const userId = localStorage.getItem("userId");
      
        if (!userId) {
          console.error("User ID is missing.");
          return books; // Return the original books if user ID is missing
        }
      
        const booksWithReviews = await Promise.all(
          books.map(async (book) => {
            try {
              const response = await fetch(`${baseUrl}/user-books/review?bookId=${book.id}&userId=${userId}`);
              if (!response.ok) {
                throw new Error("Failed to fetch review for book: " + book.id);
              }
              const review = await response.json();
              return { ...book, review }; // Add review to the book object
            } catch (error) {
              console.error(`Error fetching review for book ID ${book.id}:`, error);
              return book; // Return the book without a review if an error occurs
            }
          })
        );
      
        return booksWithReviews;
      };
      
      
    

      const fetchBooks = async () => {
        try {
          const baseUrl = process.env.REACT_APP_API_BASE_URL;
      
          // Fetch books
          const response = await fetch(`${baseUrl}/books/user?email=${email}`);
          if (!response.ok) {
            throw new Error("Failed to fetch books.");
          }
          const booksData = await response.json();
      
          // Fetch reviews and merge them into books
          const booksWithReviews = await fetchReviewsForBooks(booksData);
      
          setBooks(booksWithReviews);
          setGroupedBooks(groupBooksByCategory(booksWithReviews));
        } catch (error) {
          console.error("Error fetching books and/or reviews:", error);
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

  const handleGenerateCategory = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL; // Ensure this is correctly set
      const response = await fetch(`${baseUrl}/categories/suggest?title=${encodeURIComponent(newBook.title)}`);

      
      if (!response.ok) {
        throw new Error("Failed to fetch category suggestion.");
      }
      
      const category = await response.text(); // Parse as plain text
      setNewBook({ ...newBook, categoryName: category });
    } catch (error) {
      console.error("Error fetching category suggestion:", error);
    }
  };

  //deletion of book
  const confirmDelete = (bookId: number) => {
    setIsDeletePopupOpen(true);
    setBookToDelete(bookId);
  };
  
  const handleDeleteBook = async (bookId: number) => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/books/${bookId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }
  
      // Refresh book list after deletion
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
      setGroupedBooks(groupBooksByCategory(updatedBooks));
      setIsDeletePopupOpen(false);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleAddBook = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
  
      // Add the book first
      const bookResponse = await fetch(`${baseUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBook.title,
          author: newBook.author,
          categoryName: newBook.categoryName,
          readingStatus: newBook.readingStatus,
          userId: parseInt(userId || "0"),
        }),
      });
  
      if (!bookResponse.ok) {
        throw new Error("Failed to add the book.");
      }
  
      const addedBook: Book = await bookResponse.json();
  
      // If review details are provided, add the review
      if (newBook.reviewContent && newBook.reviewRating > 0) {
        const reviewResponse = await fetch(`${baseUrl}/user-books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newBook.reviewContent,
            rating: newBook.reviewRating,
            userId: parseInt(userId || "0"),
            bookId: addedBook.id, // Use the ID of the newly added book
          }),
        });
  
        if (!reviewResponse.ok) {
          throw new Error("Failed to add the review.");
        }
      }
  
      // Refresh the books list
      setBooks((prevBooks) => [...prevBooks, addedBook]);
      setGroupedBooks(groupBooksByCategory([...books, addedBook]));
  
      // Reset the modal
      setIsModalOpen(false);
      setNewBook({
        title: "",
        author: "",
        categoryName: "",
        readingStatus: "",
        reviewContent: "",
        reviewRating: 0,
      });
      setGeneratedCategory(""); // Reset generated category
    } catch (error) {
      console.error("Error adding book and/or review:", error);
    }
  };
  

    function handleEdit(book: Book): void {
        throw new Error("Function not implemented.");
    }

  return (
    <>
      <Navbar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo src={LogoImage} alt="Book Logo" />
          <NavText>My Book Tracker</NavText>
        </div>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Navbar>
  
      <BooksWrapper>
        <HeaderActions>
          <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
        </HeaderActions>
  
        {Object.keys(groupedBooks).map((category) => (
          <CategoryCard key={category}>
            <CategoryHeader>{category}</CategoryHeader>
            <BooksContainer>
              {groupedBooks[category].map((book) => (
                <BookItem key={book.id}>
                  {book.review && <Stars>{"★".repeat(book.review.rating)}</Stars>}
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>
                    <ReadingProgressLabel>Reading Progress:</ReadingProgressLabel>
                    {book.readingStatus}
                  </p>
                  {book.review && (
                    <ReviewSection>
                      <p>
                        <strong>Review:</strong> {book.review.content}
                      </p>
                    </ReviewSection>
                  )}
                  <IconWrapper>
                    <EditIcon onClick={() => handleEdit(book)}>✏️</EditIcon>
                    <DeleteIcon onClick={() => confirmDelete(book.id)}>🗑️</DeleteIcon>
                  </IconWrapper>
                </BookItem>
              ))}
            </BooksContainer>
          </CategoryCard>
        ))}
  
        {/* Add Book Modal */}
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
                  onChange={(e) =>
                    setNewBook({ ...newBook, categoryName: e.target.value })
                  }
                />
                <GenerateButton type="button" onClick={handleGenerateCategory}>
                  Generate Category
                </GenerateButton>
                <Select
                  value={newBook.readingStatus}
                  onChange={(e) =>
                    setNewBook({ ...newBook, readingStatus: e.target.value })
                  }
                  required
                >
                  <option value="">Select Reading Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Select>
                <OptionalHeading>Optional Review Details</OptionalHeading>
                <Input
                  type="text"
                  placeholder="Summary of Review"
                  value={newBook.reviewContent}
                  onChange={(e) =>
                    setNewBook({ ...newBook, reviewContent: e.target.value })
                  }
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
  
        {/* Delete Confirmation Modal */}
        {isDeletePopupOpen && (
          <ModalOverlay>
            <ModalContent>
              <h2>Are you sure you want to delete this book?</h2>
              <div>
                <ModalButton onClick={() => bookToDelete !== null ? handleDeleteBook(bookToDelete) : null}>
                  Yes, Delete
                </ModalButton>
                <CancelButton onClick={() => setIsDeletePopupOpen(false)}>
                  Cancel
                </CancelButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </BooksWrapper>
    </>
  );
};



export default BooksPage;
