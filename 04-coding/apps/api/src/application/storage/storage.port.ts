export interface StorageUploadParams {
  bucket: string;
  path: string;
  buffer: Buffer;
  contentType: string;
}

export interface StoragePort {
  upload(params: StorageUploadParams): Promise<{ url: string; path: string }>;
  getSignedUrl(params: { bucket: string; path: string; expiresInSeconds?: number }): Promise<string>;
  delete(params: { bucket: string; path: string }): Promise<void>;
}

export const STORAGE_PORT = Symbol('STORAGE_PORT');
