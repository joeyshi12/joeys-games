// Get cross-browser AudioContext (Safari still uses webkitAudioContext…)
const AudioContext = window.AudioContext ?? (window as any).webkitAudioContext as AudioContext;

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

export class Sound {
    private readonly _gainNode: GainNode;

    public constructor(private readonly _audioBuffer: AudioBuffer) {
        this._gainNode = audioContext.createGain();
        this._gainNode.connect(gainNode);
    }

    public play(): void {
        const source = audioContext.createBufferSource();
        source.buffer = this._audioBuffer;
        source.loop = false;
        source.connect(this._gainNode);
        source.start();
    }
}

export async function loadSound(source: string): Promise<Sound> {
    const audioBuffer: AudioBuffer = await fetchAudioBuffer(source);
    return new Sound(audioBuffer);
}

async function fetchAudioBuffer(source: string): Promise<AudioBuffer> {
    const arrayBuffer = await (await fetch(source)).arrayBuffer();
    return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
            arrayBuffer,
            buffer => resolve(buffer),
            error => reject(error)
        );
    });
}
