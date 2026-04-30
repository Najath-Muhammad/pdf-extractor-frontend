const handleExtract = async () => {
    const res = await axios.post("http://localhost:5000/api/pdf/extract", {
      filePath,
      pages: selectedPages,
    });
  
    setDownloadUrl(res.data.newFilePath);
  };