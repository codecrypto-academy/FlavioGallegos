/**
 * File Service
 * 
 * Handles all file-related operations in MinIO (upload, download, list, delete)
 */

import * as fs from 'fs';
import * as path from 'path';
import { minioClient } from '../config/minio.config';
import { FileMetadata, UploadResult, DownloadResult } from '../types';
import { Logger } from '../utils/logger';
import { sanitizeObjectName } from '../utils/validators';
import { bucketExists } from './bucket.service';

/**
 * Upload a file to MinIO
 * @param bucketName - Target bucket name
 * @param filePath - Local file path to upload
 * @param objectName - Optional object name in MinIO (defaults to filename)
 */
export async function uploadFile(
    bucketName: string,
    filePath: string,
    objectName?: string
): Promise<UploadResult> {
    try {
        // Check if bucket exists
        const exists = await bucketExists(bucketName);
        if (!exists) {
            throw new Error(`Bucket "${bucketName}" does not exist`);
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Use filename if objectName not provided
        if (!objectName) {
            objectName = path.basename(filePath);
        }

        // Sanitize object name
        objectName = sanitizeObjectName(objectName);

        // Get file stats for metadata
        const stats = fs.statSync(filePath);

        // Upload file
        const result = await minioClient.fPutObject(bucketName, objectName, filePath, {
            'Content-Type': getContentType(filePath)
        });

        Logger.success(`Uploaded: ${objectName} to ${bucketName} (${formatBytes(stats.size)})`);

        return {
            bucketName,
            objectName,
            etag: result.etag || '',
            versionId: result.versionId
        };
    } catch (error) {
        Logger.error(`Failed to upload file: ${filePath}`, error);
        throw error;
    }
}

/**
 * Download a file from MinIO
 * @param bucketName - Source bucket name
 * @param objectName - Object name in MinIO
 * @param downloadPath - Local path to save the file
 */
export async function downloadFile(
    bucketName: string,
    objectName: string,
    downloadPath: string
): Promise<DownloadResult> {
    try {
        // Check if bucket exists
        const exists = await bucketExists(bucketName);
        if (!exists) {
            throw new Error(`Bucket "${bucketName}" does not exist`);
        }

        // Ensure download directory exists
        const downloadDir = path.dirname(downloadPath);
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Download file
        await minioClient.fGetObject(bucketName, objectName, downloadPath);

        // Get file size
        const stats = fs.statSync(downloadPath);

        Logger.success(`Downloaded: ${objectName} from ${bucketName} (${formatBytes(stats.size)})`);

        return {
            bucketName,
            objectName,
            filePath: downloadPath,
            size: stats.size
        };
    } catch (error) {
        Logger.error(`Failed to download file: ${objectName}`, error);
        throw error;
    }
}

/**
 * List all files in a bucket
 * @param bucketName - Bucket name to list files from
 * @param prefix - Optional prefix to filter objects
 */
export async function listFiles(bucketName: string, prefix?: string): Promise<FileMetadata[]> {
    try {
        // Check if bucket exists
        const exists = await bucketExists(bucketName);
        if (!exists) {
            throw new Error(`Bucket "${bucketName}" does not exist`);
        }

        const files: FileMetadata[] = [];

        const stream = minioClient.listObjects(bucketName, prefix, true);

        return new Promise((resolve, reject) => {
            stream.on('data', (obj) => {
                if (obj.name) {
                    files.push({
                        name: obj.name,
                        size: obj.size || 0,
                        lastModified: obj.lastModified || new Date(),
                        etag: obj.etag || ''
                    });
                }
            });

            stream.on('end', () => {
                Logger.info(`Found ${files.length} file(s) in bucket: ${bucketName}`);
                resolve(files);
            });

            stream.on('error', (error) => {
                Logger.error(`Failed to list files in bucket: ${bucketName}`, error);
                reject(error);
            });
        });
    } catch (error) {
        Logger.error(`Failed to list files in bucket: ${bucketName}`, error);
        throw error;
    }
}

/**
 * Delete a file from MinIO
 * @param bucketName - Bucket name
 * @param objectName - Object name to delete
 */
export async function deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
        await minioClient.removeObject(bucketName, objectName);
        Logger.success(`Deleted: ${objectName} from ${bucketName}`);
    } catch (error) {
        Logger.error(`Failed to delete file: ${objectName}`, error);
        throw error;
    }
}

/**
 * Get file metadata
 * @param bucketName - Bucket name
 * @param objectName - Object name
 */
export async function getFileMetadata(bucketName: string, objectName: string): Promise<FileMetadata> {
    try {
        const stat = await minioClient.statObject(bucketName, objectName);

        return {
            name: objectName,
            size: stat.size,
            lastModified: stat.lastModified,
            etag: stat.etag
        };
    } catch (error) {
        Logger.error(`Failed to get metadata for: ${objectName}`, error);
        throw error;
    }
}

/**
 * Upload multiple files to a bucket
 */
export async function uploadMultipleFiles(
    bucketName: string,
    filePaths: string[]
): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    Logger.info(`Uploading ${filePaths.length} files to ${bucketName}...`);

    for (const filePath of filePaths) {
        try {
            const result = await uploadFile(bucketName, filePath);
            results.push(result);
        } catch (error) {
            Logger.error(`Failed to upload ${filePath}, continuing...`);
        }
    }

    Logger.success(`Uploaded ${results.length}/${filePaths.length} files successfully`);
    return results;
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();

    const contentTypes: { [key: string]: string } = {
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.csv': 'text/csv',
        '.xml': 'application/xml',
        '.md': 'text/markdown',
        '.html': 'text/html',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.pdf': 'application/pdf'
    };

    return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
