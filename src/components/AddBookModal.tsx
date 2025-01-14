import React from "react";
import { ModalOverlay, ModalContent, Input, Select, AddButton, GenerateButton } from "../styles/BooksPageStyles";
import styled from "styled-components";

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (book: {
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent?: string;
    reviewRating?: number;
  }) => void;
  onGenerateCategory: (title: string) => void;
  newBook: {
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent?: string;
    reviewRating?: number;
  };
  setNewBook: React.Dispatch<React.SetStateAction<{
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent?: string;
    reviewRating?: number;
  }>>;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
  onClose,
  onAddBook,
  newBook,
  setNewBook,
  onGenerateCategory,
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBook(newBook); // Fixed here to pass the book correctly
  };

  // Handle input changes
  const handleChange = (field: string, value: string | number) => {
    setNewBook((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Clear the form when closing or submitting
  const handleResetForm = () => {
    setNewBook({
      title: "",
      author: "",
      categoryName: "",
      readingStatus: "",
      reviewContent: "",
      reviewRating: 0,
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <Input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          {/* Author Input */}
          <Input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => handleChange("author", e.target.value)}
            required
          />

          {/* Category Name Input */}
          <Input
            type="text"
            placeholder="Category Name"
            value={newBook.categoryName}
            onChange={(e) => handleChange("categoryName", e.target.value)}
          />

          {/* Generate Category Button */}
          <GenerateButton type="button" onClick={() => onGenerateCategory(newBook.title)}>
            Generate Category
          </GenerateButton>

          {/* Reading Status Dropdown */}
          <Select
            value={newBook.readingStatus}
            onChange={(e) => handleChange("readingStatus", e.target.value)}
            required
          >
            <option value="">Select Reading Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </Select>

          {/* Review Content Input */}
          <Input
            type="text"
            placeholder="Review Content"
            value={newBook.reviewContent}
            onChange={(e) => handleChange("reviewContent", e.target.value)}
          />

          {/* Review Rating Input */}
          <Input
            type="number"
            placeholder="Review Rating (1-5)"
            value={newBook.reviewRating || ""}
            onChange={(e) =>
              handleChange("reviewRating", parseInt(e.target.value) || 0)
            }
            min="1"
            max="5"
          />

          {/* Add and Cancel Buttons */}
          <AddButton type="submit" style={{ marginTop: "1rem" }}>
            Add Book
          </AddButton>
          <CancelButton
            type="button"
            onClick={() => {
              onClose();
              handleResetForm(); // Clear fields when closing the modal
            }}
          >
            Cancel
          </CancelButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components (unchanged)
const CancelButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #ddd;
  }
`;

export default AddBookModal;
