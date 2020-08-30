export default function Chunkify<T>(array: T[], size: number) {
  if (!array || !(array instanceof Array)) throw Error("Array isn't defined");

  if (!size) throw Error("Size isn't defined");

  if (size < 1) throw Error("Size should be more than 0");

  return array.reduce(
    (chunk, element) => {
      if (chunk[chunk.length - 1].length === ~~size) chunk.push([]);

      chunk[chunk.length - 1].push(element);

      return chunk;
    },
    [[] as T[]],
  );
}
