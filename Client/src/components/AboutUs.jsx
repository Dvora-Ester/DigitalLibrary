import React, { useEffect, useState } from 'react';
import '../styleSheets/info.css';
import Home from './Home.jsx'
const AboutUs=()=>{

    return (
        <div className='pageContainer'>
            <Home></Home>
            <div className="home-content" >
                <div className='nav-item-div'>About Us
                    <p className='aboutUsInfo'>
                        Welcome to <em>Educational Library Book</em>!<br /> your personal gateway to a world of knowledge, imagination, and discovery.
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