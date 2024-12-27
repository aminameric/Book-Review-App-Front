import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/backgroundImage.jpeg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL; // Use API base URL from .env
      const response = await fetch(`${baseUrl}/users?email=${email}`);
  
      if (!response.ok) {
        throw new Error("User not found or invalid email.");
      }
  
      const users = await response.json();
      const user = users.find((u: { email: string }) => u.email === email);
  
      if (!user) {
        alert("No user found with the provided email.");
        return;
      }
  
      console.log(user); // Debug log to inspect user data
  
      localStorage.setItem("userId", user.id); // Save user ID in localStorage
      localStorage.setItem("userEmail", user.email); // Save email for further use if needed
  
      navigate(`/books?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login. Please try again.");
    }
  };
  
  
  return (
    <LoginWrapper>
      <LoginForm>
        <h2>Welcome to Your Book Tracker!</h2>
        <p>Please log in to view your books.</p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </LoginForm>
    </LoginWrapper>
  );
};
const LoginWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: 
    linear-gradient(
      rgba(255, 255, 255, 0.3), /* White overlay with 30% opacity */
      rgba(255, 255, 255, 0.3)
    ),
    url(${backgroundImage}) no-repeat center center/cover;
`;



const LoginForm = styled.div`
  background: rgba(255, 255, 255, 0.85);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const Input = styled.input`
  width: 90%; /* Set a percentage to control the width relative to the parent */
  max-width: 400px; /* Set a maximum width to avoid excessive stretching */
  padding: 0.8rem;
  margin: 0 auto 1rem; /* Center the input field and add spacing below */
  border: 2px solid #007bff;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
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
  font-weight: bold; /* Make the text bolder */
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: scale(1.05); /* Slight pop effect */
  }

  &:active {
    background: #003d80;
    transform: scale(1); /* Reset scale */
  }
`;


export default Login;
