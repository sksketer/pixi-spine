import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, relative, extname, basename } from 'path';

// Define important paths
const projectRoot = process.cwd(); // Root directory where the script runs
const spineDir = join(projectRoot, 'src', 'assets', 'Spine'); // Target directory
const outputFile = join(projectRoot, 'output.json');

let filesData = {}; // Store data as { commonFileName: { ext: filePath } }

// Recursive function to traverse directories safely
function traverseDirectory(dir, baseDir) {
    if (!existsSync(dir)) {
        console.warn(`Warning: Directory not found - ${dir}`);
        return;
    }

    readdirSync(dir).forEach(file => {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            traverseDirectory(fullPath, baseDir);
        } else {
            const ext = extname(file).substring(1); // Get file extension (without ".")
            const commonName = basename(file, extname(file)); // Get file name without extension
            const relativePath = relative(baseDir, fullPath).replace(/\\/g, "/"); // Normalize path

            if (!filesData[commonName]) {
                filesData[commonName] = {};
            }

            filesData[commonName][ext] = relativePath; // Store as { ext: filePath }
        }
    });
}

// Start traversal
traverseDirectory(spineDir, join(projectRoot, 'src'));

// Save data to JSON file
writeFileSync(outputFile, JSON.stringify(filesData, null, 2), 'utf8');

console.log(`File list saved to ${outputFile}`);
