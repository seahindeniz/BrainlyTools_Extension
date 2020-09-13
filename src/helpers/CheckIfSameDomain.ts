export default function CheckIfSameDomain(url1: string, url2: string) {
  const URL1 = new URL(url1);
  const URL2 = new URL(url2);

  return URL1.host === URL2.host && URL1.host;
}
