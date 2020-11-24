export default function getCanvasBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise(resolve => canvas.toBlob(resolve));
}
