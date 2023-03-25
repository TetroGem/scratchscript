/* eslint-disable max-len */
import fs from 'fs/promises';
import path from 'path';
import { CodeRunner } from './CodeRunner';
import { CodeParser } from './CodeParser';
import AdmZip from 'adm-zip';

async function main() {
    const inputArg = process.argv[2];
    if(inputArg === undefined) throw new Error('No input file given!');
    if(!inputArg.endsWith('.scs')) throw new Error('Input file is not a ScratchScript (.scs) file!');

    const inputScriptPath = path.resolve(inputArg);
    const filename = path.basename(inputScriptPath).split('.').slice(0, -1).join('.');

    const outputArg = process.argv[3] ?? path.dirname(inputScriptPath);
    const outputProjectPath = path.extname(outputArg) === ''
        ? path.resolve(outputArg, `${filename}.sb3`)
        : (path.extname(outputArg) === '.sb3' ? outputArg : null)
        ;

    if(outputProjectPath === null) throw new Error(`Invalid output path! (${outputArg}) Must be a '.sb3' file!`);
    console.log(outputProjectPath);

    const code = await fs.readFile(inputScriptPath, 'utf-8');
    console.log(code);
    const cleaned = CodeParser.clean(code);
    console.log(cleaned);

    const runner = new CodeRunner();
    runner.run(cleaned);
    const compiledJSON = temporaryStageWrapper(runner.toScratch());
    const minifiedJSON = JSON.stringify(JSON.parse(compiledJSON));

    const zip = new AdmZip();
    zip.addFile('project.json', Buffer.from(minifiedJSON, 'utf-8'));
    zip.addLocalFile(path.resolve(__dirname, '../res/0fb9be3e8397c983338cb71dc84d0b25.svg'));
    zip.addLocalFile(path.resolve(__dirname, '../res/83a9787d4cb6f3b7632b4ddfebf74367.wav'));
    zip.addLocalFile(path.resolve(__dirname, '../res/83c36d806dc92327b9e7049a565c6bff.wav'));
    zip.addLocalFile(path.resolve(__dirname, '../res/bcf454acf82e4504149f7ffe07081dbc.svg'));
    zip.addLocalFile(path.resolve(__dirname, '../res/cd21514d0531fdffb22204e0ec5ed84a.svg'));
    await zip.writeZipPromise(outputProjectPath);

    console.log("Done!");
}

function temporaryStageWrapper(spritesJSON: string) {
    return `
    {
        "targets": [
            {
                "isStage": true,
                "name": "Stage",
                "variables": {
                    "jEk@4|i[#Fk?(8x)AV.-my variable": [
                        "my variable",
                        0
                    ]
                },
                "lists": {},
                "broadcasts": {},
                "blocks": {},
                "comments": {},
                "currentCostume": 0,
                "costumes": [
                    {
                        "name": "backdrop1",
                        "dataFormat": "svg",
                        "assetId": "cd21514d0531fdffb22204e0ec5ed84a",
                        "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg",
                        "rotationCenterX": 240,
                        "rotationCenterY": 180
                    }
                ],
                "sounds": [
                    {
                        "name": "pop",
                        "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                        "dataFormat": "wav",
                        "format": "",
                        "rate": 48000,
                        "sampleCount": 1123,
                        "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                    }
                ],
                "volume": 100,
                "layerOrder": 0,
                "tempo": 60,
                "videoTransparency": 50,
                "videoState": "on",
                "textToSpeechLanguage": null
            },
            ${spritesJSON}
        ],
        "monitors": [],
        "extensions": [],
        "meta": {
            "semver": "3.0.0",
            "vm": "1.4.6",
            "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
        }
    }
    `;
}

main();
