import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import '../styleSheets/BookReader.css';

function BookReader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { book } = location.state || {};
    const [page, setPage] = useState(1);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);

let currentUser = null;
const rawUser = localStorage.getItem('CurrentUser');
if (rawUser) {
  try {
    currentUser = JSON.parse(rawUser);
  } catch (e) {
    console.error("Invalid JSON in CurrentUser:", e);
  }
}    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const token = currentUser.token;

    useEffect(() => {
        const fetchPageImage = async () => {
            try {
                console.log("Fetching page image for book:", book, "page:", page);
                const response = await fetch(`http://localhost:3000/api/library/book/${book.Id}/page/${page}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("שגיאה בטעינת עמוד");
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("⚠️ לא ניתן לטעון את העמוד או שהוא לא קיים");
                setImageUrl(null);
            }
        };

        if (book?.Id && page > 0) {
            fetchPageImage();
        }
    }, [book, page, token]);

    if (!book?.Id) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                ⚠️ ספר לא נבחר
                <br />
                <button onClick={() => navigate(-1)}>🔙 חזור</button>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => navigate(-1)}>🔙 חזור</button>
            </div>
        );
    }

    return (
        <div className="book-reader">
            <div className="book-navigation" style={{ margin: '10px 0' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>◀ הקודם</button>
                <span style={{ margin: '0 1rem' }}>עמוד {page}</span>
                <button onClick={() => setPage(p => p + 1)}>▶ הבא</button>
            </div>

            <div className="book-page" style={{ textAlign: 'center' }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`Page ${page}`}
                        onContextMenu={e => e.preventDefault()}
                        draggable={false}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '85vh',
                            border: '1px solid #ccc',
                            userSelect: 'none',
                        }}
                    />
                ) : (
                    <p>⏳ טוען עמוד...</p>
                )}
            </div>
        </div>
    );
}

// export default BookReader;












// import React, { useEffect, useState ,useNavigate} from 'react';
// import { useLocation, Navigate } from 'react-router-dom';
// import '../styleSheets/BookReader.css';




// function BookReader() {
//     const location = useLocation();
//     const { book } = location.state || {};
//     const [page, setPage] = useState(1);
//     const [imageUrl, setImageUrl] = useState(null);
//     const [error, setError] = useState(null);

//     const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
//     if (!currentUser) {
//         return <Navigate to="/login" />;
//     }

//     const token = currentUser.token;

//     useEffect(() => {
//         const fetchPageImage = async () => {
//             try {
//             console.log("Fetching page image for book:", book, "page:", page);
//                 const response = await fetch(`http://localhost:3000/api/library/book/${book.Id}/page/${page}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error("שגיאה בטעינת עמוד");
//                 }

//                 const blob = await response.blob();
//                 const url = URL.createObjectURL(blob);
//                 setImageUrl(url);
//             } catch (err) {
//                 console.error(err);
//                 setError("⚠️ לא ניתן לטעון את העמוד או שהוא לא קיים");
//                 setImageUrl(null);
//             }
//         };

//         if (book?.Id && page > 0) {
//             fetchPageImage();
//         }
//     }, [book, page, token]);

//     if (!book?.Id) return <div>⚠️ ספר לא נבחר</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <div className="book-reader">
//             <div className="book-navigation" style={{ margin: '10px 0' }}>
//                 <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>◀ הקודם</button>
//                 <span style={{ margin: '0 1rem' }}>עמוד {page}</span>
//                 <button onClick={() => setPage(p => p + 1)}>▶ הבא</button>
//             </div>

//             <div className="book-page" style={{ textAlign: 'center' }}>
//                 {imageUrl ? (
//                     <img
//                         src={imageUrl}
//                         alt={`Page ${page}`}
//                         onContextMenu={(e) => e.preventDefault()} // מניעת קליק ימני
//                         draggable={false}                         // מניעת גרירה
//                         style={{
//                             maxWidth: '100%',
//                             maxHeight: '85vh',
//                             border: '1px solid #ccc',
//                             userSelect: 'none',
//                         }}
//                     />
//                 ) : (
//                     <p>⏳ טוען עמוד...</p>
//                 )}
//             </div>
//         </div>
//     );
// }


export default BookReader;
