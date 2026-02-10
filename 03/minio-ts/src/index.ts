/**
 * MinIO TypeScript Application
 * Main entry point with interactive menu
 */

import * as readline from 'readline';
import { testConnection } from './config/minio.config';
import { createMultipleBuckets, getStandardBuckets, listBuckets } from './services/bucket.service';
import { listFiles, uploadMultipleFiles } from './services/file.service';
import { generateAllFiles } from './utils/file-generator';
import { Logger } from './utils/logger';
import { executeCompleteWorkflow } from './workflows/complete-workflow';
import * as path from 'path';

/**
 * Create readline interface for user input
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompt user for input
 */
function prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Display main menu
 */
function displayMenu(): void {
    Logger.separator();
    console.log('MinIO TypeScript Application - Main Menu');
    Logger.separator();
    console.log('1. Verify MinIO connection');
    console.log('2. Create standard buckets');
    console.log('3. Generate test files (~100 files)');
    console.log('4. Upload files to buckets');
    console.log('5. List files in buckets');
    console.log('6. List all buckets');
    console.log('7. Run complete workflow (all steps)');
    console.log('0. Exit');
    Logger.separator();
}

/**
 * Handle menu option 1: Verify connection
 */
async function handleVerifyConnection(): Promise<void> {
    Logger.header('Verifying MinIO Connection');

    const connected = await testConnection();

    if (connected) {
        Logger.success('Successfully connected to MinIO!');
        Logger.info('MinIO is running at: http://localhost:9000');
        Logger.info('Console available at: http://localhost:9001');
    } else {
        Logger.error('Failed to connect to MinIO');
        Logger.warn('Please ensure the MinIO container is running');
        Logger.info('Try: docker start minio');
    }
}

/**
 * Handle menu option 2: Create buckets
 */
async function handleCreateBuckets(): Promise<void> {
    Logger.header('Creating Standard Buckets');

    const bucketNames = getStandardBuckets();
    Logger.info(`Will create ${bucketNames.length} buckets:`);
    bucketNames.forEach(name => Logger.info(`  - ${name}`));

    await createMultipleBuckets(bucketNames);
    Logger.success('Bucket creation complete');
}

/**
 * Handle menu option 3: Generate files
 */
async function handleGenerateFiles(): Promise<void> {
    Logger.header('Generating Test Files');

    const generatedFilesDir = path.join(process.cwd(), '..', 'generated-files');
    Logger.info(`Output directory: ${generatedFilesDir}`);

    const files = await generateAllFiles(generatedFilesDir);

    const total =
        files.textFiles.length +
        files.jsonFiles.length +
        files.csvFiles.length +
        files.xmlFiles.length +
        files.markdownFiles.length;

    Logger.success(`Generated ${total} files total`);
    Logger.info(`  - Text files: ${files.textFiles.length}`);
    Logger.info(`  - JSON files: ${files.jsonFiles.length}`);
    Logger.info(`  - CSV files: ${files.csvFiles.length}`);
    Logger.info(`  - XML files: ${files.xmlFiles.length}`);
    Logger.info(`  - Markdown files: ${files.markdownFiles.length}`);
}

/**
 * Handle menu option 4: Upload files
 */
async function handleUploadFiles(): Promise<void> {
    Logger.header('Uploading Files to Buckets');

    const generatedFilesDir = path.join(process.cwd(), '..', 'generated-files');
    Logger.info(`Reading files from: ${generatedFilesDir}`);

    // Re-generate file lists (or read from directory)
    const files = await generateAllFiles(generatedFilesDir);

    // Upload to respective buckets
    await uploadMultipleFiles('text-files', files.textFiles);
    await uploadMultipleFiles('json-data', files.jsonFiles);
    await uploadMultipleFiles('csv-data', files.csvFiles);
    await uploadMultipleFiles('xml-documents', files.xmlFiles);
    await uploadMultipleFiles('markdown-docs', files.markdownFiles);

    Logger.success('Upload complete');
}

/**
 * Handle menu option 5: List files in buckets
 */
async function handleListFiles(): Promise<void> {
    Logger.header('Listing Files in Buckets');

    const bucketNames = getStandardBuckets();

    for (const bucketName of bucketNames) {
        try {
            const files = await listFiles(bucketName);
            Logger.info(`\nBucket: ${bucketName} (${files.length} files)`);

            files.slice(0, 5).forEach(file => {
                Logger.info(`  - ${file.name} (${formatBytes(file.size)})`);
            });

            if (files.length > 5) {
                Logger.info(`  ... and ${files.length - 5} more files`);
            }
        } catch (error) {
            Logger.warn(`Could not list files in bucket: ${bucketName}`);
        }
    }
}

/**
 * Handle menu option 6: List buckets
 */
async function handleListBuckets(): Promise<void> {
    Logger.header('Listing All Buckets');

    const buckets = await listBuckets();

    Logger.info(`Found ${buckets.length} bucket(s):`);
    buckets.forEach(bucket => {
        Logger.info(`  - ${bucket.name} (created: ${bucket.creationDate.toLocaleDateString()})`);
    });
}

/**
 * Handle menu option 7: Run complete workflow
 */
async function handleCompleteWorkflow(): Promise<void> {
    await executeCompleteWorkflow();
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

/**
 * Main application loop
 */
async function main(): Promise<void> {
    Logger.header('MinIO TypeScript Application');
    Logger.info('Welcome! This application helps you manage files in MinIO.');

    let running = true;

    while (running) {
        displayMenu();
        const choice = await prompt('Enter your choice: ');

        try {
            switch (choice) {
                case '1':
                    await handleVerifyConnection();
                    break;
                case '2':
                    await handleCreateBuckets();
                    break;
                case '3':
                    await handleGenerateFiles();
                    break;
                case '4':
                    await handleUploadFiles();
                    break;
                case '5':
                    await handleListFiles();
                    break;
                case '6':
                    await handleListBuckets();
                    break;
                case '7':
                    await handleCompleteWorkflow();
                    break;
                case '0':
                    Logger.info('Goodbye!');
                    running = false;
                    break;
                default:
                    Logger.warn('Invalid choice. Please try again.');
            }
        } catch (error) {
            Logger.error('An error occurred', error);
        }

        if (running) {
            await prompt('\nPress Enter to continue...');
        }
    }

    rl.close();
}

// Run the application
if (require.main === module) {
    main()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            Logger.error('Fatal error', error);
            process.exit(1);
        });
}
