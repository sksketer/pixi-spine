import { Application, BaseTexture } from 'pixi.js';
import { Spine, AtlasAttachmentLoader, SkeletonJson } from '@pixi-spine/runtime-4.1';
import { TextureAtlas } from '@pixi-spine/base';  // FIX: Use TextureAtlas instead of SpineTextureAtlas

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb
});
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);
resizeCanvas.call(this, app);

const _path = "./assets/";
const filePath = "Spine/featureSpine/landscape/";
const fileName = "Pick_Your_Receiver_Desktop";


app.loader
    .add("spineCharacter", `${_path}${filePath}${fileName}.json`)
    .add("spineAtlas", `${_path}${filePath}${fileName}.atlas`)
    .add("spinePng", `${_path}${filePath}${fileName}.png`)
    .add("spinePng2", `${_path}${filePath}${fileName}_2.png`)
    .load(onAssetsLoaded);

function onAssetsLoaded(loader, resources) {
    const spineAtlas = new TextureAtlas(resources.spineAtlas.data, (line, callback) => {
        callback(BaseTexture.from(resources.spinePng.url));
    });

    const spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
    const spineJsonParser = new SkeletonJson(spineAtlasLoader);
    const spineData = spineJsonParser.readSkeletonData(resources.spineCharacter.data);

    const spineCharacter = new Spine(spineData);
    spineCharacter.position.set(400, 300);
    spineCharacter.scale.set(0.5);

    const animName = Object.keys(resources.spineCharacter.data.animations)[0];

    // Play Animation
    spineCharacter.state.setAnimation(0, animName, true); // Replace with your actual animation

    // Add to Stage
    app.stage.addChild(spineCharacter);    
}

window.addEventListener("resize", resizeCanvas.bind(this, app));

function resizeCanvas(app) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
