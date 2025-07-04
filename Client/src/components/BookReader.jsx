import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import '../styleSheets/BookReader.css';
import flipSound from '../Assets/pageturn-102978 (mp3cut.net).mp3';

function BookReader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { book } = location.state || {};
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInput, setPageInput] = useState('');

    const flipBookRef = useRef(null);
    const audioRef = useRef(null);

    let currentUser = null;
    const rawUser = localStorage.getItem('CurrentUser');
    if (rawUser) {
        try {
            currentUser = JSON.parse(rawUser);
        } catch (e) {
            console.error("Invalid JSON in CurrentUser:", e);
        }
    }

    if (!currentUser) return <Navigate to="/login" />;
    const token = currentUser.token;

    const fetchAllPages = async () => {
        if (!book?.Id) return;

        const promises = [];
        for (let i = 1; i <= book.number_Of_Page; i++) {
            promises.push(
                fetch(`http://localhost:3000/api/library/book/${book.Id}/page/${i}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(async res => {
                        if (res.status === 401) {
                            alert("expired or invalid token, you are redictering to the login page")
                            navigate('/login');
                            return;

                        }
                        if (!res.ok) return null;
                        const blob = await res.blob();

                        return URL.createObjectURL(blob);
                    }).catch(() => null)
            );
        }

        const results = await Promise.all(promises);

        setPages(results);
    };

    useEffect(() => {
        fetchAllPages();
    }, []);

    const handlePageChange = (e) => {
        setCurrentPage(e.data);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const handleInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            const num = parseInt(pageInput);
            if (!isNaN(num) && num >= 1 && num <= book.number_Of_Page) {
                let targetIndex = num % 2 === 0 ? num - 2 : num - 1;
                if (targetIndex < 0) targetIndex = 0;

                flipBookRef.current.pageFlip().flip(targetIndex);
                setCurrentPage(targetIndex);
                setPageInput('');
            }
        }
    };

    if (!book?.Id) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                ⚠️ Book not found<br />
                <button onClick={() => navigate(-1)}>🔙 Return to my library</button>
            </div>
        );
    }

    return (
        <div className="book-reader">
            <audio ref={audioRef} src={flipSound} preload="auto" />

            <div className="book-flip-container">
                <HTMLFlipBook
                    width={350}
                    height={480}
                    minWidth={300}
                    maxWidth={600}
                    minHeight={400}
                    maxHeight={600}
                    size="stretch"
                    drawShadow={true}
                    showCover={false}
                    mobileScrollSupport={true}
                    className="flip-book"
                    ref={flipBookRef}
                    onFlip={handlePageChange}
                >
                    {pages.map((img, index) => (
                        <div className="page" key={index}>
                            {img ? (
                                <img src={img} alt={`Page ${index + 1}`} className="flip-page-image" />
                            ) : (
                                <div className="page-placeholder">Page {index + 1} not available</div>
                            )}
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>

            <div className="page-controls" style={{ textAlign: 'center', marginTop: '20px' }}>
                <span className='page-info'>Page {currentPage + 1} & {currentPage + 2} of {book.number_Of_Page}</span><br />

                <input
                    type="number"
                    min="1"
                    max={book.number_Of_Page}
                    value={pageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={`Enter page (1 - ${book.number_Of_Page})`}
                    style={{ padding: '8px', width: '150px', marginTop: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                /><br />

                <button className='return-btn' onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>🔙 Return to my library</button>
            </div>
        </div>
    );
}

export default BookReader;
