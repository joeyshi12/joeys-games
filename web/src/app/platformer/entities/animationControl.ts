export class AnimationControl {
  public static ANIMATION_BUFFER: number = 6;
  private _state: string;
  private _stateIndex: number;
  private _animationTimer: number;

  constructor(private _animationStates: Map<string, number[]>) {
    this.state = this._animationStates.keys().next().value;
  }

  public get state(): string {
    return this._state;
  }

  public set state(val: string) {
    this._state = val;
    this._stateIndex = 0;
    this._animationTimer = AnimationControl.ANIMATION_BUFFER;
  }

  public get spriteIndex(): number {
    return this._spriteIndices[this._stateIndex];
  }

  public update(): void {
    if (this._animationTimer <= 0) {
      this._stateIndex = (this._stateIndex + 1) % this._spriteIndices.length;
      this._animationTimer = AnimationControl.ANIMATION_BUFFER;
    } else {
      this._animationTimer--;
    }
  }

  private get _spriteIndices(): number[] {
    return this._animationStates.get(this._state) ?? [];
  }
}
