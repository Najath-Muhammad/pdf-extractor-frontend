import { useState } from 'react';

interface Props {
  downloadUrl: string;
  selectedCount: number;
  onStartOver: () => void;
}

const DownloadCard = ({ downloadUrl, selectedCount, onStartOver }: Props) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadUrl.split('/').pop() || 'extracted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // Fallback to direct navigation if fetch fails
      window.open(downloadUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="download-section">
      <div className="download-card">
        <div className="download-icon-wrap">🎉</div>

        <h2 className="download-title">Your PDF is ready!</h2>
        <p className="download-subtitle">
          Successfully extracted {selectedCount} page{selectedCount !== 1 ? 's' : ''} from your document.
        </p>

        <div className="download-stats">
          <div className="download-stat">
            <span className="download-stat-value">{selectedCount}</span>
            <span className="download-stat-label">Pages Extracted</span>
          </div>
          <div className="download-stat">
            <span className="download-stat-value">✓</span>
            <span className="download-stat-label">Ready to Download</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <a
            id="download-btn"
            href={downloadUrl}
            onClick={handleDownload}
            className="btn-download"
            style={{ pointerEvents: downloading ? 'none' : 'auto', opacity: downloading ? 0.7 : 1 }}
          >
            {downloading ? '⏳ Downloading...' : '⬇️ Download PDF'}
          </a>

          <button
            id="start-over-btn"
            className="btn-start-over"
            onClick={onStartOver}
          >
            🔄 Extract Another PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
