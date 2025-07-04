import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../styleSheets/info.css';
import Home from './Home.jsx';
import defaultProfile from '../Assets/defaultProfile.webp';

const Info = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');

  const rawUser = localStorage.getItem('CurrentUser');
  if (!rawUser) return <Navigate to="/login" />;

  useEffect(() => {
    try {
      const parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);
      setToken(parsedUser.newToken || parsedUser.token || '');
      setName(parsedUser.Full_Name || '');
      setEmail(parsedUser.Email || '');
      setRole(parsedUser.Is_Manager ? 'Manager' : 'Customer');
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, [rawUser]);

  const saveAndUpdate = async () => {
    if (!user) return;

    const updatedUser = {
      Full_Name: name,
      Email: email,
      Is_Manager: role === 'Manager' ? 1 : 0
    };

    try {
      const response = await fetch(`http://localhost:3000/api/users/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        console.error('Failed to update user');
        return;
      }

      const data = await response.json();

      const newToken = data.newToken || token;

      const mergedUser = {
        ...user,
        Full_Name: name,
        Email: email,
        Is_Manager: role === 'Manager' ? 1 : 0,
        token: newToken
      };

      setToken(newToken);
      setUser(mergedUser);
      localStorage.setItem('CurrentUser', JSON.stringify(mergedUser));
      alert('User updated successfully');

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return (
      <div className='noUserDiv'>
        <Home />
        <div className='noUserWarning'>No user data available.</div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <Home />
      <div className="info-container">
        <div className="login-box">
          <h1>User Information</h1>
          <div className="input-group profile-group">
            <div className="profile-image-wrapper">
              <img src={defaultProfile} alt="Profile" className="profile-image" />
            </div>
          </div>

          <div className="input-group">
            <label className='data-label'>ID: </label>
            <span>{user.Id}</span>
          </div>

          <div className="input-group">
            <label className='data-label'>Name:</label>
            {edit ? (
              <input value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <span>{name}</span>
            )}
          </div>

          <div className="input-group">
            <label className='data-label'>Email:</label>
            {edit ? (
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            ) : (
              <span>{email}</span>
            )}
          </div>

          <div className="input-group">
            <label className='data-label'>Role:</label>
            <span>{role}</span>
          </div>
        </div>

        {visible ? (
          <button className="Edit-btn" onClick={() => { setEdit(true); setVisible(false); }}>
            Edit
          </button>
        ) : (
          <button className="Save-btn" onClick={() => {
            setEdit(false);
            setVisible(true);
            saveAndUpdate();
          }}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Info;
