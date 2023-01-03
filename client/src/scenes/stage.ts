import { EntityMetadata } from "../../../src/types/entityMetadata";
import { Renderer } from "../renderer";

/**
 * Contains info needed to render the tilemap describe which
 */
interface MapData {
    rows: number;
    cols: number;
    spriteData: number[];
    solidIndices: Set<number>;
    platformIndices: Set<number>;
}

export type Tile = "solid" | "platform";

/**
 * Collision event with a given tile type and position in the direction normal to the tile surface
 */
export interface CollisionEvent {
    tile: Tile;
    position: number;
}

export class Stage {
    constructor(private _mapData: MapData) {}

    public get mapData(): MapData {
        return this._mapData;
    }

    public getCollisionEventAbove(entity: EntityMetadata): CollisionEvent | undefined {
        const [x, y] = this._getEntityOffsettedPosition(entity);
        const topRow = Math.floor((y + entity.collisionBox.height / 2) / Renderer.SPRITE_LENGTH) - 1;
        const leftCol = Math.floor((x + 1) / Renderer.SPRITE_LENGTH);
        const rightCol = Math.floor((x + entity.collisionBox.width - 1) / Renderer.SPRITE_LENGTH);

        const topPos = (topRow + 1) * Renderer.SPRITE_LENGTH + 1;

        const topLeftTileIdx = topRow * this.mapData.cols + leftCol;
        const topRightTileIdx = topRow * this.mapData.cols + rightCol;

        if ((this.mapData.solidIndices.has(topLeftTileIdx) || this.mapData.solidIndices.has(topRightTileIdx))
            && y < topPos) {
            return {
                tile: <Tile>"solid",
                position: topPos - entity.collisionBox.offset.y
            };
        } else {
            return undefined;
        }
    }

    public getCollisionEventLeft(entity: EntityMetadata): CollisionEvent | undefined {
        const [x, y] = this._getEntityOffsettedPosition(entity);

        const leftCol = Math.floor((x + entity.collisionBox.width / 2) / Renderer.SPRITE_LENGTH) - 1;
        const upperRow = Math.floor((y + 1) / Renderer.SPRITE_LENGTH);
        const lowerRow = Math.floor((y + entity.collisionBox.height - 1) / Renderer.SPRITE_LENGTH);

        const leftPos = (leftCol + 1) * Renderer.SPRITE_LENGTH + 1;

        const upperLeftTileIdx = upperRow * this.mapData.cols + leftCol;
        const lowerLeftTileIdx = lowerRow * this.mapData.cols + leftCol;
        if ((this.mapData.solidIndices.has(upperLeftTileIdx) || this.mapData.solidIndices.has(lowerLeftTileIdx))
            && x <= leftPos) {
            return {
                tile: <Tile>"solid",
                position: leftPos - entity.collisionBox.offset.x
            };
        } else {
            return undefined;
        }
    }

    public getCollisionEventBelow(entity: EntityMetadata, vy: number): CollisionEvent | undefined {
        const [x, y] = this._getEntityOffsettedPosition(entity);

        const leftCol = Math.floor((x + 1) / Renderer.SPRITE_LENGTH);
        const bottomRow = Math.floor((y + entity.collisionBox.height) / Renderer.SPRITE_LENGTH) + 1;
        const rightCol = Math.floor((x + entity.collisionBox.width - 1) / Renderer.SPRITE_LENGTH);

        const bottomPos = bottomRow * Renderer.SPRITE_LENGTH - 1;

        const bottomLeftTileIdx = bottomRow * this.mapData.cols + leftCol;
        const bottomRightTileIdx = bottomRow * this.mapData.cols + rightCol;

        const existsGroundBelow = this.mapData.solidIndices.has(bottomLeftTileIdx)
            || this.mapData.solidIndices.has(bottomRightTileIdx)
            || this.mapData.platformIndices.has(bottomLeftTileIdx)
            || this.mapData.platformIndices.has(bottomRightTileIdx);
        if (existsGroundBelow && y + vy + entity.collisionBox.height >= bottomPos) {
            return {
                tile: <Tile>"solid",
                position: bottomPos - entity.collisionBox.offset.y - entity.collisionBox.height
            };
        } else {
            return undefined;
        }
    }

    public getCollisionEventRight(entity: EntityMetadata): CollisionEvent | undefined {
        const [x, y] = this._getEntityOffsettedPosition(entity);

        const rightCol = Math.floor((x + entity.collisionBox.width / 2) / Renderer.SPRITE_LENGTH) + 1;
        const upperRow = Math.floor((y + 1) / Renderer.SPRITE_LENGTH);
        const lowerRow = Math.floor((y + entity.collisionBox.height - 1) / Renderer.SPRITE_LENGTH);

        const rightPos = rightCol * Renderer.SPRITE_LENGTH - 1;

        const upperRightTileIdx = upperRow * this.mapData.cols + rightCol;
        const lowerRightTileIdx = lowerRow * this.mapData.cols + rightCol;
        if ((this.mapData.solidIndices.has(upperRightTileIdx) || this.mapData.solidIndices.has(lowerRightTileIdx))
            && x + entity.collisionBox.width >= rightPos) {
            return {
                tile: <Tile>"solid",
                position: rightPos - entity.collisionBox.offset.x - entity.collisionBox.width
            };
        } else {
            return undefined;
        }
    }

    private _getEntityOffsettedPosition(entity: EntityMetadata): [number, number] {
        return [
            entity.position.x + entity.collisionBox.offset.x,
            entity.position.y + entity.collisionBox.offset.y
        ];
    }
}
