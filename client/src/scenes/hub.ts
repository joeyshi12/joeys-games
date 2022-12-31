import {Scene} from "./scene";
import Game from "../game";
import {ControlledPlayer} from "../entities/controlledPlayer";
import {Character, PlayerMetadata} from "../../../src/types/entityMetadata";
import {StageService} from "../stageService";

export default class Hub extends Scene {
    private _player: ControlledPlayer;
    private _stageService: StageService;

    public constructor(game: Game) {
        super(game);
        const metadata: PlayerMetadata = {
            name: "woopie",
            character: Character.BLUE,
            position: {x: 80, y: 0},
            spriteIndex: 354,
            isFlipped: false,
            collisionBox: {
                width: 16,
                height: 16,
                offset: {x: 0, y: 0}
            }
        };
        this._player = new ControlledPlayer(metadata);
        this._stageService = new StageService();
    }

    public keyPressed(event: KeyboardEvent) {
        this._player.keyPressed(event.key, this.game.soundPlayer);
    }

    public keyReleased(event: KeyboardEvent) {
        this._player.keyReleased(event.key);
    }

    public update() {
        this._player.update(this._stageService.currentStage, this.game.soundPlayer);
        this.game.renderer.updateCameraPosition(this._player.metadata.position);
        this.game.renderer.drawStage(this._stageService.currentStage);
        this.game.renderer.drawPlayer(this._player.metadata);
    }
}