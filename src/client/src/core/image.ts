export function loadImage(source: string): Promise<HTMLImageElement> {
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => {
            reject(`Could not load image [${source}]`);
        };
        image.src = source;
    });
}
