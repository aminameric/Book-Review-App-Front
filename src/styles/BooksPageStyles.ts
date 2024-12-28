import styled from "styled-components";

// Styled Components
export const AddButton = styled.button`
  background: #B7A57A;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #BDBDBD;
  }
`;

export const BooksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  padding: 6rem 2rem 2rem; /* Add top padding to make space for the button */
  background: #faf3e0;
  min-height: 100vh;
  position: relative; /* Ensures the button is positioned relative to this wrapper */
`;


export const CategoryCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem; /* Reduce padding */
  width: 35%; /* Full-width to fit the layout */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.2);
  }
`;



export const CategoryHeader = styled.h2`
  background: #b7a57a;
  color: #4a4a4a;
  text-align: center;
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
  font-size: 1.6rem;
  font-weight: bold;
  width: fit-content;
  margin-bottom: 1rem;
`;

export const BooksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Adjust min size for cards */
  gap: 1.5rem; /* Reduce gap between cards */
  justify-items: center; /* Center cards horizontally */
`;

export const BookItem = styled.div`
  background: #ffffff;
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 240px; /* Adjust width for a rectangular look */
  height: 320px; /* Adjust height for balance */
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute content evenly */

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin: 0.3rem 0;
  }
`;


export const Stars = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

export const ReviewSection = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
`;

export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const ModalButton = styled.button`
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

export const CancelButton = styled.button`
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

export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 2rem;
`;



export const NoReviewMessage = styled.p`
  color: #888;
  font-style: italic;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

export const OptionalHeading = styled.h3`
  margin: 1rem 0;
  font-size: 1rem;
  font-weight: bold;
  color: #555; /* Neutral color */
  text-align: left;
  width: 100%;
`;

export const HeaderActions = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  gap: 1rem; /* Space between buttons */
  z-index: 10;
`;



export const LogoutButton = styled.button`
  background: #B7A57A;
  color: #4A4A4A;
  text-align: center;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #d32f2f; /* Red on hover */
    color: white; /* White text on hover for contrast */
  }
`;