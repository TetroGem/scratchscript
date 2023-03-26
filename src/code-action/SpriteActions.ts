import { CodeSprite } from "../code-sprite/CodeSprite";
import { ActionArgument, SpriteAction, SpriteActionName, spriteActionArguments } from "./SpriteAction";

export namespace SpriteActions {
    export function verifyAction(action: string): SpriteActionName {
        switch(action) {
            case "walk": return SpriteActionName.Walk;
            case "wait": return SpriteActionName.Wait;
            case "turn": return SpriteActionName.Turn;
            case "say": return SpriteActionName.Say;
            case "goto": return SpriteActionName.GoTo;
            case "point": return SpriteActionName.Point;
            case "initialize": return SpriteActionName.Initialize;
            case "costume": return SpriteActionName.Costume;
            default: throw new Error(`Unknown Sprite action '${action}'!`);
        }
    }

    export function verifyArguments(
        sprite: CodeSprite,
        action: SpriteActionName,
        args: readonly string[],
    ): readonly ActionArgument[] {
        const argsQueue = args.slice();
        const spriteArgs: ActionArgument[] = [];
        const argTypeVals = spriteActionArguments[action];
        for(const typeVal of argTypeVals) {
            const arg = argsQueue.shift();
            if(arg === undefined) throw new Error(`No argument provided for ${typeVal.name} in ${action}!`);

            spriteArgs.push(typeVal.parse(sprite, arg));
        }

        return spriteArgs;
    }

    export function createActions(
        sprite: CodeSprite,
        action: string,
        args: readonly string[],
    ): readonly SpriteAction[] {
        const spriteAction = SpriteActions.verifyAction(action);
        const spriteArgs = SpriteActions.verifyArguments(sprite, spriteAction, args);

        switch(spriteAction) {
            case SpriteActionName.Initialize: {
                return [
                    ...createActions(sprite, "goto", ["0", "0"]),
                    ...createActions(sprite, "point", ["90"]),
                ];
            }
            default: return [new SpriteAction(spriteAction, spriteArgs)];
        }
    }
}
