/**
 * MinIO Client Configuration
 * 
 * This module provides a singleton MinIO client instance configured
 * to connect to the local MinIO server running in Docker.
 */

import * as Minio from 'minio';
import { MinioConfig } from '../types';

/**
 * MinIO connection configuration
 * Based on the container setup: windows-minio-1
 * - API Port: 9000
 * - Console Port: 9001
 * - Credentials: adminadmin/adminadmin
 */
const config: MinioConfig = {
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin123'
};

/**
 * Singleton MinIO client instance
 */
export const minioClient = new Minio.Client({
    endPoint: config.endPoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey
});

/**
 * Export configuration for reference
 */
export { config };

/**
 * Test MinIO connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        await minioClient.listBuckets();
        return true;
    } catch (error) {
        console.error('Failed to connect to MinIO:', error);
        return false;
    }
}
