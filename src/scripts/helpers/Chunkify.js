/**
 * @param {[]} array
 * @param {number} size
 */
export default function Chunkify(array, size) {
  if (!array || !(array instanceof Array))
    throw "Array isn't defined";
  if (!size)
    throw "Size isn't defined";

  size = ~~size;

  if (size < 1)
    throw "Size should be more than 0";

  return array.reduce((chunk, element) => {

    if (chunk[chunk.length - 1].length === size)
      chunk.push([]);

    chunk[chunk.length - 1].push(element);

    return chunk;
  }, [
    []
  ]);
};
