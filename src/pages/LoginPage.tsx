import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../assets/backgroundImage.jpeg";
import API_BASE_URL from "../config";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
    if (!email) {
        alert("Please enter a valid email.");
        return;
    }

    try {
        // ✅ Using the global constant instead of process.env
        const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
            throw new Error("User not found or invalid email.");
        }

        const users = await response.json();
        const user = users.find((u: { email: string }) => u.email === email);

        if (!user) {
            alert("No user found with the provided email.");
            return;
        }

        console.log("User Data:", user);  // ✅ Debug log to inspect user data

        // ✅ Save user details in localStorage for future use
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);

        // ✅ Navigate after successful login
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

//styling
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
 width: 90%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #b7a57a; /* Application color for border */
  border-radius: 8px;
  margin-bottom: 1rem;
  outline: none;
  box-shadow: inset 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #a09070; /* Highlight color on focus */
    box-shadow: 0px 0px 8px rgba(176, 144, 112, 0.6);
  }
`;


const Button = styled.button`
 background-color: #b7a57a; /* Application color */
  color: #4a4a4a; /* Text color */
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a09070; /* Slightly darker shade for hover */
  }
`;


export default Login;
