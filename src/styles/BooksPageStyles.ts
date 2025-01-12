import styled from "styled-components";

// Styled Components
export const AddButton = styled.button`
  background-color: #b7a57a;
  color: #4a4a4a;
  border: none;
  border-radius: 12px;
  padding: 1rem 4rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 20px; /* Space between logout and add book buttons */
  margin-top: 4rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #a09070;
  }
`;


export const BooksWrapper = styled.div`
  padding-top: 80px; /* Adjust based on the navbar height */
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #faf3e0;
  min-height: 100vh;
`;



export const CategoryCard = styled.div`
  background: #ffffff;
  border-radius: 8px; /* Slight rounding for rectangle effect */
  padding: 1rem; /* Reduced padding for compact look */
  width: 600px; /* Adjust width to fit two cards side by side */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-top: 8rem;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Ensures two cards fit side by side */
  gap: 2rem; /* Add spacing between cards */
  justify-content: space-between; /* Better alignment of books */
  width: 90%; /* Stretch to fit the parent card */
  
`;

export const BookItem = styled.div`
  background: #f4e4c1;
  padding: 1rem;
  border-radius: 0 10px 10px 0; /* Rounded corners like a book spine */
  width: 200px;
  height: 350px; 
  text-align: center;
  box-shadow: -6px 0 8px rgba(0, 0, 0, 0.1); /* Add depth to the book */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transform: perspective(1000px) rotateY(-5deg); /* Slight tilt for a 3D effect */
  overflow: hidden;

  h3 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-top: 1rem;
  }

  p {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #4a4a4a;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    height: 100%;
    background: linear-gradient(to right, #d4c49d, #f4e4c1);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1); /* Spine shadow */
  }

  &:hover {
    transform: perspective(1000px) rotateY(-3deg);
    box-shadow: -8px 4px 16px rgba(0, 0, 0, 0.3); /* Add hover effect */
  }
`;


export const Stars = styled.div`
  color: #ffd700;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 0.5rem;
  
`;

export const ReviewContent = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  font-style: italic;
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
  width: 90%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #b7a57a;
    outline: none;
  }
`;

export const Select = styled.select`
width: 95%; 
padding: 12px;
margin-bottom: 1rem;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 1rem;
box-sizing: border-box; /* Prevents padding from altering the size */
transition: border-color 0.3s ease;

&:focus {
  border-color: #28a745;
  outline: none;
}
`;

export const GenerateButton = styled.button`
  width: 70%;
  padding: 0.8rem;
  background: #b7a57a;
  color: #000000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem; /* Added spacing below the button */

  &:hover {
    background: #a09070;
  }
`;

export const ModalButton = styled.button`
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
  background: #f4e4c1;
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

export const Progress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  span {
    font-weight: bold;
    color: #b7a57a;
    font-size: 1rem;
  }

  .progress-status {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }
`;

export const ReadingProgressLabel = styled.span`
  font-weight: bold;
  color: #b7a57a; /* Muted brown for emphasis */
  margin-right: 0.3rem;
`;

export const ReviewSection = styled.div`
margin-top: 1rem;
font-size: 0.9rem;
color: #555;
text-align: center;
background: #f9f9f9;
padding: 0.8rem;
border-radius: 8px;
box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);

p {
  margin: 0.5rem 0;
}
`;

export const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background-color: #b7a57a;
  border-radius: 2px;
  margin: 0 auto;
  max-width: 100%; /* Adjust the width */
  max-height: 50px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;


export const Logo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
`;

export const NavText = styled.h1`
  font-size: 1.6rem;
  color: #4a4a4a;
  display: flex;
  align-items: center;
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

// Wrapper for icons
export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Space between icons */
  margin-top: 10px; /* Space between review and icons */
`;

// Edit Icon
export const EditIcon = styled.span`
  font-size: 1.5rem;
  color: #f9a825; /* Bright yellow */
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    color: #c77800; /* Darker yellow on hover */
    transform: scale(1.2); /* Slight zoom effect */
  }
`;

// Delete Icon
export const DeleteIcon = styled.span`
  font-size: 1.5rem;
  color: #d32f2f; /* Bright red */
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    color: #b71c1c; /* Darker red on hover */
    transform: scale(1.2); /* Slight zoom effect */
  }
`;

export const Button = styled.button`
    padding: 10px;
    background: #28a745;
    color: white;
    border: none;
    cursor: pointer;
`;




