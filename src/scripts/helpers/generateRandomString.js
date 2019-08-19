export default function generateRandomString() {
  return Math.random().toString(32).slice(2);
}
