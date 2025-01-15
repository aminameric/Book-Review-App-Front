import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import BookList from "../components/BookList";
import AddBookModal from "../components/AddBookModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditBookModal from "../components/EditBookModal";
import BookFilters from "../components/BookFilters";
import { BooksWrapper, AddButton, HeaderActions } from "../styles/BooksPageStyles";
import { Book } from "../types/Book";
import API_BASE_URL from "../config";
import styled from "styled-components";

interface NewBookState {
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent: string;
    reviewRating: number;
}

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: Book[] }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<number | null>(null);
    const [editedBook, setEditedBook] = useState<Book | null>(null);
    const [newBook, setNewBook] = useState<NewBookState>({
        title: "",
        author: "",
        categoryName: "",
        readingStatus: "",
        reviewContent: "",    
        reviewRating: 0,      
    });
    const [filters, setFilters] = useState({
        title: '',
        author: '',
        readingStatus: '',
        category: '',
        sortBy: 'title',
        order: 'asc'
    });


    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const fetchBooks = useCallback(async (useFilters = false) => {
        try {
            const email = localStorage.getItem("userEmail");
            if (!email) {
                console.error("No email found in localStorage.");
                return;
            }

            // Dynamically choose between filtered and unfiltered fetch
            const queryParams = new URLSearchParams({
                title: useFilters ? filters.title : "",
                author: useFilters ? filters.author : "",
                readingStatus: useFilters ? filters.readingStatus : "",
                category: useFilters ? filters.category : "",
                sortBy: filters.sortBy || "title",
                order: filters.order || "asc",
            }).toString();

            const url = useFilters
                ? `${API_BASE_URL}/books/filter?${queryParams}`
                : `${API_BASE_URL}/books/user?email=${encodeURIComponent(email)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch books.");

            const booksData = await response.json();
            const booksWithReviews = await fetchReviewsForBooks(booksData);
            setBooks(booksWithReviews);
            setGroupedBooks(groupBooksByCategory(booksWithReviews));
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }, [filters]);  

    const fetchReviewsForBooks = async (books: Book[]) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("No user ID found in localStorage.");
            return books;
        }

        return await Promise.all(
            books.map(async (book) => {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/user-books/review?bookId=${book.id}&userId=${userId}`
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch review for book ID: ${book.id}`);
                    }
                    const review = await response.json();
                    return { ...book, review };
                } catch (error) {
                    console.error(`Error fetching review for book ID ${book.id}:`, error);
                    return book;
                }
            })
        );
    };

    const groupBooksByCategory = (books: Book[]) => {
        return books.reduce((acc, book) => {
            const categoryName = book.category?.name || "Uncategorized";
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push(book);
            return acc;
        }, {} as { [key: string]: Book[] });
    };

    const handleGenerateCategory = async (): Promise<string> => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/suggest?title=${newBook.title}`);
            if (!response.ok) throw new Error("Failed to generate category.");
            const category = await response.text();
            setNewBook((prev) => ({ ...prev, categoryName: category }));
            return category; 
        } catch (error) {
            console.error("Error generating category:", error);
            throw error; 
        }
    };

    const handleAddBook = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("User ID is missing.");
                return;
            }

            // Add the book first
            const bookResponse = await fetch(`${API_BASE_URL}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newBook.title,
                    author: newBook.author,
                    categoryName: newBook.categoryName,
                    readingStatus: newBook.readingStatus,
                    userId: parseInt(userId),
                }),
            });

            if (!bookResponse.ok) {
                throw new Error("Failed to add the book.");
            }

            let addedBook: Book = await bookResponse.json();

            // Conditionally add review if provided
            if (newBook.reviewContent && newBook.reviewRating && newBook.reviewRating > 0) {
                const reviewResponse = await fetch(`${API_BASE_URL}/user-books`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: newBook.reviewContent,
                        rating: newBook.reviewRating,
                        userId: parseInt(userId),
                        bookId: addedBook.id,  
                    }),
                });

                if (!reviewResponse.ok) {
                    throw new Error("Failed to add the review.");
                }

                const addedReview = await reviewResponse.json();
                addedBook = { ...addedBook, review: addedReview }; 
            }

            // Update the state with the new book
            setBooks((prevBooks) => [...prevBooks, addedBook]);
            setGroupedBooks(groupBooksByCategory([...books, addedBook]));
            setIsModalOpen(false);

            // Reset the form fields after adding
            setNewBook({
                title: "",
                author: "",
                categoryName: "",
                readingStatus: "",
                reviewContent: "",
                reviewRating: 0,
            });

            alert("Book added successfully!");
        } catch (error) {
            console.error("Error adding book and/or review:", error);
            alert("Failed to add the book. Please try again.");
        }
    };
    
    
    // New function to handle cancel and reset the modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setNewBook({
            title: "",
            author: "",
            categoryName: "",
            readingStatus: "",
            reviewContent: "",
            reviewRating: 0,
        });
    };
    

    const handleDeleteBook = async (bookId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete the book.");
            }

            // Immediately update the local state
            const updatedBooks = books.filter((book) => book.id !== bookId);
            setBooks(updatedBooks);
            setGroupedBooks(groupBooksByCategory(updatedBooks));

            setIsDeletePopupOpen(false);
            setBookToDelete(null);
            alert("Book deleted successfully!");
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };


    const handleEditClick = (book: Book) => {
        setEditedBook({ ...book });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editedBook) {
            alert("No book selected for editing.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/books/${editedBook.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedBook),
            });

            if (!response.ok) throw new Error("Failed to update book.");

            const updatedBooks = books.map((book) =>
                book.id === editedBook.id ? editedBook : book
            );
            setBooks(updatedBooks);
            setGroupedBooks(groupBooksByCategory(updatedBooks));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error saving edit:", error);
        }
    };
    
    useEffect(() => {
        fetchBooks(); 
    }, []);

    const handleNavigateToReport = () => {
        navigate("/report");
    };

    return (
        <BooksWrapper>
            <NavbarComponent handleLogout={handleLogout} />
            {/* Filters Section Added Here */}
            <BookFilters filters={filters} setFilters={setFilters} fetchBooks={fetchBooks} />
            <ReportButton onClick={handleNavigateToReport}>
                Generate Report
            </ReportButton>
            <HeaderActions>
                <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
            </HeaderActions>

            {isModalOpen && (
                <AddBookModal
                    onClose={handleCancel}  
                    onAddBook={handleAddBook}
                    onGenerateCategory={handleGenerateCategory}
                    newBook={newBook}
                    setNewBook={setNewBook}
                />
            
            )}

            <BookList
                groupedBooks={groupedBooks}
                handleEdit={handleEditClick}
                confirmDelete={(bookId) => {
                    setBookToDelete(bookId);
                    setIsDeletePopupOpen(true);
                }}   
            />

            {isDeletePopupOpen && (
                <DeleteConfirmationModal
                    handleDeleteBook={() => bookToDelete && handleDeleteBook(bookToDelete)}
                    bookToDelete={bookToDelete}
                    setIsDeletePopupOpen={setIsDeletePopupOpen}
                />
            )}

            {isEditModalOpen && editedBook && (
                <EditBookModal
                    bookToEdit={editedBook}
                    setBookToEdit={setEditedBook}
                    handleSaveEdit={handleSaveEdit}
                    setIsEditModalOpen={setIsEditModalOpen}
                />
            )}
        </BooksWrapper>
    );
};

export default BooksPage;

const ReportButton = styled.button`
    background-color: #b7a57a;
    color: #4a4a4a;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 3.5rem;
    position: absolute;  /* Moves the button to a fixed position on the left */
    left: 15rem;          /* Adjust this value to move it further left */
    display: block;
    width: fit-content;

    &:hover {
        background-color: #a09070;
    }
`;

