// components/DeleteConfirmationModal.tsx
import React from 'react';
import styled from 'styled-components';

// Define the prop types using an interface
interface DeleteConfirmationModalProps {
    handleDeleteBook: (bookId: number) => void;
    bookToDelete: number | null;
    setIsDeletePopupOpen: (isOpen: boolean) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
    handleDeleteBook, 
    bookToDelete, 
    setIsDeletePopupOpen 
}) => (
    <ModalOverlay>
        <ModalContent>
            <h2>Are you sure you want to delete this book?</h2>
            <StyledModalButton
                    onClick={() => bookToDelete !== null ? handleDeleteBook(bookToDelete) : null}
                >
                    Yes, Delete
            </StyledModalButton>
            <CancelButton onClick={() => setIsDeletePopupOpen(false)}>Cancel</CancelButton>
        </ModalContent>
    </ModalOverlay>
);

// Styled Components
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
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
`;

const StyledModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #c82333;
  }
`;

export default DeleteConfirmationModal;
