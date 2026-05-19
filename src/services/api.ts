import { type AxiosProgressEvent } from 'axios';
import axiosInstance from './axiosInstance';
import { API_ROUTES } from '../constants/routes';
import type { UploadedFile } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export const uploadPdfFile = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const res = await axiosInstance.post<UploadedFile>(
    API_ROUTES.PDF.UPLOAD,
    formData,
    {
      // Let the browser set the correct multipart boundary
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    }
  );

  return res.data;
};

export const extractPdfPages = async (
  filePath: string,
  pages: number[]
): Promise<string> => {
  const res = await axiosInstance.post<{ downloadUrl: string }>(
    API_ROUTES.PDF.EXTRACT,
    { filePath, pages }
  );

  return `${BASE_URL}${res.data.downloadUrl}`;
};
