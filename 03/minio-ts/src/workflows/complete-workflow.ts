/**
 * Complete Workflow
 * 
 * Automated workflow that executes all steps:
 * 1. Verify MinIO connection
 * 2. Create buckets
 * 3. Generate test files
 * 4. Upload files to buckets
 * 5. List uploaded files
 * 6. Download sample files for validation
 */

import * as path from 'path';
import { testConnection } from '../config/minio.config';
import { createMultipleBuckets, getStandardBuckets, listBuckets } from '../services/bucket.service';
import { uploadMultipleFiles, listFiles, downloadFile } from '../services/file.service';
import { generateAllFiles } from '../utils/file-generator';
import { Logger } from '../utils/logger';
import { WorkflowStats } from '../types';

/**
 * Execute the complete workflow
 */
export async function executeCompleteWorkflow(): Promise<void> {
    const stats: WorkflowStats = {
        bucketsCreated: 0,
        filesGenerated: 0,
        filesUploaded: 0,
        filesDownloaded: 0,
        errors: 0,
        startTime: new Date()
    };

    try {
        Logger.header('MinIO TypeScript Application - Complete Workflow');

        // Step 1: Verify MinIO connection
        Logger.header('Step 1: Verifying MinIO Connection');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Failed to connect to MinIO. Please ensure the container is running.');
        }
        Logger.success('Successfully connected to MinIO');
        Logger.separator();

        // Step 2: Create buckets
        Logger.header('Step 2: Creating Buckets');
        const bucketNames = getStandardBuckets();
        await createMultipleBuckets(bucketNames);
        stats.bucketsCreated = bucketNames.length;

        // List all buckets
        const buckets = await listBuckets();
        Logger.info(`Total buckets in MinIO: ${buckets.length}`);
        buckets.forEach(bucket => {
            Logger.info(`  - ${bucket.name} (created: ${bucket.creationDate.toISOString()})`);
        });
        Logger.separator();

        // Step 3: Generate test files
        Logger.header('Step 3: Generating Test Files');
        const generatedFilesDir = path.join(process.cwd(), '..', 'generated-files');
        const generatedFiles = await generateAllFiles(generatedFilesDir);

        stats.filesGenerated =
            generatedFiles.textFiles.length +
            generatedFiles.jsonFiles.length +
            generatedFiles.csvFiles.length +
            generatedFiles.xmlFiles.length +
            generatedFiles.markdownFiles.length;

        Logger.info(`Total files generated: ${stats.filesGenerated}`);
        Logger.separator();

        // Step 4: Upload files to buckets
        Logger.header('Step 4: Uploading Files to Buckets');

        // Upload text files
        Logger.info('Uploading text files...');
        const textResults = await uploadMultipleFiles('text-files', generatedFiles.textFiles);
        stats.filesUploaded += textResults.length;

        // Upload JSON files
        Logger.info('Uploading JSON files...');
        const jsonResults = await uploadMultipleFiles('json-data', generatedFiles.jsonFiles);
        stats.filesUploaded += jsonResults.length;

        // Upload CSV files
        Logger.info('Uploading CSV files...');
        const csvResults = await uploadMultipleFiles('csv-data', generatedFiles.csvFiles);
        stats.filesUploaded += csvResults.length;

        // Upload XML files
        Logger.info('Uploading XML files...');
        const xmlResults = await uploadMultipleFiles('xml-documents', generatedFiles.xmlFiles);
        stats.filesUploaded += xmlResults.length;

        // Upload Markdown files
        Logger.info('Uploading Markdown files...');
        const mdResults = await uploadMultipleFiles('markdown-docs', generatedFiles.markdownFiles);
        stats.filesUploaded += mdResults.length;

        Logger.success(`Total files uploaded: ${stats.filesUploaded}`);
        Logger.separator();

        // Step 5: List uploaded files
        Logger.header('Step 5: Listing Uploaded Files');

        for (const bucketName of bucketNames) {
            const files = await listFiles(bucketName);
            Logger.info(`Bucket "${bucketName}": ${files.length} files`);

            // Show first 3 files as sample
            files.slice(0, 3).forEach(file => {
                Logger.info(`  - ${file.name} (${formatBytes(file.size)})`);
            });

            if (files.length > 3) {
                Logger.info(`  ... and ${files.length - 3} more files`);
            }
        }
        Logger.separator();

        // Step 6: Download sample files for validation
        Logger.header('Step 6: Downloading Sample Files');
        const downloadsDir = path.join(process.cwd(), '..', 'downloads');

        // Download one file from each bucket
        for (const bucketName of bucketNames) {
            const files = await listFiles(bucketName);
            if (files.length > 0) {
                const sampleFile = files[0];
                const downloadPath = path.join(downloadsDir, bucketName, sampleFile.name);

                try {
                    await downloadFile(bucketName, sampleFile.name, downloadPath);
                    stats.filesDownloaded++;
                } catch (error) {
                    Logger.error(`Failed to download sample from ${bucketName}`);
                    stats.errors++;
                }
            }
        }

        Logger.success(`Downloaded ${stats.filesDownloaded} sample files`);
        Logger.separator();

        // Final statistics
        stats.endTime = new Date();
        printFinalStatistics(stats);

    } catch (error) {
        Logger.error('Workflow failed', error);
        stats.errors++;
        throw error;
    }
}

/**
 * Print final workflow statistics
 */
function printFinalStatistics(stats: WorkflowStats): void {
    Logger.header('Workflow Complete - Final Statistics');

    const duration = stats.endTime
        ? (stats.endTime.getTime() - stats.startTime.getTime()) / 1000
        : 0;

    Logger.info(`Start Time: ${stats.startTime.toISOString()}`);
    Logger.info(`End Time: ${stats.endTime?.toISOString()}`);
    Logger.info(`Duration: ${duration.toFixed(2)} seconds`);
    Logger.separator();

    Logger.success(`✓ Buckets Created: ${stats.bucketsCreated}`);
    Logger.success(`✓ Files Generated: ${stats.filesGenerated}`);
    Logger.success(`✓ Files Uploaded: ${stats.filesUploaded}`);
    Logger.success(`✓ Files Downloaded: ${stats.filesDownloaded}`);

    if (stats.errors > 0) {
        Logger.error(`✗ Errors: ${stats.errors}`);
    } else {
        Logger.success('✓ No errors encountered');
    }

    Logger.separator();
    Logger.success('All operations completed successfully!');
    Logger.info('You can now access MinIO console at: http://localhost:9001');
    Logger.info('Login with: adminadmin / adminadmin');
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

// Run the workflow if this file is executed directly
if (require.main === module) {
    executeCompleteWorkflow()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            Logger.error('Fatal error in workflow', error);
            process.exit(1);
        });
}
