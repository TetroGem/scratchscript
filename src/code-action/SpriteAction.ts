import jsStringEscape from "js-string-escape";
import { CodeType } from "../code-types/CodeTypes";
import { ObjectValues } from "../types/ObjectValues";
import { v4 as uuidv4 } from 'uuid';

export const SpriteActionName = {
    Walk: 'motion_movesteps',
    Wait: 'control_wait',
    Turn: 'motion_turnleft',
    Say: 'looks_sayforsecs',
    GoTo: 'motion_gotoxy',
    Point: 'motion_pointindirection',
} as const;
export type SpriteActionName = ObjectValues<typeof SpriteActionName>;

export class ActionArgument {
    constructor(
        readonly name: string,
        readonly type: CodeType,
        readonly value: string,
    ) {}

    toScratch(): string {
        return `
        "${this.name}": [
            1,
            [
                ${this.type},
                "${this.value}"
            ]
        ]
        `;
    }
}

class TypeValidator {
    constructor(
        readonly name: string,
        readonly parse: (arg: string) => ActionArgument,
    ) {}
}

export const typeVals = {
    float: (argName: string) => {
        return new TypeValidator(argName, (arg: string): ActionArgument => {
            if(/-?[0-9]+(.[0-9]+)?/.exec(arg)?.[0] !== arg) throw new Error(`${arg} is not a Float!`);
            return new ActionArgument(argName, CodeType.Float, arg);
        });
    },
    posFloat: (argName: string) => {
        return new TypeValidator(argName, (arg: string): ActionArgument => {
            if(/[0-9]+(.[0-9]+)?/.exec(arg)?.[0] !== arg) throw new Error(`${arg} is not a PositiveFloat!`);
            return new ActionArgument(argName, CodeType.PositiveFloat, arg);
        });
    },
    string: (argName: string) => {
        return new TypeValidator(argName, (arg: string): ActionArgument => {
            if(/"(.*)"/.exec(arg)?.[0] !== arg) throw new Error(`${arg} is not a String!`);
            const str = decodeURIComponent(arg.substring(1, arg.length - 1));
            return new ActionArgument(argName, CodeType.PositiveFloat, str);
        });
    },
    angle: (argName: string) => {
        return new TypeValidator(argName, (arg: string): ActionArgument => {
            if(/-?[0-9]+(.[0-9]+)?/.exec(arg)?.[0] !== arg) throw new Error(`${arg} is not an Angle! (-360 to 360)`);
            const angle = parseFloat(arg);
            if(angle > 360 || angle < -360) throw new Error(`${arg} is not an Angle! (-360 to 360)`);
            const mappedAngle = String(angle > 180 ? -(360 - angle) : (angle < -180 ? -(-360 - angle) : angle));
            return new ActionArgument(argName, CodeType.Angle, mappedAngle);
        });
    },
} as const;

export const spriteActionArguments = {
    [SpriteActionName.Walk]: [typeVals.float("STEPS")],
    [SpriteActionName.Wait]: [typeVals.posFloat("DURATION")],
    [SpriteActionName.Turn]: [typeVals.float("DEGREES")],
    [SpriteActionName.Say]: [typeVals.string("MESSAGE"), typeVals.float("SECS")],
    [SpriteActionName.GoTo]: [typeVals.float("X"), typeVals.float("Y")],
    [SpriteActionName.Point]: [typeVals.angle("DIRECTION")],
} as const;

export class SpriteAction {
    readonly uuid = uuidv4();

    constructor(
        private readonly action: SpriteActionName,
        private readonly args: readonly ActionArgument[],
    ) {}

    toScratch(prevUUID: string, nextUUID: string | null): string {
        const argsJSON = this.args.map(arg => arg.toScratch()).join(',\n');

        return `
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
    }
}
