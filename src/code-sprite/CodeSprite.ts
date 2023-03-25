import { CodeScope } from "../code-scope/CodeScope";
import { v4 as uuidv4 } from 'uuid';

export class CodeSprite {
    readonly uuid = uuidv4();
    private scopes: CodeScope[] = [];

    constructor(
        readonly name: string,
    ) {}

    toScratch(): string {
        const scopeJSONs = this.scopes.map(scope => scope.toScratch());

        const json = `
        {
            "isStage": false,
            "name": "${this.name}",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                ${scopeJSONs.join(',\n')}
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "dataFormat": "svg",
                    "assetId": "bcf454acf82e4504149f7ffe07081dbc",
                    "md5ext": "bcf454acf82e4504149f7ffe07081dbc.svg",
                    "rotationCenterX": 48,
                    "rotationCenterY": 50
                },
                {
                    "name": "costume2",
                    "bitmapResolution": 1,
                    "dataFormat": "svg",
                    "assetId": "0fb9be3e8397c983338cb71dc84d0b25",
                    "md5ext": "0fb9be3e8397c983338cb71dc84d0b25.svg",
                    "rotationCenterX": 46,
                    "rotationCenterY": 53
                }
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

        return json;
    }

    addScope(scope: CodeScope): void {
        this.scopes.push(scope);
    }
}
