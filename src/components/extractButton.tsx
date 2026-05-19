import { useState } from 'react';
import { extractPdfPages } from '../services/api';
import { parseApiError } from '../utils/parseApiError';

interface Props {
  filePath: string;
  selectedPages: number[];
  onExtracted: (downloadUrl: string) => void;
  onError: (msg: string) => void;
}

const ExtractButton = ({ filePath, selectedPages, onExtracted, onError }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (selectedPages.length === 0) {
      onError('Please select at least one page to extract.');
      return;
    }

    setLoading(true);
    try {
      const url = await extractPdfPages(filePath, selectedPages);
      onExtracted(url);
    } catch (err: unknown) {
      onError(parseApiError(err, 'Extraction failed. Please try again.'));
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