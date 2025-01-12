// components/Navbar.tsx
import React from 'react';
import { Navbar, Logo, NavText, LogoutButton } from "../styles/BooksPageStyles";
import LogoImage from "../assets/logobook.png";

// Define the prop types using an interface
interface NavbarProps {
    handleLogout: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ handleLogout }) => {
    return (
        <Navbar>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Logo src={LogoImage} alt="Book Logo" />
                <NavText>My Book Tracker</NavText>
            </div>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Navbar>
    );
};

export default NavbarComponent;
