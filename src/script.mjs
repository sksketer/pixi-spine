import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// Get the root directory where the script is executed
const targetDir = process.cwd();
const spineDir = join(targetDir, 'src', 'assets', 'Spine'); // Use cross-platform path
// const spineDir = join(targetDir, 'assets', 'Spine'); // Use cross-platform path
const outputFile = join(targetDir, 'output.json');

let filesList = [];

// Recursive function to traverse directories safely
function traverseDirectory(dir) {
    if (!existsSync(dir)) {
        console.warn(`Warning: Directory not found - ${dir}`);
        return;
    }

    readdirSync(dir).forEach(file => {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else {
            const basePath = `${targetDir}\\src\\`;
            const data = {
                filePath:  fullPath.replace(basePath, "").replace(file, ""),  // Store only the directory path
                fileName: file
            };
            filesList.push(data)//data.filePath.replace(/\\/g, "/"));
            console.log(data);
        }
    });
}

// Start traversal
traverseDirectory(spineDir);

// Save data to JSON file
writeFileSync(outputFile, JSON.stringify(filesList, null, 2), 'utf8');

console.log(`File list saved to ${outputFile}`);
