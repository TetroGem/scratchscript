import { v4 as uuidv4 } from 'uuid';
import { EventScope } from "../code-scope/EventScope";
import { ConfigScope } from "../code-scope/ConfigScope";
import { CodeFile } from '../sprite-config/CodeFile';

export class CodeSprite {
    readonly uuid = uuidv4();
    private eventScopes: EventScope[] = [];
    private configScope: ConfigScope | null = null;

    constructor(
        readonly name: string,
    ) {}

    toScratch(sourceDir: string): { json: string, files: CodeFile[] } {
        if(this.configScope === null) throw new Error(`Sprite ${this.name} was never configured!`);

        const eventJSON = this.eventScopes.map(scope => scope.toScratch()).join(',\n');
        const { files, costumesJSON } = this.configScope.toScratch(sourceDir);

        const json = `
        {
            "isStage": false,
            "name": "${this.name}",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                ${eventJSON}
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                ${costumesJSON}
            ],
            "sounds": [
                {
                    "name": "Meow",
                    "assetId": "83c36d806dc92327b9e7049a565c6bff",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 48000,
                    "sampleCount": 40681,
                    "md5ext": "83c36d806dc92327b9e7049a565c6bff.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 0,
            "y": 0,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
        `;

        return { json, files };
    }

    addEvent(scope: EventScope): void {
        this.eventScopes.push(scope);
    }

    setConfig(scope: ConfigScope): void {
        if(this.configScope !== null) throw new Error(`Config for Sprite ${this.name} was already defined!`);
        this.configScope = scope;
    }
}
