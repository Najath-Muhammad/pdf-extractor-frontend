export type Step = 'upload' | 'select' | 'done';

export interface UploadedFile {
  filePath: string;
  pageCount: number;
  originalName: string;
}

export interface ExtractRequest {
  filePath: string;
  pages: number[];
}
