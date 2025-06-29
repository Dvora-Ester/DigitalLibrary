import React, { useState } from 'react';
import '../styleSheets/FullRegistration.css';
import { useNavigate, useLocation } from 'react-router-dom';

function FullRegistration() {
  const location = useLocation();
  const state = location.state || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState(state.email || '');
  const [password, setPassword] = useState(state.password || '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('נא למלא את כל השדות הדרושים.');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
    };

    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.user && data.user.userId && data.user.token) {
          const user = {
            id: data.user.userId,
            Full_Name: data.user.name,
            email: data.user.email,
            token: data.user.token
          };

          // שמירת המשתמש בלוקאל סטורג'
          localStorage.setItem("CurrentUser", JSON.stringify(user));

          // ניווט עם פרמטרים ו-state
          navigate(`/${user.name}/${user.id}/welcome-page`, {
            state: {
              username: user.email,
              token: user.token
            }
          });

        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError("שגיאה בלתי צפויה ברישום המשתמש");
        }
      })
      .catch(error => {
        console.error("Error registering user:", error);
        setError("שגיאה בשרת, נסה שוב מאוחר יותר.");
      });


  };



  //  fetch("http://localhost:3000/api/users/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     email: email,
  //     password: password
  //   })
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // if (data !== undefined) {
  //     // console.log('User found:', data[0]);
  //     // // localStorage.setItem("CurrentUser", JSON.stringify(data[0]));
  //     // localStorage.setItem("CurrentUser", JSON.stringify(data));
  //     // const currentUser = data;
  //     // console.log(data, currentUser);
  //     if (data && data.userWithoutPassword) {
  //       const currentUser = data.userWithoutPassword;
  //       localStorage.setItem("CurrentUser", JSON.stringify(currentUser));
  //       console.log('User found:', currentUser);
  //       let userName = currentUser.Full_Name;
  //       navigate(`/${currentUser.Full_Name}/${currentUser.Id}/welcome-page`, { state: { userName, password } })
  //     } else {
  //       setError('User not found pass to Registration');
  //     }
  //   })
  //   .catch(error => console.error('Error fetching user:', error));

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Full Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name" className="input-group-label">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-group-label">Email:</label>
              <div>{email?.split('@')[0]}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email" className="input-group-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-group-label">Password</label>
              <input type="password" value={password} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="phone" className="input-group-label">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <button type="submit" className="register-button">
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}

export default FullRegistration;
