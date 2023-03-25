import { SpriteAction } from "../code-action/SpriteAction";
import { ObjectValues } from "../types/ObjectValues";
import { CodeScope } from "./CodeScope";
import { v4 as uuidv4 } from 'uuid';

export const EventType = {
    OnFlag: 'event_whenflagclicked',
    OnClick: 'event_whenthisspriteclicked',
} as const;
export type EventType = ObjectValues<typeof EventType>;

export class EventScope extends CodeScope {
    readonly uuid = uuidv4();
    private actions: SpriteAction[] = [];

    constructor(
        private readonly event: EventType,
    ) {
        super();
    }

    toScratch(): string {
        const nextUUID = this.actions[0]?.uuid ?? null;
        const json = `
        "${this.uuid}": {
            "opcode": "${this.event}",
            "next": ${nextUUID === null ? null : `"${nextUUID}"`},
            "parent": null,
            "inputs": {},
            "fields": {},
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
