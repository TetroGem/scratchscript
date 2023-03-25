import { CodeScope } from "./CodeScope";

export class GlobalNode extends CodeScope {
    constructor() {
        super();
    }

    toScratch(): string {
        throw new Error('Not implemeneted!');
    }
}
