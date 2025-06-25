// import React from 'react';
// import HTMLFlipBook from 'react-pageflip';
// import '../styleSheets/BookReader.css';

// function BookFlipReader({ book }) {
//     const totalPages = book.totalPages || 10;

//     const pages = Array.from({ length: totalPages }, (_, i) => (
//         <div className="page" key={i}>
//             <img
//                 src={`http://localhost:3000/bookPages/${book.Id}/page${i + 1}.jpg`}
//                 alt={`Page ${i + 1}`}
//                 className="page-image"
//             />
//         </div>
//     ));

//     return (
//         <div className="flipbook-wrapper">
//             <h2 className="book-title">{book.Book_Name}</h2>
//             <HTMLFlipBook
//                 width={500}
//                 height={700}
//                 size="stretch"
//                 minWidth={315}
//                 maxWidth={1000}
//                 minHeight={400}
//                 maxHeight={1536}
//                 drawShadow={true}
//                 flippingTime={800}
//                 useMouseEvents={true}
//                 className="flip-book"
//             >
//                 {pages}
//             </HTMLFlipBook>
//         </div>
//     );
// }

// export default BookFlipReader;
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PdfSecureViewer({ bookId, token }) {
    const pdfUrl = `http://localhost:3000/api/library/getBook/${bookId}`;

    // פלאגין לפריסה יפה, אבל נבטל כפתורי הורדה והדפסה
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: { enableShortcuts: false },
            downloadPlugin: { fileNameGenerator: () => null, enableShortcuts: false },
            printPlugin: { enableShortcuts: false }
        }
    });

    return (
        <div style={{ height: '90vh', border: '1px solid #ccc' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    httpHeaders={{
                        Authorization: `Bearer ${token}`,
                    }}
                    withCredentials={true}
                />
            </Worker>
        </div>
    );
}

export default PdfSecureViewer;
