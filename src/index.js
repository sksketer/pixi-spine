import '../css/style.css'; 
import { Application } from 'pixi.js';
import SpineCreator from './SpineCreator';
import './loadComplete';

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});
globalThis.__PIXI_APP__ = app;

const canvas = document.getElementsByClassName('canvas')[0];
canvas.appendChild(app.view);
resizeCanvas(app);

// Initialize the SpineCreator
const spineCreator = new SpineCreator(app);

const fileInput = document.getElementById('spineFileInput');

fileInput.addEventListener('change', async (event) => {
    try {
        const files = event.target.files;
        if (files.length < 3) {
            throw new Error("Please upload at least 3 files: JSON, Atlas, and Image.");
        }

        const fileData = await readFiles(files);

        // Validate that all required files are present
        const missingFiles = Object.entries(fileData)
            .filter(([_, value]) => value === null)
            .map(([key]) => key);

        if (missingFiles.length > 0) {
            throw new Error(`Missing required file: ${missingFiles.join(', ')}`);
        }

        // Extract the base name without extension
        const fileName = Object.values(fileData)
            .find(file => file !== null)?.name.split('.').slice(0, -1).join('.');

        await spineCreator.createSpine(fileName, fileData);
    } catch (error) {
        alert(error.message);
    }
});

// Helper function to read files
async function readFiles(files) {
    const fileData = {
        "atlas": {},
        "json": {},
        "image": []
    };
    for (let file of files) {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.json')) {
            fileData['json'] = file;  // Directly store the file object
        } else if (fileName.endsWith('.atlas')) {
            fileData['atlas'] = file;  // Directly store the file object
        } else if (file.type.startsWith('image/')) {
            fileData['image'].push(file);  // Directly store the file object
        }
    }
    window.fd = fileData;
    return fileData;
}

window.addEventListener("resize", () => resizeCanvas(app));

function resizeCanvas(app) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

var checkbox = document.getElementById('agree');
window.playAnimInLoop = false;
checkbox.addEventListener('change', function() {
    window.playAnimInLoop = checkbox.checked;
});
