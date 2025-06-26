import React, { useEffect, useState } from 'react';
import '../styleSheets/AboutUs.css';
import Home from './Home.jsx'
import { useNavigate,Navigate } from 'react-router-dom';

const AboutUs=()=>{
let currentUser = null;
const rawUser = localStorage.getItem('CurrentUser');
if (rawUser) {
  try {
    currentUser = JSON.parse(rawUser);
  } catch (e) {
    console.error("Invalid JSON in CurrentUser:", e);
  }
}
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
    return (
        <div className='pageContainer'>
            <Home/>
            <div className="home-content" >
                <div className='nav-item-div'>
                    <h1><br/>About Us<br/><br/></h1><br/>
                    <p className='aboutUsInfo'>
                        Welcome to<br/> <em>Educational Digital libary!</em><br /> your personal gateway to a world of knowledge, imagination, and discovery.
                        Founded with a love for books and a passion for learning, our digital bookstore offers a curated selection of titles for readers of all ages — from timeless classics and bestselling novels to educational resources and inspiring non-fiction.
                        <br />We believe that reading should be:<br />
                        ✨ Accessible – anytime, anywhere, on any device.<br />
                        📖 Personal – with collections tailored to your interests.<br />
                        🌍 Connected – joining readers, educators, and learners around the globe.<br />
                        Whether you're a student, a teacher, a lifelong learner or a curious soul — you'll find something here to spark your mind and uplift your day.
                        Thank you for being part of our reading community.
                    </p>
                </div>
            </div>
        </div>
    );
}
export default AboutUs;