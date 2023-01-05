import * as fs from "fs";
import * as path from "path";
import { MapData, MapError } from "../types/mapData";
import { Request, Response } from "express";
import { isNumberArray } from "../util/util";

export default class MapController {
    public static readonly DATA_DIR = path.join(__dirname, "..", "data");
    private readonly _mapDataRepository: MapData[];

    public constructor() {
        this._mapDataRepository = [];
        this._loadMaps();
    }

    public getAllMaps(req: Request, res: Response): void {
        res.status(200);
        res.send(this._mapDataRepository);
    }

    public uploadMap(req: Request, res: Response): void {
        try {
            const mapData = JSON.parse(req.body) as MapData;
            this._validateMap(mapData);
            this._mapDataRepository.push(mapData);
            fs.writeFileSync(
                path.join(MapController.DATA_DIR, `${mapData.name}.json`),
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

    private _loadMaps(): void {
        for (const filename of fs.readdirSync(MapController.DATA_DIR)) {
            const fileContent = fs.readFileSync(path.join(MapController.DATA_DIR, filename));
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
