import { Instruction, InstructionType, CodeParser } from "./CodeParser";
import { SpriteActions } from "./code-action/SpriteActions";
import { EventField } from "./code-scope/EventField";
import { EventFields } from "./code-scope/EventFields";
import { EventScope, EventType } from "./code-scope/EventScope";
import { CodeSprite } from "./code-sprite/CodeSprite";

export class CodeRunner {
    private scope: EventScope | null = null;
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

    toScratch(): string {
        const json = [...this.sprites.values()].map(sprite => sprite.toScratch()).join(',\n');
        return json;
    }

    private enterScope(sprite: CodeSprite, event: EventType, fields: readonly EventField[]): void {
        const scope = new EventScope(event, fields);
        sprite.addScope(scope);
        this.scope = scope;
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
                const command = comps[0];
                if(command === undefined) throw new Error(`No command specified! (${code})`);

                if(command.startsWith('@')) {
                    const actionName = command.substring(1);
                    const args = comps.slice(1);
                    const codeActions = SpriteActions.createActions(actionName, args);

                    if(this.scope === null) throw new Error('Cannot access action outside of a Sprite\'s event scope!');
                    this.scope.addActions(...codeActions);
                } else if(command === "Sprite") {
                    const spriteName = comps[1];
                    if(spriteName === undefined) throw new Error(`Sprite must be given a name! (${code})`);

                    const sprite = new CodeSprite(spriteName);
                    this.sprites.set(spriteName, sprite);
                } else {
                    throw new Error(`Unknown command: ${command}! (${code})`);
                }
                break;
            }

            case InstructionType.OpenBlock: {
                const header = comps[0];
                if(header === undefined) throw new Error(`No header given for block! (${code})`);

                const [eventSection, fieldsSection] = header.split(':');
                if(eventSection === undefined) throw new Error(`No event in header! ${code}`);

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

                this.enterScope(sprite, eventType, eventFields);
                break;
            }

            case InstructionType.CloseBlock: {
                this.exitScope();
                break;
            }
        }
    }
}
