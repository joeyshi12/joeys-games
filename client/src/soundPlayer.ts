// Get cross-browser AudioContext (Safari still uses webkitAudioContext…)
const AudioContext = window.AudioContext ?? (window as any).webkitAudioContext as AudioContext;

export default class SoundPlayer {
    public readonly audioContext: AudioContext;
    private readonly _gainNode: GainNode;
    private _soundMap: Map<string, AudioBuffer>;

    public constructor() {
        this.audioContext = new AudioContext();
        this._gainNode = this.audioContext.createGain();
        this._soundMap = new Map();
        this._gainNode.connect(this.audioContext.destination);
    }

    public async loadSound(source: string, id: string): Promise<void> {
        if (this._soundMap.has(id)) {
            throw new Error(`Already loaded sound with id [${id}]`);
        }
        const audioBuffer = await this._fetchAudioBuffer(source);
        this._soundMap.set(id, audioBuffer);
    }

    public playSound(id: string): void {
        const sound = this._soundMap.get(id);
        if (!sound) {
            throw new Error(`Missing sound with id [${id}]`);
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = sound;
        source.loop = false;
        source.connect(this._gainNode);
        source.start();
    }

    private async _fetchAudioBuffer(source: string): Promise<AudioBuffer> {
        const arrayBuffer = await (await fetch(source)).arrayBuffer();
        return await new Promise((resolve, reject) => {
            this.audioContext.decodeAudioData(
                arrayBuffer,
                buffer => resolve(buffer),
                error => reject(error)
            );
        });
    }
}
