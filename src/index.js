import { Application, BaseTexture } from 'pixi.js';
import { Spine, AtlasAttachmentLoader, SkeletonJson } from '@pixi-spine/runtime-4.1';
import { TextureAtlas } from '@pixi-spine/base'; // FIX: Use TextureAtlas instead of SpineTextureAtlas
import listFile from '../output.json';

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);
resizeCanvas(app);

const allSpines = [];
const createdSpines = [];
const failedSpines = [];
const ignoreFile = [];

async function loadAssets(fileData, fileName) {
    return new Promise((resolve) => {
        app.loader
            .add(`spineCharacter_${fileName}`, fileData["json"])
            .add(`spineAtlas_${fileName}`, fileData["atlas"])
            .add(`spinePng_${fileName}`, fileData["image"])
            .load((loader, resources) => resolve(resources));
    });
}

async function createSpine(fileName, fileData) {
    try {
        const resources = await loadAssets(fileData, fileName);
        const spineAtlas = new TextureAtlas(resources[`spineAtlas_${fileName}`].data, (line, callback) => {
            callback(BaseTexture.from(resources[`spinePng_${fileName}`].url));
        });

        const spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
        const spineJsonParser = new SkeletonJson(spineAtlasLoader);
        const spineData = spineJsonParser.readSkeletonData(resources[`spineCharacter_${fileName}`].data);

        const spineCharacter = new Spine(spineData);
        spineCharacter.position.set(400, 300);
        spineCharacter.scale.set(0.5);
        
        createdSpines.push(fileName);

        const animName = Object.keys(resources[`spineCharacter_${fileName}`].data.animations)[0];
        spineCharacter.state.setAnimation(0, animName, true);
        
        app.stage.addChild(spineCharacter);
    } catch (error) {
        failedSpines.push(fileName);
        console.error(`Error loading spine asset ${fileName}:`, error);
    }
}

(async () => {
    for (const [fileName, fileData] of Object.entries(listFile)) {
        if (fileData["atlas"] && fileData["json"] && (fileData["image"])) {
            console.log("----------------------------------");
            allSpines.push(fileName);
            await createSpine(fileName, fileData);
        } else {
            ignoreFile.push(fileName);
        }
    }
    window.SpinesData = { allSpines, createdSpines, failedSpines, ignoreFile };
})();

window.addEventListener("resize", () => resizeCanvas(app));

function resizeCanvas(app) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
