import { useEffect, useState } from 'react';
import '../styleSheets/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    localStorage.setItem("CurrentUser", '');
    localStorage.setItem("AlbumsToShowOfCurrentUser", []);
    localStorage.setItem("AllAlbumsOfCurrentUser", []);
  }, [email, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.userWithoutPassword) {
          const currentUser = data.userWithoutPassword;
          localStorage.setItem("CurrentUser", JSON.stringify(currentUser));
          console.log('User found:', currentUser);
          let userName = currentUser.Full_Name;
          navigate(`/${currentUser.Full_Name}/${currentUser.Id}/welcome-page`, { state: { userName, password } })
        } else {
          setError('User not found pass to Registration');
        }
      })
      .catch(error => console.error('Error fetching user:', error));

    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          <div className="input-group">
            <label className='input-group-label' htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p>{error}</p>
          <button type="submit" className="login-button">
            Login
          </button>
          <button className='change-page-button' onClick={handleRegisterRedirect}>Go to Registration</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
