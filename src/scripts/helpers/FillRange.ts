/* eslint-disable no-param-reassign */

export default function FillRange(
  start?: number | string,
  end?: number | string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._: undefined[]
) {
  [start, end] = [Number(start), Number(end)];

  if (Number.isNaN(start)) throw Error("Invalid start number");

  if (Number.isNaN(end)) throw Error("Invalid end number");

  if (start > end) [start, end] = [~~end, ~~start];

  const range = [];

  for (let i = start; i <= end; i++) range.push(i);

  return range;
}
