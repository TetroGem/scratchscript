export namespace Strings {
    export function nullishIndexOf(str: string, substr: string): number | undefined {
        const index = str.indexOf(substr);
        return index === -1 ? undefined : index;
    }
}
