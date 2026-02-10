# MinIO TypeScript Application - Usage Guide

## Overview

This application provides a complete solution for managing files in MinIO object storage using TypeScript. It includes functionality to create buckets, generate test files, upload/download files, and more.

## Prerequisites

- Docker Desktop running
- MinIO container running on ports 9000 (API) and 9001 (Console)
- Node.js and npm installed
- TypeScript installed (included in dependencies)

## Installation

1. Navigate to the project directory:
```bash
cd minio-ts
```

2. Install dependencies (already done):
```bash
npm install
```

## Running the Application

### Option 1: Interactive Menu (Recommended)

Run the interactive menu application:

```bash
npm run dev
```

This will present you with a menu of options:
- Verify MinIO connection
- Create standard buckets
- Generate test files
- Upload files to buckets
- List files in buckets
- List all buckets
- Run complete workflow

### Option 2: Complete Workflow (Automated)

Run the complete automated workflow:

```bash
npm run start:complete
```

This will automatically:
1. Verify MinIO connection
2. Create 5 standard buckets
3. Generate 100 test files
4. Upload all files to appropriate buckets
5. List uploaded files
6. Download sample files for validation

### Option 3: Build and Run Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

## Project Structure

```
minio-ts/
├── src/
│   ├── config/
│   │   └── minio.config.ts      # MinIO client configuration
│   ├── services/
│   │   ├── bucket.service.ts    # Bucket operations
│   │   └── file.service.ts      # File operations
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── file-generator.ts    # Test file generator
│   │   ├── logger.ts            # Colored logging utility
│   │   └── validators.ts        # Input validation
│   ├── workflows/
│   │   └── complete-workflow.ts # Automated workflow
│   └── index.ts                 # Main entry point
├── dist/                        # Compiled JavaScript (after build)
├── package.json
└── tsconfig.json
```

## Standard Buckets

The application creates and uses 5 standard buckets:

1. **text-files** - Plain text files (.txt)
2. **json-data** - JSON data files (.json)
3. **csv-data** - CSV data files (.csv)
4. **xml-documents** - XML documents (.xml)
5. **markdown-docs** - Markdown documents (.md)

## Generated Files

The application generates 100 test files with the following distribution:

- 25 Text files (.txt)
- 25 JSON files (.json)
- 20 CSV files (.csv)
- 15 XML files (.xml)
- 15 Markdown files (.md)

Files are generated in the `../generated-files/` directory.

## MinIO Console Access

You can access the MinIO web console to view uploaded files:

- **URL**: http://localhost:9001
- **Username**: adminadmin
- **Password**: adminadmin

## Troubleshooting

### MinIO Container Not Running

If you get connection errors, start the MinIO container:

```bash
docker start minio
```

Verify it's running:

```bash
docker ps | grep minio
```

### Port Conflicts

Ensure ports 9000 and 9001 are not being used by other applications:

```bash
docker port minio
```

### Permission Errors

If you encounter PowerShell execution policy errors, use cmd instead:

```bash
cmd /c npm run dev
```

### TypeScript Compilation Errors

Clean and rebuild:

```bash
npm run clean
npm run build
```

## Example Workflow

Here's a typical workflow:

1. **Start MinIO** (if not running):
   ```bash
   docker start minio
   ```

2. **Run the complete workflow**:
   ```bash
   cd minio-ts
   npm run start:complete
   ```

3. **Verify in MinIO Console**:
   - Open http://localhost:9001
   - Login with adminadmin/adminadmin
   - Browse the 5 buckets
   - View uploaded files

4. **Check downloaded samples**:
   ```bash
   ls ../downloads/
   ```

## API Usage Examples

### Create a Bucket

```typescript
import { createBucket } from './services/bucket.service';

await createBucket('my-bucket');
```

### Upload a File

```typescript
import { uploadFile } from './services/file.service';

await uploadFile('my-bucket', './path/to/file.txt');
```

### List Files

```typescript
import { listFiles } from './services/file.service';

const files = await listFiles('my-bucket');
files.forEach(file => {
  console.log(`${file.name} - ${file.size} bytes`);
});
```

### Download a File

```typescript
import { downloadFile } from './services/file.service';

await downloadFile('my-bucket', 'file.txt', './downloads/file.txt');
```

## Clean Up

To remove generated files and downloads:

```bash
npm run clean
```

This removes:
- `dist/` directory
- `../generated-files/` directory
- `../downloads/` directory

## Support

For issues or questions:
1. Check MinIO container logs: `docker logs minio`
2. Verify MinIO is accessible: http://localhost:9001
3. Check application logs for detailed error messages
