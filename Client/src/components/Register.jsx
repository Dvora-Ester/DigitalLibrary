import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styleSheets/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  localStorage.setItem("CurrentUser", '');
  localStorage.setItem("Password", '')
  localStorage.setItem("email", '')
  const handleSubmit = (e) => {
    e.preventDefault();
    //בדיקה אם המשתמש קיים לפני שהוא נרשם
    fetch(`http://localhost:3000/api/users/login/${email}/${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify()
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        console.log(data)
        if (data.length>0) {
          setError("User already exists. Please go to the login page.");
          console.log('User found:', data);
          return;
        } else {
          console.log('User not found');


          if (password !== passwordVerify) {
            setError('Passwords do not match');
            return;
          }
          if (!checkPassword(password)) {
            setError('The password must contain 6 characters,at least one upperCase letter ,one lowercase lette and a special char');
          }

          console.log('Email:', email);
          console.log('Password:', password);
          localStorage.setItem('Email', email)
          localStorage.setItem('Password', password)
          navigate('/full-registration');
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  };
  const handleLoginRedirect = () => {
    navigate('/login');

  };
  const checkPassword = (password) => {
    if (password.length < 6) { console.log("length"); return false; }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasLetter) console.log("letter");
    if (!hasNumber) console.log("number");
    if (!hasSpecialChar) console.log("specialChar");

    return hasLetter && hasNumber && hasSpecialChar;
  };
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className='input-group-label' htmlFor="email">email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className='input-group-label' htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className='input-group-label' htmlFor="passwordVerify">Verify Password</label>
            <input
              type="password"
              id="passwordVerify"
              value={passwordVerify}
              onChange={(e) => setPasswordVerify(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          <button type="submit" className="register-button">
            Register
          </button>
          <button className="change-page-button" onClick={handleLoginRedirect}>Go to Login</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
