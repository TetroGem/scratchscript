import { randomUUID } from "crypto";
import path from "path";

export class CodeFile {
    readonly relativeFilePath: string;
    readonly scratchName: string;
    readonly absoluteFilePath: string;
    readonly realName: string;
    readonly extension: string;
    readonly realNameNoExt: string;
    readonly scratchNameNoExt: string;

    constructor(sourceDir: string, filePath: string) {
        this.relativeFilePath = filePath;

        this.realName = path.basename(filePath);
        this.realNameNoExt = this.realName.split('.').slice(0, -1).join('.');
        this.extension = path.extname(filePath).substring(1);

        this.absoluteFilePath = path.resolve(sourceDir, filePath);

        this.scratchNameNoExt = randomUUID().replaceAll(/-/g, '');
        this.scratchName = this.scratchNameNoExt + '.' + this.extension;
    }
}
