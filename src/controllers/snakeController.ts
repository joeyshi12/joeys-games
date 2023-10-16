import { Request, Response } from "express";
import {SnakeScore} from "../models/snakeModels";

export class SnakeController {
    public getAllScores(req: Request, res: Response) {
        // TODO: implement
        res.json([]);
    }

    public submitScore(req: Request, res: Response) {
        // TODO: implement
        const score: SnakeScore = req.body;
        console.log(score);
        res.json([score]);
    }
}
