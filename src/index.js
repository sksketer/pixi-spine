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
    const files = event.target.files;
    if (files.length >= 3) { // We need at least 3 files (JSON, Atlas, PNG)
        const fileData = await readFiles(files);
        const fileName = files[0].name.split('.')[0]; // We can use the file name without extension
        await spineCreator.createSpine(fileName, fileData);
    } else {
        alert("Please upload at least 3 files: JSON, Atlas, and PNG.");
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
        } else if (fileName.endsWith('.png')) {
            fileData['image'].push(file);  // Directly store the file object
        }
    }
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
