import { Instruction, InstructionType, CodeParser } from "./CodeParser";
import { SpriteActions } from "./code-action/SpriteActions";
import { CodeScope } from "./code-scope/CodeScope";
import { ConfigScope } from "./code-scope/ConfigScope";
import { EventField } from "./code-scope/EventField";
import { EventFields } from "./code-scope/EventFields";
import { EventScope, EventType } from "./code-scope/EventScope";
import { CodeSprite } from "./code-sprite/CodeSprite";
import { CodeFile } from "./sprite-config/CodeFile";

export class CodeRunner {
    private scope: CodeScope | null = null;
    private readonly sprites = new Map<string, CodeSprite>();

    run(code: string) {
        let unparsedCode: string | null = code;
        while(unparsedCode !== null) {
            const { nextInstruction, restCode } = CodeParser.nextSection(unparsedCode);
            console.log(nextInstruction);
            unparsedCode = restCode;

            this.runInstruction(nextInstruction);
        }
    }

    toScratch(sourceDir: string): { json: string, files: CodeFile[] } {
        const sprites = [...this.sprites.values()];
        const spriteJSONs: string[] = [];
        const spriteFiles: CodeFile[] = [];
        for(const sprite of sprites) {
            const { json, files } = sprite.toScratch(sourceDir);
            spriteJSONs.push(json);
            spriteFiles.push(...files);
        }

        const spritesJSON = spriteJSONs.join(',\n');
        return {
            json: spritesJSON,
            files: spriteFiles,
        };
    }

    private exitScope(): void {
        if(this.scope === null) throw new Error(`Cannot exit scope, not currently in one!`);
        this.scope = null;
    }

    private runInstruction(line: Instruction): void {
        const { type, code } = line;
        const comps = code.split(' ');

        switch(type) {
            case InstructionType.Command: {
                if(this.scope === null) throw new Error(`Cannot run commands outside of a scope! (${code})`);
                this.scope.runCommand(code);
                break;
            }

            case InstructionType.OpenBlock: {
                const header = comps[0];
                if(header === undefined) throw new Error(`No header given for block! (${code})`);

                const [eventSection, fieldsSection] = header.split(':');
                if(eventSection === undefined) throw new Error(`No event in header! ${code}`);

                if(header === "Sprite") {
                    const spriteName = comps[1];
                    if(spriteName === undefined) throw new Error(`Sprite name is undefined! (${code})`);

                    if(this.sprites.has(spriteName)) {
                        throw new Error(`Sprite with name ${spriteName} already exists! (${code})`);
                    }

                    const scope = new ConfigScope();
                    this.scope = scope;

                    const sprite = new CodeSprite(spriteName);
                    sprite.setConfig(scope);
                    this.sprites.set(spriteName, sprite);
                } else {
                    const [spriteName, event] = eventSection.split('.');
                    if(spriteName === undefined) throw new Error(`No sprite at start of block open! (${code})`);

                    const sprite = this.sprites.get(spriteName);
                    if(sprite === undefined) throw new Error(`Sprite '${spriteName} does not exist! (${code})`);

                    const eventType: EventType = (() => {
                        switch(event) {
                            case "onFlag": return EventType.OnFlag;
                            case "onClick": return EventType.OnClick;
                            case "onKeyPress": return EventType.OnKeyPress;
                            default: throw new Error(`Invalid event type '${event}' of Sprite! (${code})`);
                        }
                    })();

                    const fields = fieldsSection?.split(' ') ?? [];
                    const eventFields = EventFields.createFields(eventType, fields);

                    const scope = new EventScope(eventType, eventFields);
                    this.scope = scope;
                    sprite.addEvent(scope);
                }
                break;
            }

            case InstructionType.CloseBlock: {
                this.exitScope();
                break;
            }
        }
    }
}
