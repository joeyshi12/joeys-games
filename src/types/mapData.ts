export type MapData = {
    name: string;
    rows: number;
    columns: number;
    spriteData: number[];
    solidIndices: number[];
    platformIndices: number[];
}

export class MapError extends Error {
    public constructor(msg: string) {
        super(msg);
    }
}
