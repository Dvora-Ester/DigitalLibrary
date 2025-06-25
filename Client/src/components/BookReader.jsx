
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
