import { ObjectValues } from "../types/ObjectValues";

export const CodeType = {
    Float: 4,
    PositiveFloat: 5,
    PositiveInteger: 6,
    Integer: 7,
    Angle: 8,
    Color: 9,
    String: 10,
    Broadcast: 11,
    Variable: 12,
    List: 13,
} as const;
export type CodeType = ObjectValues<typeof CodeType>;
