import React, { useState, useEffect } from 'react';
import '../styleSheets/FullRegistration.css';
import { useNavigate } from 'react-router-dom';

function FullRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [longtitude, setLongtitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebSite] = useState('');
  const [CompanyCatchPhrase, setCompanyCatchPhrase] = useState('');
  const [companyBs, setCompanyBs] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [nextUserId, setNextUserId] = useState(null);
  const [nextPasswordId, setnextPasswordId] = useState(null);

  const username = localStorage.getItem('UserName');
  const password = localStorage.getItem('Password');
  const navigate = useNavigate();

  useEffect(() => {

    fetch('http://localhost:3000/users')
      .then((response) => response.json())
      .then((users) => {
        if (users.length > 0) {
          const lastUserId = Number(users[users.length - 1].id);
          setNextUserId(lastUserId + 1);
        } else {
          setNextUserId(1);
        }
      })
      .catch((error) => console.error('שגיאה בקריאת ה-API:', error));

    //password nextID
    fetch('http://localhost:3000/passwords')
      .then((response) => response.json())
      .then((passwords) => {
        if (passwords.length > 0) {
          const lastPasswordId = Number(passwords[passwords.length - 1].id);
          setnextPasswordId(lastPasswordId + 1);
        } else {
          setnextPasswordId(1);
        }
      })
      .catch((error) => console.error('שגיאה בקריאת ה-API:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nextUserId) {
      setError('ID לא זמין עדיין, אנא המתן...');
      return;
    }
    const passwordObj = {
      id: `${nextPasswordId}`,
      userId: `${nextUserId}`,
      password_hash: password

    };
    const flatUser = {
      id: `${nextUserId}`,
      name,
      username,
      email,
      address_street: street,
      address_suite: suite,
      address_city: city,
      address_zipcode: zipcode,
      address_geo_lat: latitude,
      address_geo_lng: longtitude,
      phone,
      website: website,
      company_name: companyName,
      company_catchPhrase: CompanyCatchPhrase,
      company_bs: companyBs,
    };

    localStorage.setItem('CurrentUser', JSON.stringify(flatUser));
    console.log("flatUser:", flatUser);

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flatUser),
    })
      .then((response) => response.json())
      .then((user) => {
        fetch('http://localhost:3000/passwords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordObj),
        })
          .then((response) => response.json())
          .then((data) => {
            if(typeof(data)==='string')
            {setError(data)}
            console.log("data",data);
            
              navigate(`/${user.username}/${user.id}/home`, { state: { username, password } })
            
          });
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        setError('Error adding user to the system.');
      });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Full Registration</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div>User Name: {username}</div>
            </div>

          </div>

          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input className='input-group-label' type="password" value={password} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebSite(e.target.value)}
                required
              />
            </div>


          </div>




          <h3>Address:</h3>
          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className='input-group-label' htmlFor="suite">Suite</label>
              <input
                type="text"
                id="suite"
                value={suite}
                onChange={(e) => setSuite(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className='input-group-label' htmlFor="zipcode">Zipcode</label>
              <input
                type="text"
                id="zipcode"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                required
              />
            </div>
          </div>

          <h4>Geography location:</h4>
          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className='input-group-label' htmlFor="longtitude">Longitude</label>
              <input
                type="text"
                id="longtitude"
                value={longtitude}
                onChange={(e) => setLongtitude(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <h3>Company:</h3>
          <div className="form-row">
            <div className="input-group">
              <label className='input-group-label' htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className='input-group-label' htmlFor="CompanyCatchPhrase">Company Catch Phrase</label>
              <input
                type="text"
                id="CompanyCatchPhrase"
                value={CompanyCatchPhrase}
                onChange={(e) => setCompanyCatchPhrase(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div  className="input-group">
              <label className='input-group-label' htmlFor="CompanyBs">Company Bs</label>
              <input
                type="text"
                id="CompanyBs"
                value={companyBs}
                onChange={(e) => setCompanyBs(e.target.value)}
                required
              />
            </div>
            <div style={{ color: 'red' }}>{error}</div>
            <div style={{ color: 'red' }}>{error1}</div>
          </div>
          
          <button type="submit" className="register-button">
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}

export default FullRegistration;
