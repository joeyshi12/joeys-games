import * as fs from "fs";
import * as path from "path";
import Log from "../util/logger";
import { Socket } from "socket.io";
import {Character, MapData, MapError, PlayerMetadata} from "../models/platformPartyModels";
import { Request, Response } from "express";
import { isNumberArray } from "../util/util";


export class PlatformPartyController {
    public static readonly DATA_DIR = path.join(__dirname, "data");
    private readonly _mapDataRepository: MapData[];
    private _playerRepository: Map<string, PlayerMetadata>;

    constructor() {
        this._mapDataRepository = [];
        this._playerRepository = new Map();
        this._loadMaps();
    }

    public createPlayer(socket: Socket): (_: string) => void {
        return (userName: string) => {
            if (this._isInvalidUserName(userName)) {
                socket.emit("joinError", `"${userName}" is an unavailable or invalid name`);
                return;
            }
            Log.info(`Creating player [${userName}]`);
            const randomCharacter = <Character>+Object.keys(Character)[Math.floor(Math.random() * 3)];
            const player: PlayerMetadata = {
                name: userName,
                character: randomCharacter,
                position: {x: 80, y: 500},
                spriteIndex: 354,
                isFlipped: false,
                collisionBox: {
                    width: 16,
                    height: 16,
                    offset: {x: 0, y: 0}
                }
            };
            this._playerRepository.set(socket.id, player);
            socket.emit("joinSuccess", player);
        };
    }

    public updatePlayer(socket: Socket): (_: PlayerMetadata) => void {
        return (metadata: PlayerMetadata) => {
            this._playerRepository.set(socket.id, metadata);
            socket.broadcast.volatile.emit("receivePlayer", metadata);
        };
    }

    public deletePlayer(socket: Socket): () => void {
        return () => {
            const player = this._playerRepository.get(socket.id);
            if (player) {
                Log.info(`Removing player [${player.name}]`);
                this._playerRepository.delete(socket.id);
                socket.broadcast.emit("receivePlayer", this._players);
            }
        };
    }

    public getAllMaps(_: Request, res: Response): void {
        res.status(200);
        res.send(this._mapDataRepository);
    }

    public uploadMap(req: Request, res: Response): void {
        try {
            const mapData = JSON.parse(req.body) as MapData;
            this._validateMap(mapData);
            this._mapDataRepository.push(mapData);
            fs.writeFileSync(
                path.join(PlatformPartyController.DATA_DIR, `${mapData.name}.json`),
                JSON.stringify(mapData)
            );
            res.status(200);
        } catch (e) {
            res.status(500);
            if (e instanceof MapError) {
                res.send({msg: e.message});
            } else {
                res.send({msg: "Failed to upload map"});
            }
        }
    }

    private get _players(): PlayerMetadata[] {
        return Array.from(this._playerRepository.values());
    }

    private _isInvalidUserName(userName: string): boolean {
        return userName === ""
      || userName.length > 20
      || this._players.some((metadata: PlayerMetadata) => metadata.name === userName);
    }

    private _loadMaps(): void {
        for (const filename of fs.readdirSync(PlatformPartyController.DATA_DIR)) {
            const fileContent = fs.readFileSync(path.join(PlatformPartyController.DATA_DIR, filename));
            const mapData: MapData = JSON.parse(fileContent.toString());
            this._validateMap(mapData);
            this._mapDataRepository.push(mapData);
        }
    }

    private _validateMap(mapData: MapData): void {
        if (typeof mapData?.name !== "string"
            || this._mapDataRepository.some(map => map.name === mapData.name)) {
            throw new MapError("Invalid map name");
        }
        if (typeof mapData?.rows !== "number") {
            throw new MapError("Invalid map rows");
        }
        if (typeof mapData?.columns !== "number") {
            throw new MapError("Invalid map columns");
        }
        if (!isNumberArray(mapData?.spriteData)) {
            throw new MapError("Invalid map spriteData");
        }
        if (!isNumberArray(mapData?.solidIndices)) {
            throw new MapError("Invalid map solidIndices");
        }
        if (!isNumberArray(mapData?.platformIndices)) {
            throw new MapError("Invalid map platformIndices");
        }
        if (mapData.rows * mapData.columns !== mapData.spriteData.length) {
            throw new MapError("Map dimensions mismatches spriteData length");
        }
    }

}
