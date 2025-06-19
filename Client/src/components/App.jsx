import { useState } from 'react';
import '../App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import FullRegistration from './FullRegistration.jsx';
import Info from './Info.jsx';
// import Albums from './Albums.jsx';
// import Todos from './Todos.jsx';
// import Posts from './Posts.jsx';
// import Photos from './Photos.jsx';
// import Comments from './Comments.jsx';

function App() {

  return (
    
    <Routes>
      <Route index path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/:user/:id/home' element={<Home />} />
      <Route path="/full-registration" element={<FullRegistration />} />
      <Route path="/:user/:id/info" element={<Info />} />
      {/* <Route path="/:user/:id/albums" element={<Albums />}/>
      <Route path="/:user/:id/albums/:id/photos" element={<Photos />} />*/}
      {/* <Route path="/:user/:id/posts" element={<Posts />} /> 
      <Route path="/:user/:id/todos" element={<Todos />} />
      <Route path="/:user/:id/posts/:id/comments" element={<Comments />} />
       */}
    </Routes>
  );
}

export default App;
