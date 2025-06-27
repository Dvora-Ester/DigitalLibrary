import React from 'react';
import '../styleSheets/Book.css';
import BookDetail from '../components/BookDetail.jsx'
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home.jsx';
function NewBooksOffers() {
    return(<div className="new-books-offers">

        <Home />
    </div>);
}
export default NewBooksOffers;
