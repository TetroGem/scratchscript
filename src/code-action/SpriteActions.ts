import { ActionArgument, SpriteActionName, spriteActionArguments } from "./SpriteAction";

export namespace SpriteActions {
    export function verifyAction(action: string): SpriteActionName {
        switch(action) {
            case "walk": return SpriteActionName.Walk;
            case "wait": return SpriteActionName.Wait;
            case "turn": return SpriteActionName.Turn;
            case "say": return SpriteActionName.Say;
            case "goto": return SpriteActionName.GoTo;
            case "point": return SpriteActionName.Point;
            default: throw new Error(`Unknown Sprite action '${action}!'`);
        }
    }

    export function verifyArguments(action: SpriteActionName, args: string[]): readonly ActionArgument[] {
        const spriteArgs: ActionArgument[] = [];
        const argTypeVals = spriteActionArguments[action];
        for(const typeVal of argTypeVals) {
            const arg = args.shift();
            if(arg === undefined) throw new Error(`No argument provided for ${typeVal.name} in ${action}!`);

            spriteArgs.push(typeVal.parse(arg));
        }

        return spriteArgs;
    }
}
