/**
 * Validators Utility
 * 
 * Provides validation functions for bucket names, file paths, and other inputs
 */

/**
 * Validate bucket name according to S3/MinIO naming rules:
 * - Must be between 3 and 63 characters long
 * - Can contain only lowercase letters, numbers, dots (.), and hyphens (-)
 * - Must begin and end with a letter or number
 * - Must not be formatted as an IP address
 */
export function isValidBucketName(bucketName: string): boolean {
    // Length check
    if (bucketName.length < 3 || bucketName.length > 63) {
        return false;
    }

    // Pattern check: lowercase letters, numbers, dots, hyphens
    const pattern = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/;
    if (!pattern.test(bucketName)) {
        return false;
    }

    // Must not be formatted as IP address
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(bucketName)) {
        return false;
    }

    // No consecutive dots
    if (bucketName.includes('..')) {
        return false;
    }

    return true;
}

/**
 * Validate file path exists and is accessible
 */
export function isValidFilePath(filePath: string): boolean {
    if (!filePath || filePath.trim() === '') {
        return false;
    }

    // Check for invalid characters (Windows)
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(filePath)) {
        return false;
    }

    return true;
}

/**
 * Validate file extension
 */
export function hasValidExtension(fileName: string, allowedExtensions: string[]): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) {
        return false;
    }

    return allowedExtensions.includes(ext);
}

/**
 * Sanitize object name for MinIO
 * Remove or replace invalid characters
 */
export function sanitizeObjectName(objectName: string): string {
    // Replace backslashes with forward slashes
    let sanitized = objectName.replace(/\\/g, '/');

    // Remove leading slashes
    sanitized = sanitized.replace(/^\/+/, '');

    // Replace multiple consecutive slashes with single slash
    sanitized = sanitized.replace(/\/+/g, '/');

    return sanitized;
}

/**
 * Sanitize bucket name
 */
export function sanitizeBucketName(bucketName: string): string {
    // Convert to lowercase
    let sanitized = bucketName.toLowerCase();

    // Replace invalid characters with hyphens
    sanitized = sanitized.replace(/[^a-z0-9.-]/g, '-');

    // Remove leading/trailing hyphens and dots
    sanitized = sanitized.replace(/^[-.]|[-.]$/g, '');

    // Replace consecutive dots or hyphens
    sanitized = sanitized.replace(/\.{2,}/g, '.');
    sanitized = sanitized.replace(/-{2,}/g, '-');

    // Ensure length constraints
    if (sanitized.length < 3) {
        sanitized = sanitized.padEnd(3, '0');
    }
    if (sanitized.length > 63) {
        sanitized = sanitized.substring(0, 63);
    }

    return sanitized;
}
