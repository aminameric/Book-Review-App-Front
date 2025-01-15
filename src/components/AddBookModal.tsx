import React, { useEffect, useState } from "react";
import { ModalOverlay, ModalContent, Input, Select, AddButton, GenerateButton } from "../styles/BooksPageStyles";
import styled from "styled-components";
import API_BASE_URL from "../config";

// Props and Types
interface AddBookModalProps {
    onClose: () => void;
    onAddBook: () => Promise<void>;
    onGenerateCategory: () => Promise<string>;
    newBook: NewBook;
    setNewBook: React.Dispatch<React.SetStateAction<NewBook>>;
}

interface NewBook {
    title: string;
    author: string;
    categoryName: string;
    readingStatus: string;
    reviewContent: string;
    reviewRating: number;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
    onClose,
    onAddBook,
    onGenerateCategory,
    newBook,
    setNewBook
}) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [customCategory, setCustomCategory] = useState<string>('');

    // ✅ Fetch categories correctly from the backend
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json();
                const categoryNames = data.map((category: { name: string }) => category.name);
                setCategories(categoryNames);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        loadCategories();
    }, []);

    // ✅ Handle form submission and ensure the category is properly passed
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newBook.categoryName) {
          alert("Please select or enter a valid category.");
          return;
      }
      await onAddBook();
  };
  

    // ✅ Ensure categories update correctly in the dropdown
    const handleGenerateCategory = async () => {
        try {
            const generatedCategory = await onGenerateCategory();
            if (generatedCategory && !categories.includes(generatedCategory)) {
                setCategories([...categories, generatedCategory]);
                setSelectedCategory(generatedCategory);
            }
        } catch (error) {
            console.error('Error generating category:', error);
        }
    };

    // ✅ Handle input changes
    const handleChange = (field: string, value: string | number) => {
        setNewBook((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // ✅ Reset form after submission or closing
    const handleResetForm = () => {
        setNewBook({
            title: '',
            author: '',
            categoryName: '',
            readingStatus: '',
            reviewContent: '',
            reviewRating: 0
        });
        setSelectedCategory('');
        setCustomCategory('');
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
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                    />

                    {/* Author Input */}
                    <Input
                        type="text"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        required
                    />

                  <Input
                      list="categoryOptions"
                      value={newBook.categoryName}
                      onChange={(e) => {
                          setNewBook({ ...newBook, categoryName: e.target.value });
                      }}
                      onBlur={(e) => {
                          // Ensure a valid category is selected
                          if (!categories.includes(e.target.value) && e.target.value.trim() === "") {
                              alert("Please select or enter a valid category.");
                              setNewBook({ ...newBook, categoryName: "" });
                          }
                      }}
                      placeholder="Select or enter a category"
                      required
                  />

                  {/* Datalist for Category Suggestions */}
                  <datalist id="categoryOptions">
                      {categories.map((category, index) => (
                          <option key={index} value={category} />
                      ))}
                  </datalist>

                    {/* Generate Category Button */}
                    <GenerateButton type="button" onClick={handleGenerateCategory}>
                        Generate Category
                    </GenerateButton>

                    {/* Reading Status Dropdown */}
                    <Select
                        value={newBook.readingStatus}
                        onChange={(e) => handleChange('readingStatus', e.target.value)}
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
                        onChange={(e) => handleChange('reviewContent', e.target.value)}
                    />

                    {/* Review Rating Input */}
                    <Input
                        type="number"
                        placeholder="Review Rating (1-5)"
                        value={newBook.reviewRating}
                        onChange={(e) =>
                            handleChange('reviewRating', parseInt(e.target.value) || 0)
                        }
                        min="1"
                        max="5"
                    />

                    {/* Submit and Cancel Buttons */}
                    <AddButton type="submit">Add Book</AddButton>
                    <CancelButton type="button" onClick={onClose}>
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
