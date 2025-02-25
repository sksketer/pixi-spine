// SpineCreator.js
import { BaseTexture } from 'pixi.js';
import { Spine, AtlasAttachmentLoader, SkeletonJson } from '@pixi-spine/runtime-4.1';
import { TextureAtlas } from '@pixi-spine/base';
import constants from './constants';

class SpineCreator {
    constructor(app) {
        this.app = app;
        this.createdSpines = [];
        this.failedSpines = [];
    }

    async loadAssetsFromInput(fileData, fileName) {
        // Now fileData is passed correctly as a Blob object (File)
        const resources = await this.readFileData(fileData);
        return resources;
    }

    readFileData(fileData) {
        return new Promise((resolve, reject) => {
            const fileReaders = {};  // Object to store the results of file reads

            // Function to read each file
            const readFile = (file, type) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    // Check if we're reading the atlas file
                    if (type === 'atlas') {
                        reader.onload = () => {
                            fileReaders[type] = reader.result; // This will be a string for atlas
                            resolve(reader.result);
                        };
                        reader.onerror = (error) => reject(error);
                        reader.readAsText(file); // Read as text for atlas file
                    } else if (type === 'image') {
                        reader.onload = () => {
                            fileReaders[type] = reader.result; // This will be a data URL
                            resolve(reader.result); // Resolve the data URL
                        };
                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(file); // Read image file as data URL
                    } else {
                        reader.onload = () => {
                            fileReaders[type] = reader.result;
                            resolve(reader.result);
                        };
                        reader.onerror = (error) => reject(error);
                        reader.readAsArrayBuffer(file); // Read as array buffer for other files
                    }
                });
            };

            // Read all files (JSON, Atlas, Image) and return a combined result
            const filePromises = [];
            if (fileData['json']) filePromises.push(readFile(fileData['json'], 'json'));
            if (fileData['atlas']) filePromises.push(readFile(fileData['atlas'], 'atlas'));
            if (fileData['image']) filePromises.push(readFile(fileData['image'], 'image'));

            Promise.all(filePromises).then(() => {
                resolve(fileReaders);
            }).catch(reject);
        });
    }

    async createSpine(fileName, fileData) {
        try {
            const resources = await this.loadAssetsFromInput(fileData, fileName);

            // Check if resources['json'] exists and has the expected structure
            const arrayBufferData = resources['json'];

            // Decode the ArrayBuffer to a string using TextDecoder
            const textDecoder = new TextDecoder();
            const jsonString = textDecoder.decode(arrayBufferData);

            // Parse the JSON string into a JavaScript object
            const jsonData = JSON.parse(jsonString);

            // Log the entire JSON data to debug the structure
            console.log('JSON data:', jsonData);

            if (!jsonData || !jsonData.animations) {
                throw new Error(`Invalid JSON structure or missing animations in ${fileName}`);
            }

            // Create the TextureAtlas with a valid URL for the image
            const spineAtlas = new TextureAtlas(resources['atlas'], (line, callback) => {
                // Create a temporary URL for the image and pass it to BaseTexture.from()
                const imageUrl = resources['image'];
                callback(BaseTexture.from(imageUrl)); // Use data URL here
            });

            const spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
            const spineJsonParser = new SkeletonJson(spineAtlasLoader);
            const spineData = spineJsonParser.readSkeletonData(jsonData);

            const spineCharacter = new Spine(spineData);
            spineCharacter.position.set(400, 300);
            spineCharacter.scale.set(0.5);

            this.createdSpines.push(fileName);

            // Safely access the first animation name if it exists
            const animName = Object.keys(jsonData.animations)[0];
            if (animName) {
                spineCharacter.state.setAnimation(0, animName, window.playAnimInLoop);
            } else {
                console.warn(`No animations found for ${fileName}`);
            }

            this.app.stage.addChild(spineCharacter);

            /** Dispatch a custom event when the spine is created */
            const event = new CustomEvent(constants.SPINE_CREATED, {
                detail: {
                    fileName: fileName,
                    spineCharacter: spineCharacter,
                    jsonData
                }
            });
            window.dispatchEvent(event);

        } catch (error) {
            this.failedSpines.push(fileName);
            console.error(`Error loading spine asset ${fileName}:`, error);
        }
    }
}

export default SpineCreator;
