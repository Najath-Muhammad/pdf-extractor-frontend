import axios, { type AxiosProgressEvent } from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { UploadedFile } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export const uploadPdfFile = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const res = await axios.post<UploadedFile>(`${API}${API_ROUTES.PDF.UPLOAD}`, formData, {
    onUploadProgress: (e: AxiosProgressEvent) => {
      if (e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  return res.data;
};

export const extractPdfPages = async (
  filePath: string,
  pages: number[]
): Promise<string> => {
  const res = await axios.post<{ downloadUrl: string }>(`${API}${API_ROUTES.PDF.EXTRACT}`, {
    filePath,
    pages,
  });

  return `${BASE_URL}${res.data.downloadUrl}`;
};
