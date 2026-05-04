import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

interface UploadResult {
  filePath: string;
  pageCount: number;
  originalName: string;
}

interface Props {
  onUploaded: (result: UploadResult) => void;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UploadComponent = ({ onUploaded }: Props) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') return;

    const formData = new FormData();
    formData.append('pdf', file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(`${API}/pdf/upload`, formData, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      onUploaded(res.data);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div className="upload-section">
      <div
        id="upload-zone"
        className={`upload-zone${dragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <div className="upload-zone-inner">
          <div className="upload-icon-wrap">
            <span className="upload-icon">{uploading ? '⏳' : '📤'}</span>
          </div>

          <p className="upload-title">
            {uploading ? 'Uploading your PDF...' : 'Drop your PDF here'}
          </p>
          <p className="upload-subtitle">
            {uploading
              ? `${progress}% complete`
              : 'or click to browse from your computer'}
          </p>

          {!uploading && (
            <button
              id="browse-btn"
              className="upload-browse-btn"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              📂 Browse Files
            </button>
          )}

          {uploading && (
            <div className="upload-progress-bar-wrap">
              <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="upload-meta">
            <span className="upload-meta-item">🔒 Secure</span>
            <span className="upload-meta-item">📄 PDF only</span>
            <span className="upload-meta-item">⚡ Fast upload</span>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
        id="pdf-file-input"
      />
    </div>
  );
};

export default UploadComponent;