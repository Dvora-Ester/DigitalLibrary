import React, { useEffect, useState } from 'react';
import '../StyleSheet/Filters.css';

const Filters = ({ albumsToShow, setAlbumsToShow }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [input, setInput] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChangeInput = (event) => {
        setInput(event.target.value);
    };

    let CurrenetUserAllAlbums = [];
    try {
        const storedData = localStorage.getItem('AllAlbumsOfCurrentUser');
        CurrenetUserAllAlbums = storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
    }

    useEffect(() => {
        if (selectedOption === 'Title') {
            setAlbumsToShow(CurrenetUserAllAlbums.filter(album => album.title.includes(input)));
        } else if (selectedOption === 'Id') {
            if(input!=='')
            {
               setAlbumsToShow(CurrenetUserAllAlbums.filter(album => {return Number(album.id) === Number(input);                                                      
            }));
            }
            else{
                setAlbumsToShow(CurrenetUserAllAlbums);
            }
            
        } else if (selectedOption === '') {
            setAlbumsToShow(CurrenetUserAllAlbums);
        }
    }, [selectedOption, input]);

    return (
        <div className="filters-container">
            <label htmlFor="search">Choose To filter by:</label>
            <div className="filters">
                <label htmlFor="filter-select">Filter by:</label>
                <select id="filter-select" value={selectedOption} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="Title">Title</option>
                    <option value="Id">Id</option>
                </select>
                <input 
                    value={input} 
                    onChange={handleChangeInput} 
                    placeholder="Enter filter value..." 
                />
            </div>
        </div>
    );
};

export default Filters;
