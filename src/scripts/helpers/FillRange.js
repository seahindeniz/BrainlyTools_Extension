export default function FillRange(start, end) {
  [start, end] = [Number(start), Number(end)];

  if (isNaN(start))
    throw "Invalid start number";

  if (isNaN(end))
    throw "Invalid end number";

  if (start > end)
    [start, end] = [~~end, ~~start];

    let range = [];

  for (let i = start; i <= end; i++)
    range.push(i);

  return range;
}
