export function getRandomColorRGB() {
  const r = Math.floor(Math.random() * 256); // 生成 0 到 255 之间的随机整数
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export function checkCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radiusSum = circle1.radius + circle2.radius;

  return distance < radiusSum;
}
