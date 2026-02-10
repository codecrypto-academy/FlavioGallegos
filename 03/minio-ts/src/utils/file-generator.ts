/**
 * File Generator Utility
 * 
 * Generates test files of various types (TXT, JSON, CSV, XML, Markdown)
 * for testing MinIO upload functionality
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';
import { FileGenerationOptions } from '../types';

/**
 * Generate random text content
 */
function generateRandomText(paragraphs: number = 3): string {
    const sentences = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        'Nulla pariatur deserunt mollit anim id est laborum.',
        'Curabitur pretium tincidunt lacus nunc pulvinar sapien et ligula.',
        'Vestibulum tortor quam feugiat vitae ultricies eget tempor sit amet.',
        'Mauris blandit aliquet elit eget tincidunt nibh pulvinar a proin.',
        'Pellentesque habitant morbi tristique senectus et netus et malesuada.'
    ];

    let text = '';
    for (let i = 0; i < paragraphs; i++) {
        const numSentences = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < numSentences; j++) {
            text += sentences[Math.floor(Math.random() * sentences.length)] + ' ';
        }
        text += '\n\n';
    }

    return text.trim();
}

/**
 * Generate random person data
 */
function generateRandomPerson() {
    const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'José', 'Isabel', 'Miguel', 'Laura'];
    const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez'];
    const cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma'];

    return {
        id: Math.floor(Math.random() * 10000),
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        age: Math.floor(Math.random() * 50) + 20,
        city: cities[Math.floor(Math.random() * cities.length)],
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        active: Math.random() > 0.5,
        createdAt: new Date().toISOString()
    };
}

/**
 * Generate text files
 */
export async function generateTextFiles(options: FileGenerationOptions): Promise<string[]> {
    const { count, outputDir, prefix = 'text' } = options;
    const files: string[] = [];

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 1; i <= count; i++) {
        const fileName = `${prefix}_${i}_${Date.now()}.txt`;
        const filePath = path.join(outputDir, fileName);
        const content = `Text File #${i}\n\nGenerated at: ${new Date().toISOString()}\n\n${generateRandomText(5)}`;

        fs.writeFileSync(filePath, content, 'utf-8');
        files.push(filePath);
    }

    Logger.success(`Generated ${count} text files`);
    return files;
}

/**
 * Generate JSON files
 */
export async function generateJsonFiles(options: FileGenerationOptions): Promise<string[]> {
    const { count, outputDir, prefix = 'data' } = options;
    const files: string[] = [];

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 1; i <= count; i++) {
        const fileName = `${prefix}_${i}_${Date.now()}.json`;
        const filePath = path.join(outputDir, fileName);

        const data = {
            id: i,
            timestamp: new Date().toISOString(),
            type: 'test-data',
            person: generateRandomPerson(),
            metadata: {
                version: '1.0',
                generated: true,
                index: i
            }
        };

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        files.push(filePath);
    }

    Logger.success(`Generated ${count} JSON files`);
    return files;
}

/**
 * Generate CSV files
 */
export async function generateCsvFiles(options: FileGenerationOptions): Promise<string[]> {
    const { count, outputDir, prefix = 'data' } = options;
    const files: string[] = [];

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 1; i <= count; i++) {
        const fileName = `${prefix}_${i}_${Date.now()}.csv`;
        const filePath = path.join(outputDir, fileName);

        let csv = 'ID,FirstName,LastName,Age,City,Email,Active\n';

        const numRows = Math.floor(Math.random() * 20) + 10;
        for (let j = 0; j < numRows; j++) {
            const person = generateRandomPerson();
            csv += `${person.id},${person.firstName},${person.lastName},${person.age},${person.city},${person.email},${person.active}\n`;
        }

        fs.writeFileSync(filePath, csv, 'utf-8');
        files.push(filePath);
    }

    Logger.success(`Generated ${count} CSV files`);
    return files;
}

/**
 * Generate XML files
 */
export async function generateXmlFiles(options: FileGenerationOptions): Promise<string[]> {
    const { count, outputDir, prefix = 'document' } = options;
    const files: string[] = [];

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 1; i <= count; i++) {
        const fileName = `${prefix}_${i}_${Date.now()}.xml`;
        const filePath = path.join(outputDir, fileName);

        const person = generateRandomPerson();
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <metadata>
    <id>${i}</id>
    <timestamp>${new Date().toISOString()}</timestamp>
    <type>test-document</type>
  </metadata>
  <person>
    <id>${person.id}</id>
    <firstName>${person.firstName}</firstName>
    <lastName>${person.lastName}</lastName>
    <age>${person.age}</age>
    <city>${person.city}</city>
    <email>${person.email}</email>
    <active>${person.active}</active>
  </person>
  <content>
    <text>${generateRandomText(2)}</text>
  </content>
</document>`;

        fs.writeFileSync(filePath, xml, 'utf-8');
        files.push(filePath);
    }

    Logger.success(`Generated ${count} XML files`);
    return files;
}

/**
 * Generate Markdown files
 */
export async function generateMarkdownFiles(options: FileGenerationOptions): Promise<string[]> {
    const { count, outputDir, prefix = 'doc' } = options;
    const files: string[] = [];

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 1; i <= count; i++) {
        const fileName = `${prefix}_${i}_${Date.now()}.md`;
        const filePath = path.join(outputDir, fileName);

        const markdown = `# Document ${i}

**Generated:** ${new Date().toISOString()}

## Introduction

${generateRandomText(2)}

## Details

- **ID:** ${i}
- **Type:** Test Document
- **Format:** Markdown

## Content

${generateRandomText(3)}

## Conclusion

This is a test markdown document generated automatically for MinIO testing purposes.

---

*End of document*
`;

        fs.writeFileSync(filePath, markdown, 'utf-8');
        files.push(filePath);
    }

    Logger.success(`Generated ${count} Markdown files`);
    return files;
}

/**
 * Generate all files (100 total)
 * Distribution: 25 TXT, 25 JSON, 20 CSV, 15 XML, 15 MD
 */
export async function generateAllFiles(outputDir: string): Promise<{
    textFiles: string[];
    jsonFiles: string[];
    csvFiles: string[];
    xmlFiles: string[];
    markdownFiles: string[];
}> {
    Logger.header('Generating Test Files');

    const textFiles = await generateTextFiles({ count: 25, outputDir });
    const jsonFiles = await generateJsonFiles({ count: 25, outputDir });
    const csvFiles = await generateCsvFiles({ count: 20, outputDir });
    const xmlFiles = await generateXmlFiles({ count: 15, outputDir });
    const markdownFiles = await generateMarkdownFiles({ count: 15, outputDir });

    const total = textFiles.length + jsonFiles.length + csvFiles.length + xmlFiles.length + markdownFiles.length;
    Logger.success(`Generated ${total} files total`);

    return {
        textFiles,
        jsonFiles,
        csvFiles,
        xmlFiles,
        markdownFiles
    };
}
