import { readdir, readFile, writeFile } from "fs/promises";
import { extname, join, basename, relative } from "path";

async function traverseDirectory(dir, result = {}) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            await traverseDirectory(fullPath, result);
        } else {
            const ext = extname(entry.name);
            if (ext === ".atlas") {
                await processAtlasFile(fullPath, result);
            }
        }
    }
    return result;
}

async function processAtlasFile(atlasPath, result) {
    try {
        const atlasContent = await readFile(atlasPath, "utf-8");
        const lines = atlasContent.split("\n");
        let imageName = "";
        
        for (const line of lines) {
            if (line.trim() && !line.includes(":")) {
                imageName = line.trim();
                break;
            }
        }
        
        const atlasKey = basename(atlasPath, ".atlas");
        const jsonPath = join(atlasPath, "../", `${atlasKey}.json`);
        const imagePath = imageName ? join(atlasPath, "../", imageName) : "Unknown";
        
        const removeBasePath = join(process.cwd(), "src");
        
        result[atlasKey] = {
            "image": relative(removeBasePath, imagePath),
            "atlas": relative(removeBasePath, atlasPath),
            "json": relative(removeBasePath, jsonPath)
        };
    } catch (error) {
        console.error("Error processing atlas file:", error);
    }
}

(async () => {
    const baseDir = join(process.cwd(), "src", "assets", "Spine"); // Set target directory
    try {
        const result = await traverseDirectory(baseDir);
        console.log(result);
        await writeFile("output.json", JSON.stringify(result, null, 2));
        console.log("Output saved to output.json");
    } catch (error) {
        console.error("Error traversing directory:", error);
    }
})();