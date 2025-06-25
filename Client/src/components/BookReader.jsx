import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '../styleSheets/BookReader.css';

function BookReader() {
    const location = useLocation();
    const { book } = location.state || {};

    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const token = currentUser.token;

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/library/getBook/${book.Id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('בעיה בשליפת הספר');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (err) {
                console.error(err);
                setError('שגיאה בטעינת הספר');
            }
        };

        if (book?.Id) {
            fetchPdf();
        }
    }, [book, token]);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: { enableShortcuts: false },
            downloadPlugin: { fileNameGenerator: () => null, enableShortcuts: false },
            printPlugin: { enableShortcuts: false }
        }
    });

    if (error) return <div>{error}</div>;
    if (!pdfUrl) return <div>טוען את הספר...</div>;

    return (
        <div style={{ height: '90vh', border: '1px solid #ccc' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
}

export default BookReader;
