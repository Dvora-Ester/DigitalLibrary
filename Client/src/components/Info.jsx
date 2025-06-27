import React, { useEffect, useState } from 'react';
import '../styleSheets/info.css';
import Home from './Home.jsx'
import defaultProfile from '../Assets/defaultProfile.webp';

const Info = () => {

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [disable, setDisable] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedUser = localStorage.getItem('CurrentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setName(parsedUser.Full_Name || '');
        setEmail(parsedUser.Email || '');
        setPhone(parsedUser.Phone || '');
        setRole(parsedUser.Is_Manager ? 'Manager' : 'Customer');
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, []);
  let currentUser = null;
  const rawUser = localStorage.getItem('CurrentUser');
  if (rawUser) {
    try {
      currentUser = JSON.parse(rawUser);
    } catch (e) {
      console.error("Invalid JSON in CurrentUser:", e);
    }
  } if (!currentUser) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {

    const storedUser = localStorage.getItem('CurrentUser');
    //const role=storedUser.Is_Manager? "Manager" : "Customer";
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing JSON:', error);

      }
    } else {
      console.log('No user data in localStorage');
    }
  }, []);
  useEffect(() => {

  }, [name, email, phone]);

  if (!user) {
    return <div className='noUserDiv'>
      <Home />
      <div className='noUserWarning'>No user data available.</div>
    </div>;
  }

  return (
    <div className="info-page">
      <Home />
      <div className="info-container">

        <div className="login-box">
          <h1>User Information<br /><br /><br /></h1>
          <br />
          <br />
          <br />
          <div className="input-group profile-group">

            <div className="profile-image-wrapper">
              <img src={defaultProfile} alt="Profile" className="profile-image" />

            </div>
          </div>

          <div className="input-group">
            <label className='data-label' htmlFor="id">ID: </label>
            <span>{user.Id || "invalid"}</span>
          </div>

          <div className="input-group">
            <label className='data-label'>Name:</label>
            {edit ? (
              <input value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <span>{name || "invalid"}</span>
            )}
          </div>

          <div className="input-group">
            <label className='data-label'>Email:</label>
            {edit ? (
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            ) : (
              <span>{email || "invalid"}</span>
            )}
          </div>

          <div className="input-group">
            <label className='data-label'>Phone:</label>
            {edit ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <span>{phone || "invalid"}</span>
            )}
          </div>

          <div className="input-group">
            <label className='data-label'>Role:</label>
            <span>{role || "invalid"}</span> {/* לא ניתן לערוך תפקיד כאן */}
          </div>

        </div>
        <br />
        <br />
        <button disabled={!disable} className="Edit-btn" onClick={() => { setEdit(true); setDisable(false) }}>Edit</button>
        <button disabled={disable} className="Save-btn" onClick={() => { setEdit(false); setDisable(true); saveAndUpdate(); }}>Save</button>
      </div>
    </div>

  );
};

export default Info;
