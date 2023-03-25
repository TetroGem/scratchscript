export class EventField {
    constructor(
        private readonly name: string,
        private readonly value: string,
    ) {}

    toScratch(): string {
        return `
        "${this.name}": [
            "${this.value}",
            null
        ]
        `;
    }
}
