interface Props {
  downloadUrl: string;
  selectedCount: number;
  onStartOver: () => void;
}

const DownloadCard = ({ downloadUrl, selectedCount, onStartOver }: Props) => {
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
            download
            className="btn-download"
            rel="noopener noreferrer"
          >
            ⬇️ Download PDF
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
