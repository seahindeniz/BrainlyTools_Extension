export default function isShortcut(fileName: string) {
  // https://regex101.com/r/9zcRig/1
  return /.(?<extension>lnk|url|xnk)$/i.test(fileName);
}
