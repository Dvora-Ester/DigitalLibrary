import { useState } from 'react';
import '../App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import FullRegistration from './FullRegistration.jsx';
import Info from './Info.jsx';
import BookStore from './BookStore.jsx';
import AboutUs from './AboutUs.jsx';
import BookDetailsModal from './BookDetail.jsx';
import MyLibrary from './MyLibrary.jsx';
import MyOrders from './MyOrders.jsx';
import BookReader from './BookReader.jsx';
import WelcomePage from './WelcomePage.jsx';
import Cart from './Cart.jsx';
import BookSellingPage from './BookSellingPage.jsx';
import NewBooksOffers from './NewBooksOffers.jsx';


function App() {

  return (
    
    <Routes>
      <Route index path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/:user/:id/home' element={<Home />} />
      <Route path='/:user/:id/book-offers' element={<NewBooksOffers />} />
      <Route path='/:user/:id/welcome-page' element={<WelcomePage />} />
      <Route path='/:user/:id/cart' element={<Cart />} />
      <Route path='/:user/:id/book-store' element={<BookStore />} />
      <Route path='/:user/:id/book-selling' element={<BookSellingPage />} />
      <Route path='/:user/:id/about-us' element={<AboutUs />} />
      <Route path='/:user/:id/book-details/:bookId' element={<BookDetailsModal />} />
      <Route path="/full-registration" element={<FullRegistration />} />
      <Route path="/:user/:id/info" element={<Info />} />
      <Route path="/:user/:id/my-library" element={<MyLibrary />} />
      <Route path="/:user/:id/my-orders" element={<MyOrders />} />
      <Route path="/bookReader" element={<BookReader />} />
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
