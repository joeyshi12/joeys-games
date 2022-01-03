import { EntityMetadata } from "../../../../../src/types/entityMetadata";
import { RendererService } from "../services/rendererService";

/**
 * Contains info needed to render the tilemap describe which
 */
interface MapData {
    rows: number;
    cols: number;
    spriteData: number[];
    collisionSolidData: boolean[];
    collisionPlatformData: boolean[];
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

        const topRow = Math.floor((y + entity.collisionBox.height / 2) / RendererService.SPRITE_LENGTH) - 1;
        const leftCol = Math.floor((x + 1) / RendererService.SPRITE_LENGTH);
        const rightCol = Math.floor((x + entity.collisionBox.width - 1) / RendererService.SPRITE_LENGTH);

        const topPos = (topRow + 1) * RendererService.SPRITE_LENGTH + 1;

        const topLeftTileIdx = topRow * 40 + leftCol;
        const topRightTileIdx = topRow * 40 + rightCol;

        if ((this.mapData.collisionSolidData[topLeftTileIdx] || this.mapData.collisionSolidData[topRightTileIdx])
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

        const leftCol = Math.floor((x + entity.collisionBox.width / 2) / RendererService.SPRITE_LENGTH) - 1;
        const upperRow = Math.floor((y + 1) / RendererService.SPRITE_LENGTH);
        const lowerRow = Math.floor((y + entity.collisionBox.height - 1) / RendererService.SPRITE_LENGTH);

        const leftPos = (leftCol + 1) * RendererService.SPRITE_LENGTH + 1;

        const upperLeftTileIdx = upperRow * 40 + leftCol;
        const lowerLeftTileIdx = lowerRow * 40 + leftCol;
        if ((this.mapData.collisionSolidData[upperLeftTileIdx] || this.mapData.collisionSolidData[lowerLeftTileIdx])
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

        const leftCol = Math.floor((x + 1) / RendererService.SPRITE_LENGTH);
        const bottomRow = Math.floor((y + entity.collisionBox.height) / RendererService.SPRITE_LENGTH) + 1;
        const rightCol = Math.floor((x + entity.collisionBox.width - 1) / RendererService.SPRITE_LENGTH);

        const bottomPos = bottomRow * RendererService.SPRITE_LENGTH - 1;

        const bottomLeftTileIdx = bottomRow * 40 + leftCol;
        const bottomRightTileIdx = bottomRow * 40 + rightCol;

        const existsGroundBelow = this.mapData.collisionSolidData[bottomLeftTileIdx]
            || this.mapData.collisionSolidData[bottomRightTileIdx]
            || this.mapData.collisionPlatformData[bottomLeftTileIdx]
            || this.mapData.collisionPlatformData[bottomRightTileIdx];
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

        const rightCol = Math.floor((x + entity.collisionBox.width / 2) / RendererService.SPRITE_LENGTH) + 1;
        const upperRow = Math.floor((y + 1) / RendererService.SPRITE_LENGTH);
        const lowerRow = Math.floor((y + entity.collisionBox.height - 1) / RendererService.SPRITE_LENGTH);

        const rightPos = rightCol * RendererService.SPRITE_LENGTH - 1;

        const upperRightTileIdx = upperRow * 40 + rightCol;
        const lowerRightTileIdx = lowerRow * 40 + rightCol;
        if ((this.mapData.collisionSolidData[upperRightTileIdx] || this.mapData.collisionSolidData[lowerRightTileIdx])
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
