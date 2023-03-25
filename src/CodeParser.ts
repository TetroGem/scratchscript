import { ObjectValues } from "./types/ObjectValues";

export const InstructionType = {
    Command: 'command',
    OpenBlock: 'openBlock',
    CloseBlock: 'closeBlock',
    OpenExpression: 'openExpression',
    CloseExpression: 'closeExpression',
} as const;
export type InstructionType = ObjectValues<typeof InstructionType>;

export type Instruction = {
    type: InstructionType,
    code: string,
};

const breakCharacters = {
    ';': InstructionType.Command,
    '{': InstructionType.OpenBlock,
    '}': InstructionType.CloseBlock,
    '(': InstructionType.OpenExpression,
    ')': InstructionType.CloseExpression,
} as const;

export namespace CodeParser {
    export function clean(code: string): string {
        return code
            // remove all comments
            .split('\n').map(line => line.split('#')[0]).join('\n')
            // encode all strings
            .replaceAll(/"(.*)"/g, str => `"${encodeURIComponent(str.substring(1, str.length - 1))}"`)
            // convert all whitespace to just a single space
            .replaceAll(/\s+/g, ' ')
            // remove all whitespace with a symbol on its left
            .replaceAll(/[^\w-"]+\s+/g, str => str.replaceAll(/\s+/g, ''))
            // remove all whitespace with a symbol on its right
            .replaceAll(/\s+[^\w-"]+/g, str => str.replaceAll(/\s+/g, ''))
            ;
    }

    export function nextSection(code: string): { nextInstruction: Instruction, restCode: string | null } {
        const breakInfo = (() => {
            let breakInfo: [number, InstructionType] | null = null;
            for(const [char, type] of Object.entries(breakCharacters)) {
                const index = code.indexOf(char);
                if(index !== -1 && (!breakInfo || index < breakInfo[0])) {
                    breakInfo = [index, type];
                }
            }
            return breakInfo;
        })();

        if(breakInfo === null) throw new Error(`No break character found at end of line! (Found: ${code})`);

        const [breakIndex, breakType] = breakInfo;
        const nextInstruction = {
            type: breakType,
            code: code.slice(0, breakIndex),
        };
        const restCode = breakIndex + 1 >= code.length ? null : code.slice(breakIndex + 1);
        return { nextInstruction, restCode };
    }
}
