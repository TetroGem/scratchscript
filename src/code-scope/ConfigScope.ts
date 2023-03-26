import { argEvals, typeEvals } from "../code-action/SpriteAction";
import { CodeFile } from "../sprite-config/CodeFile";
import { SpriteCostume } from "../sprite-config/SpriteCostume";
import { CodeScope } from "./CodeScope";

export class ConfigScope extends CodeScope {
    private readonly costumes = new Map<string, SpriteCostume>();

    getCostume(name: string): SpriteCostume | undefined {
        return this.costumes.get(name);
    }

    override runCommand(line: string): void {
        const comps = line.split(' ');
        const command = comps[0];
        if(command === undefined) throw new Error(`No command defined! (${line})`);

        const args = comps.slice(1);

        switch(command) {
            case "Costume": {
                const [name, path] = args;
                if(name === undefined) throw new Error(`No name for Costume specified! (${line})`);
                if(path === undefined) throw new Error(`No path for Costume specified! (${line})`);

                const stringPath = typeEvals.string(path);
                const costume = new SpriteCostume(name, stringPath);
                this.costumes.set(name, costume);

                break;
            }
            default: throw new Error(`Unknown command '${command}'! (${line})`);
        }
    }

    override toScratch(sourceDir: string): { files: CodeFile[], costumesJSON: string } {
        const jsons: string[] = [];
        const files: CodeFile[] = [];
        for(const costume of this.costumes.values()) {
            const { json, file } = costume.toScratch(sourceDir);
            jsons.push(json);
            files.push(file);
        }

        const costumesJSON = jsons.join(',\n');

        return { files, costumesJSON };
    }
}
