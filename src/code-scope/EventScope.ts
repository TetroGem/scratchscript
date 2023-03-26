import { SpriteAction } from "../code-action/SpriteAction";
import { ObjectValues } from "../types/ObjectValues";
import { CodeScope } from "./CodeScope";
import { v4 as uuidv4 } from 'uuid';
import { EventField } from "./EventField";
import { SpriteActions } from "../code-action/SpriteActions";
import { CodeSprite } from "../code-sprite/CodeSprite";

export const EventType = {
    OnFlag: 'event_whenflagclicked',
    OnClick: 'event_whenthisspriteclicked',
    OnKeyPress: 'event_whenkeypressed',
} as const;
export type EventType = ObjectValues<typeof EventType>;

export class EventScope extends CodeScope {
    readonly uuid = uuidv4();
    private actions: SpriteAction[] = [];

    constructor(
        private readonly sprite: CodeSprite,
        private readonly event: EventType,
        private readonly fields: readonly EventField[],
    ) {
        super();
    }

    override runCommand(line: string): void {
        const comps = line.split(' ');
        const command = comps[0];
        if(command === undefined) throw new Error(`Undefined command! (${line})`);

        if(command.startsWith('@')) {
            const actionName = command.substring(1);
            const args = comps.slice(1);
            const codeActions = SpriteActions.createActions(this.sprite, actionName, args);

            this.addActions(...codeActions);
        } else throw new Error(`Unknown command: ${command}! (${line})`);
    }

    toScratch(): string {
        const fieldsJSON = this.fields.map(field => field.toScratch()).join(',\n');

        const nextUUID = this.actions[0]?.uuid ?? null;
        const json = `
        "${this.uuid}": {
            "opcode": "${this.event}",
            "next": ${nextUUID === null ? null : `"${nextUUID}"`},
            "parent": null,
            "inputs": {},
            "fields": {
                ${fieldsJSON}
            },
            "shadow": false,
            "topLevel": true,
            "x": 0,
            "y": 0
        }
        `;

        const actionJSONs = this.actions.map((action, i, actions) => {
            const prevUUID = i === 0 ? this.uuid : actions[i - 1]?.uuid ?? null;
            const nextUUID = actions[i + 1]?.uuid ?? null;
            if(prevUUID === null) throw new Error('No UUID found for previous action!');
            return action.toScratch(prevUUID, nextUUID);
        }, json);

        return [json, ...actionJSONs].join(',\n');
    }

    addActions(...actions: SpriteAction[]): void {
        this.actions.push(...actions);
    }
}
