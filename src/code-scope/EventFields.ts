import { EventField } from "./EventField";
import { EventType } from "./EventScope";

class FieldValidator {
    constructor(
        readonly name: string,
        readonly parser: (value: string) => EventField,
    ) {}
}

function fieldVal(name: string, values: Record<string, string>): FieldValidator {
    return new FieldValidator(name, (value: string) => {
        const scratchValue = values[value];
        if(scratchValue === undefined) {
            throw new Error(`${value} is not a valid value for ${name}! (Expected: ${values})`);
        }
        return new EventField(name, scratchValue);
    });
}

const eventFieldCheckers = {
    [EventType.OnFlag]: [],
    [EventType.OnClick]: [],
    [EventType.OnKeyPress]: [fieldVal("KEY_OPTION", {
        "Space": "space",
        "UpArrow": "up arrow",
        "DownArrow": "down arrow",
        "LeftArrow": "left arrow",
        "RightArrow": "right arrow",
    })],
} as const;

export namespace EventFields {
    export function createFields(event: EventType, fields: readonly string[]): readonly EventField[] {
        const fieldsQueue = fields.slice();
        const fieldCheckers = eventFieldCheckers[event];
        const eventFields: EventField[] = [];
        for(const fieldChecker of fieldCheckers) {
            const field = fieldsQueue.shift();
            if(field === undefined) throw new Error(`Field '${fieldChecker.name}' is undefined for Event '${event}'!`);
            eventFields.push(fieldChecker.parser(field));
        }

        return eventFields;
    }
}
