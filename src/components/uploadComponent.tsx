import { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await axios.post("http://localhost:5000/api/pdf/upload", formData);

    console.log(res.data);
  };

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
};

export default Upload;