import path from "path";
import sizeOf from 'image-size';
import { CodeFile } from "./CodeFile";

export class SpriteCostume {
    // readonly uuid = randomUUID();

    constructor(
        private readonly name: string,
        private readonly path: string,
    ) {}

    toScratch(sourceDir: string): { json: string, file: CodeFile } {
        const file = new CodeFile(sourceDir, this.path);
        const imageSize = sizeOf(file.absoluteFilePath);

        const json = `
        {
            "name": "${this.name}",
            "bitmapResolution": ${file.extension === 'svg' ? 1 : 2},
            "dataFormat": "${file.extension}",
            "assetId": "${file.scratchNameNoExt}",
            "md5ext": "${file.scratchName}",
            "rotationCenterX": ${(imageSize.width ?? 0) / 2},
            "rotationCenterY": ${(imageSize.height ?? 0) / 2}
        }
        `;

        return { json, file };
    }
}
