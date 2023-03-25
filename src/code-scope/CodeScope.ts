export abstract class CodeScope {
    abstract toScratch(sourceDir: string): unknown;
    abstract runCommand(line: string): void;
}
