export function getRandomColorRGB() {
  const r = Math.floor(Math.random() * 256); // 生成 0 到 255 之间的随机整数
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
