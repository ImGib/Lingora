import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import type { StoragePort, StorageUploadParams } from '../../application/storage/storage.port.js';

@Injectable()
export class LocalStorageService implements StoragePort {
  private readonly baseDir: string;

  constructor() {
    const defaultDir =
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
        ? path.join('/tmp', 'uploads')
        : path.resolve(process.cwd(), 'uploads');
    this.baseDir = process.env.STORAGE_LOCAL_DIR || defaultDir;
    try {
      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }
    } catch (err) {
      console.warn('LocalStorageService: could not create storage directory', err);
    }
  }

  async upload(params: StorageUploadParams): Promise<{ url: string; path: string }> {
    const targetDir = path.join(this.baseDir, params.bucket, path.dirname(params.path));
    await fsp.mkdir(targetDir, { recursive: true });

    const filePath = path.join(this.baseDir, params.bucket, params.path);
    await fsp.writeFile(filePath, params.buffer);

    const relativePath = `${params.bucket}/${params.path}`;
    const url = `/storage/${relativePath}`;
    return { url, path: relativePath };
  }

  async getSignedUrl(params: { bucket: string; path: string; expiresInSeconds?: number }): Promise<string> {
    return Promise.resolve(`/storage/${params.bucket}/${params.path}`);
  }

  async delete(params: { bucket: string; path: string }): Promise<void> {
    const filePath = path.join(this.baseDir, params.bucket, params.path);
    try {
      await fsp.unlink(filePath);
    } catch {
      // Ignored if file already does not exist
    }
  }
}
