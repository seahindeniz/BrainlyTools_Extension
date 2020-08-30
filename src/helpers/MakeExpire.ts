export default function MakeExpire(expireTime = 30) {
  return Date.now() + expireTime * 1000;
}
