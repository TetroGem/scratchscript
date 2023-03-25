import { CodeScope } from "./CodeScope";

export class GlobalNode extends CodeScope {
    constructor() {
        super();
    }

    override toScratch(): string {
        throw new Error('Not implemeneted!');
    }

    override runCommand(_line: string): void {
        throw new Error("Method not implemented.");
    }
}
