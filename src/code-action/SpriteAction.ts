import { CodeType } from "../code-types/CodeTypes";
import { ObjectValues } from "../types/ObjectValues";
import { v4 as uuidv4 } from 'uuid';
import { CodeSprite } from "../code-sprite/CodeSprite";
import { randomUUID } from "crypto";

type FieldInfo = [fieldOpcode: string, fieldName: string];

export const SpriteActionName = {
    Walk: 'motion_movesteps',
    Wait: 'control_wait',
    Turn: 'motion_turnleft',
    Say: 'looks_sayforsecs',
    GoTo: 'motion_gotoxy',
    Point: 'motion_pointindirection',
    Initialize: 'scs_initialize',
    Costume: 'looks_switchcostumeto',
} as const;
export type SpriteActionName = ObjectValues<typeof SpriteActionName>;

export class ActionArgument {
    private readonly fieldUUID = randomUUID();

    constructor(
        readonly name: string,
        readonly type: CodeType,
        readonly value: string,
        readonly fieldInfo?: FieldInfo,
    ) {}

    toScratch(): { argJSON: string, createFieldJSON: (actionUUID: string) => string | null } {
        const argJSON = `
        "${this.name}": [
            1,
            ${
                this.fieldInfo
                    ? `"${this.fieldUUID}"`
                    : `
                        [
                            ${this.type},
                            "${this.value}"
                        ]
                    `
            }
        ]
        `;

        const createFieldJSON = this.fieldToScratch();

        return { argJSON, createFieldJSON };
    }

    fieldToScratch(): (actionUUID: string) => string | null {
        if(!this.fieldInfo) return () => null;

        const [fieldOpcode, fieldName] = this.fieldInfo;

        return (actionUUID) => `
        "${this.fieldUUID}": {
            "opcode": "${fieldOpcode}",
            "next": null,
            "parent": "${actionUUID}",
            "inputs": {},
            "fields": {
                "${fieldName}": [
                    "${this.value}",
                    null
                ]
            },
            "shadow": true,
            "topLevel": false
        }
        `;
    }
}

class TypeValidator {
    constructor(
        readonly name: string,
        readonly parse: (sprite: CodeSprite, arg: string) => ActionArgument,
    ) {}
}

export const typeEvals = {
    float: (value: string): string => {
        if(/-?[0-9]+(.[0-9]+)?/.exec(value)?.[0] !== value) throw new Error(`${value} is not a Float!`);
        return value;
    },
    posFloat: (value: string): string => {
        if(/[0-9]+(.[0-9]+)?/.exec(value)?.[0] !== value) throw new Error(`${value} is not a PositiveFloat!`);
        return value;
    },
    string: (value: string): string => {
        if(/"(.*)"/.exec(value)?.[0] !== value) throw new Error(`${value} is not a String!`);
        return decodeURIComponent(value.substring(1, value.length - 1));
    },
    angle: (value: string): string => {
        if(/-?[0-9]+(.[0-9]+)?/.exec(value)?.[0] !== value) throw new Error(`${value} is not an Angle! (-360 to 360)`);
        const angle = parseFloat(value);
        if(angle > 360 || angle < -360) throw new Error(`${value} is not an Angle! (-360 to 360)`);
        return String(angle > 180 ? -(360 - angle) : (angle < -180 ? -(-360 - angle) : angle));
    },
    costume: (sprite: CodeSprite, value: string): string => {
        if(/[a-zA-Z0-9]+/.exec(value)?.[0] !== value) throw new Error(`${value} is not a valid Costume name!`);

        const costume = sprite.getCostume(value);
        if(costume === undefined) {
            throw new Error(`Sprite '${sprite.name}' does not have a Costume named '${value}!'`);
        }

        return costume.name;
    },
} as const;

export const argEvals = {
    float: (argName: string) => {
        return new TypeValidator(argName, (sprite, arg) => {
            const float = typeEvals.float(arg);
            return new ActionArgument(argName, CodeType.Float, float);
        });
    },
    posFloat: (argName: string) => {
        return new TypeValidator(argName, (sprite, arg) => {
            const posFloat = typeEvals.posFloat(arg);
            return new ActionArgument(argName, CodeType.PositiveFloat, posFloat);
        });
    },
    string: (argName: string) => {
        return new TypeValidator(argName, (sprite, arg) => {
            const str = typeEvals.string(arg);
            return new ActionArgument(argName, CodeType.PositiveFloat, str);
        });
    },
    angle: (argName: string) => {
        return new TypeValidator(argName, (sprite, arg) => {
            const angle = typeEvals.angle(arg);
            return new ActionArgument(argName, CodeType.Angle, angle);
        });
    },
    costume: (argName: string, fieldInfo: FieldInfo) => {
        return new TypeValidator(argName, (sprite, arg) => {
            if(!arg.startsWith('@')) throw new Error(`'${arg}' is not a property of Sprite '${sprite.name}'!`);
            const costume = typeEvals.costume(sprite, arg.substring(1));
            return new ActionArgument(argName, CodeType.Field, costume, fieldInfo);
        });
    },
} as const;

export const spriteActionArguments = {
    [SpriteActionName.Walk]: [argEvals.float("STEPS")],
    [SpriteActionName.Wait]: [argEvals.posFloat("DURATION")],
    [SpriteActionName.Turn]: [argEvals.float("DEGREES")],
    [SpriteActionName.Say]: [argEvals.string("MESSAGE"), argEvals.float("SECS")],
    [SpriteActionName.GoTo]: [argEvals.float("X"), argEvals.float("Y")],
    [SpriteActionName.Point]: [argEvals.angle("DIRECTION")],
    [SpriteActionName.Initialize]: [],
    [SpriteActionName.Costume]: [argEvals.costume("COSTUME", ['looks_costume', "COSTUME"])],
} as const;

export class SpriteAction {
    readonly uuid = uuidv4();

    constructor(
        private readonly action: SpriteActionName,
        private readonly args: readonly ActionArgument[],
    ) {}

    toScratch(prevUUID: string, nextUUID: string | null): string {
        const argJSONs: string[] = [];
        const fieldJSONs: string[] = [];
        for(const arg of this.args) {
            const { argJSON, createFieldJSON } = arg.toScratch();
            argJSONs.push(argJSON);
            const fieldJSON = createFieldJSON(this.uuid);
            if(fieldJSON !== null) fieldJSONs.push(fieldJSON);
        }

        const argsJSON = argJSONs.join(',\n');

        const actionJSON = `
        "${this.uuid}": {
            "opcode": "${this.action}",
            "next": ${nextUUID === null ? null : `"${nextUUID}"`},
            "parent": "${prevUUID}",
            "inputs": {
                ${argsJSON}
            },
            "fields": {},
            "shadow": false,
            "topLevel": false,
            "x": 0,
            "y": 0
        }
        `;

        return [actionJSON, ...fieldJSONs].join(',\n');
    }
}
