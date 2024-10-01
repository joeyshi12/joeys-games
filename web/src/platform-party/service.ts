import { loadImage } from "../core/image";
import { Character, PlayerCreationMetadata, PlayerMetadata } from "./models";

export const SPRITE_LENGTH = 16;

export type SpriteSheet = {
    rows: number;
    columns: number;
    cellLength: number;
    sprites: ImageBitmap[];
}

export async function loginPlayer(creationMetadata: PlayerCreationMetadata): Promise<any> {
    const response: Response = await fetch("/platform-party/login", {
        method: "PUT",
        body: JSON.stringify(creationMetadata)
    })
    return await response.json();
}

export async function loadSpriteSheet(source: string, rows: number, columns: number): Promise<SpriteSheet> {
    const image = await loadImage(source);
    const cellLength = Math.floor(image.width / columns);
    const verticalCellLength = Math.floor(image.height / rows);
    if (cellLength !== verticalCellLength) {
        throw new Error(
            `Horizontal cell length does not match vertical cell length [${cellLength} != ${verticalCellLength}]`
        );
    }
    if (cellLength * columns !== image.width || verticalCellLength * rows !== image.height) {
        throw new Error("Cannot parse sprite sheet from given rows and cols");
    }
    const sprites: Promise<ImageBitmap>[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            sprites.push(createImageBitmap(
               image,
                cellLength * j,
                cellLength * i,
                cellLength,
                cellLength
            ));
        }
    }
    return {
        rows: rows,
        columns: columns,
        cellLength: cellLength,
        sprites: await Promise.all(sprites)
    };
}

export function loadFont(family: string, source: string): Promise<FontFace> {
    const font = new FontFace(family, `url(${source})`);
    return new Promise((resolve, reject) => {
        font.load().then((fontFace: FontFace) => resolve(fontFace))
            .catch((err) => reject(err));
    });
}
