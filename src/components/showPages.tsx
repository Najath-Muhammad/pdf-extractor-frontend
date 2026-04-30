import { Document, Page } from "react-pdf";
import { useState } from "react";

const PdfViewer = ({ file }: { file: File }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const handleSelect = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page)
        ? prev.filter((p) => p !== page)
        : [...prev, page]
    );
  };

  return (
    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      {Array.from({ length: numPages }, (_, i) => (
        <div key={i}>
          <input type="checkbox" onChange={() => handleSelect(i + 1)} />
          <Page pageNumber={i + 1} />
        </div>
      ))}
    </Document>
  );
};