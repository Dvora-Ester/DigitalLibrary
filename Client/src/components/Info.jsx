import React, { useEffect, useState } from 'react';
import '../styleSheets/Home.css'; 
import Home from './Home.jsx'
const Info = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
   
    const storedUser = localStorage.getItem('CurrentUser');

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

  
  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div>
      <Home />
      <div className="info-container">

        <div className="login-box">
          <h2>User Information</h2>

          <h4>Basic Information</h4>
          <div className="input-group">
            <label htmlFor="id">ID: </label>
            <span>{user.id}</span>
          </div>

          <div className="input-group">
            <label htmlFor="name">Name: </label>
            <span>{user.name}</span>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username: </label>
            <span>{user.username}</span>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email: </label>
            <span>{user.email}</span>
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone: </label>
            <span>{user.phone}</span>
          </div>
          <h4>Address</h4>
          <div className="input-group">
            <label htmlFor="street">Street: </label>
            <span>{user.address_street}</span>
          </div>

          <div className="input-group">
            <label htmlFor="suite">Suite: </label>
            <span>{user.address_suite}</span>
          </div>

          <div className="input-group">
            <label htmlFor="city">City: </label>
            <span>{user.address_city}</span>
          </div>

          <div className="input-group">
            <label htmlFor="zipcode">Zipcode: </label>
            <span>{user.address_zipcode}</span>
          </div>

          
          <h4>Geographic location</h4>
          <div className="input-group">
            <label htmlFor="latitude">Latitude: </label>
            <span>{user.address_geo_lat}</span>
          </div>

          <div className="input-group">
            <label htmlFor="longitude">Longitude: </label>
            <span>{user.address_geo_lng}</span>
          </div>

          
          <h4>Company</h4>
          <div className="input-group">
            <label htmlFor="companyName">Company Name: </label>
            <span>{user.company_name}</span>
          </div>

          <div className="input-group">
            <label htmlFor="catchPhrase">Catch phrase: </label>
            <span>{user.company_catchPhrase}</span>
          </div>

          <div className="input-group">
            <label htmlFor="bs">Business: </label>
            <span>{user.company_bs}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Info;
