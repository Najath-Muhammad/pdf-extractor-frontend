import { useState, useCallback } from 'react';
import './App.css';
import UploadComponent from './components/uploadComponent';
import ShowPages from './components/showPages';
import ExtractButton from './components/extractButton';
import DownloadCard from './components/downloadCard';
import type { Step, UploadedFile } from './types';

function App() {
  const [step, setStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const stepIndex = step === 'upload' ? 0 : step === 'select' ? 1 : 2;

  const handleUploaded = useCallback((result: UploadedFile) => {
    setUploadedFile(result);
    setSelectedPages([]);
    setError('');
    setStep('select');
  }, []);

  const handleTogglePage = useCallback((page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!uploadedFile) return;
    setSelectedPages(Array.from({ length: uploadedFile.pageCount }, (_, i) => i + 1));
  }, [uploadedFile]);

  const handleClearAll = useCallback(() => setSelectedPages([]), []);

  const handleExtracted = useCallback((url: string) => {
    setDownloadUrl(url);
    setError('');
    setStep('done');
  }, []);

  const handleStartOver = useCallback(() => {
    setStep('upload');
    setUploadedFile(null);
    setSelectedPages([]);
    setDownloadUrl('');
    setError('');
  }, []);

  const steps = [
    { label: 'Upload' },
    { label: 'Select Pages' },
    { label: 'Download' },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">📄</div>
          <span className="logo-text">PDF Extractor</span>
        </div>
        <span className="header-badge">Free · No Login</span>
      </header>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Instant PDF Page Extraction
          </div>
          <h1>Extract Pages<br />from Any PDF</h1>
          <p className="hero-subtitle">
            Upload your PDF, choose the pages you need, and download
            a brand-new file in seconds — no account required.
          </p>
        </section>

        {/* Step Progress */}
        <div className="steps-bar" role="navigation" aria-label="Steps">
          {steps.map((s, idx) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={`step-item ${idx === stepIndex ? 'active' : idx < stepIndex ? 'done' : ''}`}
              >
                <div className="step-circle">
                  {idx < stepIndex ? '✓' : idx + 1}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`step-connector${idx < stepIndex ? ' done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Toast */}
        {error && (
          <div className="toast" role="alert">
            <span className="toast-icon">⚠️</span>
            <span>{error}</span>
            <button className="toast-close" onClick={() => setError('')} aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Step: Upload */}
        {step === 'upload' && (
          <UploadComponent onUploaded={handleUploaded} />
        )}

        {/* Step: Select Pages */}
        {step === 'select' && uploadedFile && (
          <>
            <div className="file-info-card">
              <div className="file-info-icon">📄</div>
              <div className="file-info-details">
                <p className="file-info-name">{uploadedFile.originalName}</p>
                <div className="file-info-meta">
                  <span>{uploadedFile.pageCount} pages</span>
                </div>
              </div>
              <span className="file-info-badge">✓ Uploaded</span>
              <button id="change-file-btn" className="file-change-btn" onClick={handleStartOver}>
                Change File
              </button>
            </div>

            <ShowPages
              pageCount={uploadedFile.pageCount}
              selectedPages={selectedPages}
              onToggle={handleTogglePage}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              pdfUrl={`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${uploadedFile.filePath}`}
            />

            <ExtractButton
              filePath={uploadedFile.filePath}
              selectedPages={selectedPages}
              onExtracted={handleExtracted}
              onError={setError}
            />
          </>
        )}

        {/* Step: Download */}
        {step === 'done' && (
          <DownloadCard
            downloadUrl={downloadUrl}
            selectedCount={selectedPages.length}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer className="footer">
        <p>PDF Extractor — Fast, free, and works entirely in your browser.</p>
      </footer>
    </div>
  );
}

export default App;
