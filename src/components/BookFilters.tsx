import React, { useState } from 'react';
import styled from 'styled-components';

// Import your existing styled components
const FilterButton = styled.button`
    background-color: #b7a57a;
    color: #4a4a4a;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    position: absolute; /* Keeps it independent from the layout flow */
    top: 5.5rem; /* Adjust this value to position it further down without affecting other elements */
    left: 2rem; /* Align it to the left */
    z-index: 10; /* Ensures it stays above other elements if needed */
    display: block;
    width: 12%;

    &:hover {
        background-color: #a09070;
    }
`;

const FilterModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FilterModal = styled.div`
    background: #fdf6e3;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
    z-index: 100;

    input, select, button {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
    }

    button {
        background-color: #b7a57a;
        color: #4a4a4a;
        font-weight: bold;
        border: none;
        cursor: pointer;

        &:hover {
            background-color: #a09070;
        }
    }
`;

interface BookFiltersProps {
    filters: {
        title: string;
        author: string;
        readingStatus: string;
        category: string;
        sortBy: string;
        order: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    fetchBooks: (applyFilters?: boolean) => void;
}

const BookFilters: React.FC<BookFiltersProps> = ({ filters, setFilters, fetchBooks }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <FilterButton onClick={() => setIsModalOpen(true)}>
                Open Filters
            </FilterButton>

            {isModalOpen && (
                <FilterModalOverlay onClick={() => setIsModalOpen(false)}>
                    <FilterModal onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleFilterChange}
                            placeholder="Filter by Title"
                        />
                        <input
                            type="text"
                            name="author"
                            value={filters.author}
                            onChange={handleFilterChange}
                            placeholder="Filter by Author"
                        />
                        <select
                            name="readingStatus"
                            value={filters.readingStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Reading Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="NOT_STARTED">Not Started</option>
                        </select>
                        <input
                            type="text"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            placeholder="Filter by Category"
                        />
                        <div>
                            <label>Sort By: </label>
                            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="readingStatus">Reading Status</option>
                                <option value="category">Category</option>
                            </select>
                            <select name="order" value={filters.order} onChange={handleFilterChange}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <button onClick={() => { fetchBooks(true); setIsModalOpen(false); }}>Apply Filters</button>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </FilterModal>
                </FilterModalOverlay>
            )}
        </>
    );
};

export default BookFilters;