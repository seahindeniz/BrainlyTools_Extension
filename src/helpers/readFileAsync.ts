export default function readFileAsync(
  file: Blob,
  onProgress?: (this: FileReader, ev: ProgressEvent<FileReader>) => any,
): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = onProgress;
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
