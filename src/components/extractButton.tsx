import { useState } from 'react';
import axios from 'axios';

interface Props {
  filePath: string;
  selectedPages: number[];
  onExtracted: (downloadUrl: string) => void;
  onError: (msg: string) => void;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const ExtractButton = ({ filePath, selectedPages, onExtracted, onError }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (selectedPages.length === 0) {
      onError('Please select at least one page to extract.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/pdf/extract`, {
        filePath,
        pages: selectedPages,
      });
      onExtracted(`${BASE_URL}${res.data.downloadUrl}`);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'Extraction failed'
          : 'Extraction failed';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-bar">
      <div className="action-bar-info">
        <span className="selection-pill">
          📑 {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          Ready to extract
        </span>
      </div>

      <button
        id="extract-btn"
        className="btn-primary"
        onClick={handleExtract}
        disabled={loading || selectedPages.length === 0}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Extracting…
          </>
        ) : (
          <>
            ✂️ Extract Pages
          </>
        )}
      </button>
    </div>
  );
};

export default ExtractButton;