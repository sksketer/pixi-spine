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

app.loader
    .add("spineCharacter", "./assets/1/Win_Label.json")
    .add("spineAtlas", "./assets/1/Win_Label.atlas")
    .add("spinePng", "./assets/1/Win_Label.png")
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

    // Play Animation
    spineCharacter.state.setAnimation(0, 'Win_Label_Outro', true); // Replace with your actual animation

    // Add to Stage
    app.stage.addChild(spineCharacter);    
}

window.addEventListener("resize", resizeCanvas.bind(this, app));

function resizeCanvas(app) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
