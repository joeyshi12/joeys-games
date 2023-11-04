import * as mariadb from "mariadb";
import Log from "../util/logger";
import { Request, Response } from "express";
import { SnakeScore } from "../models/snakeModels";


export class SnakeController {
    constructor(private _pool: mariadb.Pool) {
    }

    public getAllScores(_: Request, res: Response) {
        this._getScores().then((scores: SnakeScore[]) => {
            res.status(200);
            res.send(scores);
        });
    }

    public submitScore(req: Request, res: Response) {
        const score: SnakeScore = req.body;
        if (!this._isValidScore(score)) {
            const message = `Invalid score submission [${JSON.stringify(score)}]`;
            Log.error(message);
            res.status(422);
            res.send(message);
        }
        score.creationDate = new Date().toISOString().split("T")[0];
        this._insertScore(score).then(() => {
            res.status(200);
            res.send(score);
        });
    }

    private _isValidScore(score: SnakeScore): boolean {
        return score?.playerName?.length >= 3 &&
            score?.playerName?.length <= 8 &&
            score?.score >= 0;
    }

    private async _getScores(): Promise<SnakeScore[]> {
        let rows = [];
        let connection: mariadb.PoolConnection;
        try {
            connection = await this._pool.getConnection();
            const query = "SELECT score, player_name AS playerName, DATE_FORMAT(creation_date, '%Y-%m-%d') AS creationDate FROM snake_score ORDER BY score DESC";
            rows = await connection.query(query);
        } catch (e) {
            Log.error(`Failed to fetch snake scores: ${e.message}`);
        } finally {
            if (connection) {
                connection.release();
            }
        }
        return rows;
    }

    private async _insertScore(score: SnakeScore): Promise<void> {
        let connection: mariadb.PoolConnection;
        try {
            connection = await this._pool.getConnection();
            await connection.query("INSERT INTO snake_score VALUES (?, ?, ?)", [score.playerName, score.score, score.creationDate]);
            Log.info(`${score.playerName} submitted snake score = ${score.score}`);
        } catch (e) {
            Log.error(`Failed to submit snake score: ${e.message}`);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}
