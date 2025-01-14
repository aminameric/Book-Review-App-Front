import React from "react";
import { ModalOverlay, ModalContent, Input, Select, ModalButton, CancelButton } from "../styles/BooksPageStyles";

interface EditBookModalProps {
    bookToEdit: any;
    setBookToEdit: React.Dispatch<React.SetStateAction<any>>;
    handleSaveEdit: () => void;
    setIsEditModalOpen: (isOpen: boolean) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ bookToEdit, setBookToEdit, handleSaveEdit, setIsEditModalOpen }) => {

    // Explicitly typing 'prev' with the same type as bookToEdit
    const handleChange = (field: string, value: any) => {
        setBookToEdit((prev: EditBookModalProps["bookToEdit"]) => {
            // If the field is for the review, ensure the review is defined before updating
            if (field === "reviewContent" || field === "reviewRating") {
                return {
                    ...prev,
                    review: {
                        ...prev.review,
                        [field === "reviewContent" ? "content" : "rating"]: value
                    }
                };
            }

            // Otherwise, update the book-level fields
            return {
                ...prev,
                [field]: value
            };
        });
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>Edit Book</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveEdit();
                    }}
                >
                    {/* Book Fields */}
                    <Input
                        type="text"
                        value={bookToEdit.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Title"
                        required
                    />
                    <Input
                        type="text"
                        value={bookToEdit.author}
                        onChange={(e) => handleChange("author", e.target.value)}
                        placeholder="Author"
                        required
                    />
                    <Select
                        value={bookToEdit.readingStatus}
                        onChange={(e) => handleChange("readingStatus", e.target.value)}
                        required
                    >
                        <option value="">Select Reading Status</option>
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </Select>

                    {/* Review Section */}
                    <Input
                        type="text"
                        value={bookToEdit.review?.content || ""}
                        onChange={(e) => handleChange("reviewContent", e.target.value)}
                        placeholder="Review Content"
                    />
                    <Input
                        type="number"
                        value={bookToEdit.review?.rating || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0 && value <= 5) {
                                handleChange("reviewRating", value); // ✅ Only updates if within the range
                            } else {
                                alert("Rating must be between 0 and 5.");
                            }
                        }}
                        placeholder="Review Rating (0-5)"
                        min={0}
                        max={5}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <ModalButton 
                        type="submit" 
                        style={{ fontSize: '1rem', padding: '0.8rem 2rem', width: '70%' }}
                    >
                        Save Changes
                    </ModalButton>

                    <CancelButton 
                        onClick={() => setIsEditModalOpen(false)} 
                        style={{ fontSize: '1rem', padding: '1rem 3rem', width: '70%' }}
                    >
                        Cancel
                    </CancelButton>
                </div>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditBookModal;
