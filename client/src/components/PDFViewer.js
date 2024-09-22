import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import PDF.js

const PDFViewer = ({ pdfUrl, onClose }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      renderPage(1);
    };

    loadPdf();
  }, [pdfUrl]);

  const renderPage = async (num) => {
    const page = await pdfDoc.getPage(num);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.getElementById("pdf-canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext);
  };

  const handleNextPage = () => {
    if (pageNum < totalPages) {
      setPageNum((prevPage) => prevPage + 1);
      renderPage(pageNum + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageNum > 1) {
      setPageNum((prevPage) => prevPage - 1);
      renderPage(pageNum - 1);
    }
  };

  return (
    <div className="pdf-viewer">
      <div className="viewer-header">
        <button onClick={onClose}>Close</button>
      </div>

      <canvas id="pdf-canvas" />

      <div className="viewer-controls">
        <button onClick={handlePrevPage} disabled={pageNum <= 1}>
          Previous
        </button>
        <span>
          Page {pageNum} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={pageNum >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
