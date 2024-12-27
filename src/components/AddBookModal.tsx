import React, { useState } from "react";
import styled from "styled-components";

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: { title: string; author: string; categoryId: number; readingStatus: string }) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [readingStatus, setReadingStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author && categoryId && readingStatus) {
      onAddBook({ title, author, categoryId, readingStatus });
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          />
          <Select
            value={readingStatus}
            onChange={(e) => setReadingStatus(e.target.value)}
          >
            <option value="">Select Reading Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </Select>
          <Button type="submit">Add Book</Button>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// CSS
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

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
