import { useState, useEffect } from 'react';
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import Auth from "../utils/auth";


function NavBar({ isLoggedIn }) {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/Dashboard", label: "Dashboard" },
    { to: "/Draft", label: "Draft" },
    { to: "/Matchup", label: "Match up" },
  ];

  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const onButtonClick = () => {
    navigate('/');
    Auth.logout();
  };

  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('You are offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Navbar expand="lg" className="bg-transparent" style={{ paddingTop: '0px' }}>
      <nav className="nav nav-tabs">
        
        {/* <img src={logo} alt="PSP-logo" style={{ width: "200px", height: "200px" }} /> */}
        <Navbar.Brand className="KG">
          <div className="box">

            <div className="title">
              <span className="block"></span>
              <h1>Pigskin Pachanga</h1>
            </div>
          </div>
        </Navbar.Brand>

        {navItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Button variant="primary"
              className="m-3">
              {item.label}
            </Button>
          </Link>
        ))}

        {!isLoggedIn ? (
          <Link to="/Login">
            <Button variant="primary"
              className="m-3">
              Login
            </Button>
          </Link>
        ) : (
          <Link to="">
            <Button
              disabled={!isOnline}
              variant="primary"
              className={"m-3"}
              onClick={onButtonClick}>
              Log out
            </Button>
          </Link>
        )}

      </nav>
    </Navbar >
  );
}

export default NavBar;
