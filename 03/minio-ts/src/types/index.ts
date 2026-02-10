/**
 * Type definitions for MinIO TypeScript application
 */

/**
 * File metadata information
 */
export interface FileMetadata {
    name: string;
    size: number;
    lastModified: Date;
    etag: string;
    contentType?: string;
}

/**
 * Bucket information
 */
export interface BucketInfo {
    name: string;
    creationDate: Date;
}

/**
 * Upload result information
 */
export interface UploadResult {
    bucketName: string;
    objectName: string;
    etag: string;
    versionId?: string | null;
}

/**
 * Download result information
 */
export interface DownloadResult {
    bucketName: string;
    objectName: string;
    filePath: string;
    size: number;
}

/**
 * MinIO configuration
 */
export interface MinioConfig {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
}

/**
 * File generation options
 */
export interface FileGenerationOptions {
    count: number;
    outputDir: string;
    prefix?: string;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
    bucketsCreated: number;
    filesGenerated: number;
    filesUploaded: number;
    filesDownloaded: number;
    errors: number;
    startTime: Date;
    endTime?: Date;
}
