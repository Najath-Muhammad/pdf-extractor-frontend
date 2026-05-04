import { useMemo, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props {
  pageCount: number;
  selectedPages: number[];
  onToggle: (page: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  pdfUrl: string;
}

const ShowPages = ({ pageCount, selectedPages, onToggle, onSelectAll, onClearAll, pdfUrl }: Props) => {
  const allSelected = selectedPages.length === pageCount;

  // Fetch the PDF as ArrayBuffer in the main thread so CORS is handled
  // correctly — avoids the react-pdf Web Worker cross-origin fetch failure.
  const [pdfData, setPdfData] = useState<{ data: ArrayBuffer } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetching(true);
    setLoadError(null);
    setPdfData(null);

    fetch(pdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — could not fetch PDF`);
        return res.arrayBuffer();
      })
      .then((buf) => setPdfData({ data: buf }))
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setFetching(false));
  }, [pdfUrl]);

  const pagesArray = useMemo(() => Array.from({ length: pageCount }, (_, i) => i + 1), [pageCount]);

  return (
    <div className="page-selector-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon">📑</span>
          Select Pages to Extract
        </h2>
        <div className="page-actions">
          <button
            id="select-all-btn"
            className="btn-ghost"
            onClick={allSelected ? onClearAll : onSelectAll}
          >
            {allSelected ? '✕ Deselect All' : '✓ Select All'}
          </button>
          {selectedPages.length > 0 && (
            <button id="clear-btn" className="btn-ghost" onClick={onClearAll}>
              🗑 Clear
            </button>
          )}
        </div>
      </div>

      <p className="selected-summary">
        <strong>{selectedPages.length}</strong> of{' '}
        <strong>{pageCount}</strong> pages selected
        {selectedPages.length > 0 && (
          <> &mdash; pages {[...selectedPages].sort((a, b) => a - b).join(', ')}</>
        )}
      </p>

      {loadError && (
        <div className="toast" role="alert" style={{ marginBottom: 16 }}>
          <span className="toast-icon">⚠️</span>
          <span>Could not load PDF preview: {loadError}</span>
        </div>
      )}

      <div className="pages-scroll-container">
        {fetching && (
          <div className="loading-doc">⏳ Loading PDF pages...</div>
        )}

        {!fetching && pdfData && (
          <Document
            file={pdfData}
            loading={<div className="loading-doc">⏳ Rendering pages...</div>}
            onLoadError={(err) => setLoadError(err.message)}
          >
            {pagesArray.map((page) => {
              const isSelected = selectedPages.includes(page);
              return (
                <div
                  key={page}
                  className={`page-preview-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggle(page)}
                >
                  <div className="page-preview-header">
                    <span>Page {page}</span>
                    <div className="page-preview-check">
                      {isSelected ? '✓ Selected' : 'Click to Select'}
                    </div>
                  </div>
                  <div className="page-preview-content">
                    <Page
                      pageNumber={page}
                      width={window.innerWidth > 800 ? 600 : window.innerWidth - 80}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                </div>
              );
            })}
          </Document>
        )}
      </div>
    </div>
  );
};

export default ShowPages;