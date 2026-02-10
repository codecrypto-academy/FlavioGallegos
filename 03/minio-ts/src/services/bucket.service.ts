/**
 * Bucket Service
 * 
 * Handles all bucket-related operations in MinIO
 */

import { minioClient } from '../config/minio.config';
import { BucketInfo } from '../types';
import { Logger } from '../utils/logger';
import { isValidBucketName, sanitizeBucketName } from '../utils/validators';

/**
 * Check if a bucket exists
 */
export async function bucketExists(bucketName: string): Promise<boolean> {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        return exists;
    } catch (error) {
        Logger.error(`Error checking if bucket exists: ${bucketName}`, error);
        throw error;
    }
}

/**
 * Create a new bucket
 * @param bucketName - Name of the bucket to create
 * @param region - Optional region (default: 'us-east-1')
 */
export async function createBucket(bucketName: string, region: string = 'us-east-1'): Promise<void> {
    try {
        // Validate bucket name
        if (!isValidBucketName(bucketName)) {
            const sanitized = sanitizeBucketName(bucketName);
            Logger.warn(`Invalid bucket name "${bucketName}", using sanitized version: "${sanitized}"`);
            bucketName = sanitized;
        }

        // Check if bucket already exists
        const exists = await bucketExists(bucketName);

        if (exists) {
            Logger.info(`Bucket "${bucketName}" already exists, skipping creation`);
            return;
        }

        // Create the bucket
        await minioClient.makeBucket(bucketName, region);
        Logger.success(`Created bucket: ${bucketName}`);
    } catch (error) {
        Logger.error(`Failed to create bucket: ${bucketName}`, error);
        throw error;
    }
}

/**
 * List all buckets
 */
export async function listBuckets(): Promise<BucketInfo[]> {
    try {
        const buckets = await minioClient.listBuckets();

        const bucketInfos: BucketInfo[] = buckets.map(bucket => ({
            name: bucket.name,
            creationDate: bucket.creationDate
        }));

        Logger.info(`Found ${bucketInfos.length} bucket(s)`);
        return bucketInfos;
    } catch (error) {
        Logger.error('Failed to list buckets', error);
        throw error;
    }
}

/**
 * Delete a bucket (must be empty)
 */
export async function deleteBucket(bucketName: string): Promise<void> {
    try {
        const exists = await bucketExists(bucketName);

        if (!exists) {
            Logger.warn(`Bucket "${bucketName}" does not exist`);
            return;
        }

        await minioClient.removeBucket(bucketName);
        Logger.success(`Deleted bucket: ${bucketName}`);
    } catch (error) {
        Logger.error(`Failed to delete bucket: ${bucketName}`, error);
        throw error;
    }
}

/**
 * Create multiple buckets
 */
export async function createMultipleBuckets(bucketNames: string[]): Promise<void> {
    Logger.info(`Creating ${bucketNames.length} buckets...`);

    for (const bucketName of bucketNames) {
        await createBucket(bucketName);
    }

    Logger.success(`Finished creating buckets`);
}

/**
 * Get bucket names for the application
 * These are the standard buckets used for organizing different file types
 */
export function getStandardBuckets(): string[] {
    return [
        'text-files',
        'json-data',
        'csv-data',
        'xml-documents',
        'markdown-docs'
    ];
}
