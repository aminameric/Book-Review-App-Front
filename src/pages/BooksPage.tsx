import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import BookList from "../components/BookList";
import AddBookModal from "../components/AddBookModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditBookModal from "../components/EditBookModal";
import { BooksWrapper, AddButton, HeaderActions } from "../styles/BooksPageStyles";
import { Book } from "../types/Book";
import API_BASE_URL from "../config";

interface NewBookState {
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent?: string;
    reviewRating?: number;
}

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [groupedBooks, setGroupedBooks] = useState<{ [key: string]: Book[] }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<number | null>(null);
    const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
    const [newBook, setNewBook] = useState<NewBookState>({
        title: "",
        author: "",
        categoryName: "",
        readingStatus: "",
        reviewContent: "",
        reviewRating: 0,
    });
    const [editedBook, setEditedBook] = useState<Book>({
        id: 0,
        title: "",
        author: "",
        categoryId: 0,
        category: {
            id: 0,
            name: ""
        },
        readingStatus: "",
        userBooks: [],
        review: {
            id: 0,
            content: "",
            rating: 0
        }
    });
    
    
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const fetchBooks = async () => {
        try {
            const email = localStorage.getItem("userEmail");
    
            if (!email) {
                console.error("No email found in localStorage.");
                return;
            }
    
            // ✅ Using the global constant here instead of process.env
            const response = await fetch(`${API_BASE_URL}/books/user?email=${encodeURIComponent(email)}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch books.");
            }
    
            const booksData = await response.json();
    
            if (!Array.isArray(booksData)) {
                throw new Error("Invalid books data format received.");
            }
    
            // ✅ Fetching reviews after receiving books data
            const booksWithReviews = await fetchReviewsForBooks(booksData);
            setBooks(booksWithReviews);
            setGroupedBooks(groupBooksByCategory(booksWithReviews));
    
        } catch (error) {
            console.error("Error fetching books and/or reviews:", error);
        }
    };

    const fetchReviewsForBooks = async (books: Book[]) => {
        const userId = localStorage.getItem("userId");
    
        if (!userId) {
            console.error("No user ID found in localStorage.");
            return books;
        }
    
        return await Promise.all(
            books.map(async (book) => {
                try {
                    // ✅ Using the global constant instead of process.env directly
                    const response = await fetch(`${API_BASE_URL}/user-books/review?bookId=${book.id}&userId=${userId}`);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch review for book ID: ${book.id}`);
                    }
                    
                    const review = await response.json();
                    return { ...book, review }; // ✅ Adding the review to the book object
                } catch (error) {
                    console.error(`Error fetching review for book ID ${book.id}:`, error);
                    return book; // ✅ Return book without review in case of error
                }
            })
        );
    };

    const groupBooksByCategory = (books: Book[]) => {
        return books.reduce((acc, book) => {
            const categoryName = book.category?.name || "Uncategorized";
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(book);
            return acc;
        }, {} as { [key: string]: Book[] });
    };

    const handleGenerateCategory = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/suggest?title=${newBook.title}`);
        
        if (!response.ok) {
            throw new Error("Failed to generate category.");
        }

        const category = await response.text();
        
        // ✅ Updating state with the generated category
        setNewBook((prev) => ({ ...prev, categoryName: category }));
    } catch (error) {
        console.error("Error generating category:", error);
    }
    };


    const handleAddBook = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("User ID is missing.");
                return;
            }

            // ✅ Using the global constant
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

            // ✅ Review Handling
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

                if (reviewResponse.ok) {
                    const addedReview = await reviewResponse.json();
                    addedBook = { ...addedBook, review: addedReview }; 
                }
            }

            // ✅ Updating State
            setBooks((prevBooks) => [...prevBooks, addedBook]);
            setGroupedBooks(groupBooksByCategory([...books, addedBook]));
            setIsModalOpen(false);

            // ✅ Reset Form State
            setNewBook({
                title: "",
                author: "",
                categoryName: "",
                readingStatus: "",
                reviewContent: "",
                reviewRating: 0,
            });
        } catch (error) {
            console.error("Error adding book and/or review:", error);
        }
    };

    const handleDeleteBook = async (bookId: number) => {
        try {
            // ✅ Using the global constant
            const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete book.");
            }

            // ✅ Updating State After Deletion
            const updatedBooks = books.filter((book) => book.id !== bookId);
            setBooks(updatedBooks);
            setGroupedBooks(groupBooksByCategory(updatedBooks));

            // ✅ Closing the Modal and Resetting State
            setIsDeletePopupOpen(false);
            setBookToDelete(null);
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleSaveEdit = async () => {
        if (!bookToEdit) {
            alert("No book selected for editing.");
            return;
        }

        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("User ID is missing from local storage. Please log in again.");
                return;
            }

            // ✅ Using the existing `review` object directly
            const updatedBookToEdit = {
                ...bookToEdit,
                review: {
                    id: bookToEdit.review?.id ?? undefined, 
                    content: bookToEdit.review?.content || "",
                    rating: bookToEdit.review?.rating || 0
                }
            };

            // ✅ Step 1: Prepare the Book Payload (Directly Using `review`)
            const bookPayload = {
                id: updatedBookToEdit.id,
                title: updatedBookToEdit.title,
                author: updatedBookToEdit.author,
                readingStatus: updatedBookToEdit.readingStatus,
                categoryId: updatedBookToEdit.categoryId,
                category: updatedBookToEdit.category,
                userBooks: updatedBookToEdit.userBooks,
                review: updatedBookToEdit.review
            };

            // ✅ Step 2: Send the Book Update Request (Book and Review Together)
            const bookResponse = await fetch(`${API_BASE_URL}/books/${updatedBookToEdit.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookPayload),
            });

            if (!bookResponse.ok) {
                throw new Error(`Failed to update the book: ${await bookResponse.text()}`);
            }
            console.log("Book updated successfully!");

            // ✅ Step 3: Update State After Successful Request
            const updatedBooks = books.map((book) =>
                book.id === updatedBookToEdit.id ? updatedBookToEdit : book
            );
            setBooks(updatedBooks);
            setGroupedBooks(groupBooksByCategory(updatedBooks));
            setIsEditModalOpen(false);
            setBookToEdit(null);

            alert("Book and review updated successfully!");

        } catch (error) {
            console.error("Error during update process:", error);
        }
    };
    
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]); 
    

    return (
        <BooksWrapper>
            <NavbarComponent handleLogout={handleLogout} />
            <HeaderActions>
                <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
            </HeaderActions>

            {isModalOpen && (
                <AddBookModal
                    onClose={() => setIsModalOpen(false)}
                    onAddBook={handleAddBook}
                    onGenerateCategory={handleGenerateCategory}
                    newBook={newBook}
                    setNewBook={setNewBook}
                />
            )}

            <BookList
                groupedBooks={groupedBooks}
                handleEdit={(book) => {
                    setBookToEdit(book);  // Keeping the original Book object structure
                    setEditedBook({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        readingStatus: book.readingStatus || "",
                        categoryId: book.categoryId,
                        category: book.category,
                        userBooks: book.userBooks,
                        review: {
                            id: book.review?.id ?? 0,
                            content: book.review?.content || "",
                            rating: book.review?.rating || 0
                        }
                    });
                    setIsEditModalOpen(true);
                }}
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

            {isEditModalOpen && bookToEdit && (
                <EditBookModal
                    bookToEdit={bookToEdit}
                    setBookToEdit={setBookToEdit}
                    handleSaveEdit={handleSaveEdit}
                    setIsEditModalOpen={setIsEditModalOpen}
                />
            )}
        </BooksWrapper>
    );
};

export default BooksPage;
