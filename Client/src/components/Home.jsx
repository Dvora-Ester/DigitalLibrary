import React from 'react';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import '../styleSheets/Home.css';
import logo from '../Assets/logo.png';
import defaultProfile from '../Assets/defaultProfile.webp';
import onlinelibrary from '../Assets/online-library.png';
import shoppingBag from '../Assets/shopping-bag.png';
import shoppingCart from '../Assets/shopping_cart.png';
import ProfileResume from '../Assets/profile-resume.png';
import logout from '../Assets/logout.png';
function Home() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const sampleUser = {
  Id: 1,
  Full_Name: "Yael Bloch",
  Email: "yael@example.com",
  Phone: "050-1234567",
  Is_Manager: false
};
localStorage.setItem("CurrentUser",JSON.stringify(sampleUser));
  let currentUser = sampleUser;
  //let currentUser = '';
  // try {

  //   currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';
  // } catch (e) {
  //   console.error('Error parsing CurrentUser:', e);
  // }

  if (!currentUser) {
    //return <Navigate to="/login" />;
  }

  const fullName = currentUser.name || 'User';

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-area">
          <img
            src={logo}
            alt="Educational Library Book Logo"
            className="site-logo"
          />
          <span className="site-name">Educational Library Book</span>
        </div>

      </header>
      <div className="user-bar">
        <img src={currentUser.imageUrl || defaultProfile} alt="Profile" className="user-avatar" />
        <span className="user-name">Welcome, {fullName}</span>
        <div className="user-dropdown-wrapper">
          <button className="user-dropdown-btn"
            onClick={() => setMenuOpen(prev => !prev)}>
            <span>My Account</span>
            <span className="arrow-down">▼</span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => {navigate(`/${currentUser.username}/${currentUser.id}/info`);setMenuOpen(false)}}>
                <img src={ProfileResume} alt="Profile" className="dropdown-icon" />
                My Profile
              </div>
              <div className="dropdown-item">
                <img src={shoppingBag} alt="Orders" className="dropdown-icon" />
                My Orders
              </div>
              <div className="dropdown-item">
                <img src={onlinelibrary} alt="Library" className="dropdown-icon" />
                My Library
              </div>
              <div className="dropdown-item">
                <img src={logout} alt="LogOut" className="dropdown-icon" onClick={handleLogout}/>
                Log-Out
              </div>
            </div>

          )}
        </div>
        <div className='cart-container'>
          <img src={shoppingCart} alt="shoppingCart" className="cart-icon" />
          <button className="cart-btn" >My Cart</button>

        </div>
      </div>

      <div className="home-content" >
        <button className='nav-item' onClick={()=>navigate(`/${currentUser.Full_Name}/${currentUser.Id}/about-us`)}>About Us</button>
        <button className='nav-item' onClick={()=>navigate(`/${currentUser.Full_Name}/${currentUser.Id}/book-store`)}>Book Store</button>
        <button className='nav-item'>sell A Book</button>
        {/* <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/todos`)}>Todos</button>
        <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/posts`)}>Posts</button> */}
        {/* <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/albums`)}>Albums</button> */}

      </div>
    </div>
  );
}

export default Home;
