import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; 
import '../styleSheets/Home.css';
function Home() {
  let currentUser = '';
  try {

    currentUser =JSON.parse(localStorage.getItem('CurrentUser')) || '';
  } catch (e) {
    console.error('Error parsing CurrentUser:', e);
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
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
        <h1>Welcome, {fullName}</h1>
      </header>
      <div className="home-buttons">
        <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/info`)}>Info</button>
        <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/todos`)}>Todos</button>
        <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/posts`)}>Posts</button>
        {/* <button onClick={() => navigate(`/${currentUser.username}/${currentUser.id}/albums`)}>Albums</button> */}
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="home-content">

        <h2>Select an option above to view content</h2>
      </div>
    </div>
  );
}

export default Home;
