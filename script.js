const nameInput = document.querySelector("#nameInput");
const nameTargets = document.querySelectorAll("[data-name]");
const celebrateBtn = document.querySelector("#celebrateBtn");
const wishBtn = document.querySelector("#wishBtn");
const copyBtn = document.querySelector("#copyBtn");
const wishLine = document.querySelector("#wishLine");

const wishes = [
  "Tuổi mới rực rỡ hơn những ngọn nến trên bánh.",
  "Mong mọi dự định đều gặp đúng người, đúng lúc, đúng niềm vui.",
  "Chúc bạn luôn đủ bình yên để nghỉ ngơi và đủ háo hức để bắt đầu.",
  "Mong những ngày tới nhẹ nhàng, may mắn và đầy tiếng cười.",
  "Chúc trái tim bạn luôn được yêu thương theo cách thật tử tế.",
  "Mong hôm nay là khởi đầu của một chương thật đẹp.",
  "Chúc bạn nhận được nhiều điều tốt lành hơn cả lời chúc này.",
  "Mong tuổi mới có thêm can đảm, thêm dịu dàng, thêm những chuyến đi vui."
];

const sceneCanvas = document.querySelector("#birthday-scene");
const sceneCtx = sceneCanvas.getContext("2d");
const confettiCanvas = document.querySelector("#confetti");
const confettiCtx = confettiCanvas.getContext("2d");
const confettiPieces = [];

let sceneWidth = 0;
let sceneHeight = 0;
let confettiWidth = 0;
let confettiHeight = 0;
let sceneStart = performance.now();
let lastWishIndex = 0;

function resizeCanvas(canvas, ctx, fixedToViewport = false) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = fixedToViewport
    ? { width: window.innerWidth, height: window.innerHeight }
    : canvas.getBoundingClientRect();

  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));

  if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  return { width, height };
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawBalloon(ctx, x, y, size, color, drift) {
  ctx.save();
  ctx.translate(x + Math.sin(drift) * 7, y + Math.cos(drift * 0.7) * 4);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.62, size * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.beginPath();
  ctx.ellipse(-size * 0.22, -size * 0.24, size * 0.14, size * 0.24, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(33,50,74,0.22)";
  ctx.beginPath();
  ctx.moveTo(-5, size * 0.68);
  ctx.lineTo(5, size * 0.68);
  ctx.lineTo(0, size * 0.84);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(33,50,74,0.34)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.84);
  ctx.bezierCurveTo(-10, size * 1.2, 12, size * 1.55, -3, size * 2.05);
  ctx.stroke();
  ctx.restore();
}

function drawGift(ctx, x, y, size, color, ribbon) {
  ctx.save();
  ctx.shadowColor = "rgba(33,50,74,0.14)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 9;
  ctx.fillStyle = color;
  roundRect(ctx, x, y, size, size * 0.72, 7);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = ribbon;
  ctx.fillRect(x + size * 0.43, y, size * 0.14, size * 0.72);
  ctx.fillRect(x, y + size * 0.27, size, size * 0.14);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x + size * 0.44, y - size * 0.03, size * 0.2, size * 0.1, -0.3, 0, Math.PI * 2);
  ctx.ellipse(x + size * 0.58, y - size * 0.03, size * 0.2, size * 0.1, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawScene(now) {
  const time = (now - sceneStart) / 1000;
  const size = resizeCanvas(sceneCanvas, sceneCtx);
  sceneWidth = size.width;
  sceneHeight = size.height;
  const w = sceneWidth;
  const h = sceneHeight;
  const ctx = sceneCtx;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff2d6";
  ctx.fillRect(0, 0, w, h);

  const tableY = h * 0.68;
  const background = ctx.createLinearGradient(0, 0, w, h);
  background.addColorStop(0, "#fff9ef");
  background.addColorStop(0.46, "#ffe7d6");
  background.addColorStop(1, "#b8ead8");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(33,50,74,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.06, h * 0.12);
  ctx.bezierCurveTo(w * 0.28, h * 0.02, w * 0.52, h * 0.24, w * 0.78, h * 0.09);
  ctx.bezierCurveTo(w * 0.9, h * 0.03, w * 1.02, h * 0.12, w * 1.08, h * 0.08);
  ctx.stroke();

  const bulbColors = ["#f2685b", "#f6c85f", "#1e9b98", "#ff8f8a", "#21324a"];
  for (let i = 0; i < 16; i += 1) {
    const t = i / 15;
    const x = w * (0.06 + t * 0.96);
    const y = h * (0.11 + Math.sin(t * Math.PI * 3.2) * 0.055);
    const glow = 0.55 + Math.sin(time * 2 + i) * 0.18;
    ctx.fillStyle = bulbColors[i % bulbColors.length];
    ctx.globalAlpha = glow;
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const confettiColors = ["#f2685b", "#1e9b98", "#f6c85f", "#21324a", "#ff8f8a"];
  for (let i = 0; i < 70; i += 1) {
    const x = ((i * 83) % 1000) / 1000 * w;
    const y = ((i * 137) % 1000) / 1000 * h * 0.62 + h * 0.05;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(((i * 23) % 360) * Math.PI / 180);
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.fillRect(-3, -2, 8, 4);
    ctx.restore();
  }

  drawBalloon(ctx, w * 0.72, h * 0.22, Math.min(58, w * 0.07), "#f2685b", time);
  drawBalloon(ctx, w * 0.85, h * 0.28, Math.min(50, w * 0.06), "#1e9b98", time + 1.2);
  drawBalloon(ctx, w * 0.93, h * 0.18, Math.min(46, w * 0.05), "#f6c85f", time + 2.2);

  ctx.fillStyle = "#f7dcb6";
  ctx.beginPath();
  ctx.moveTo(0, tableY);
  ctx.bezierCurveTo(w * 0.28, tableY - 26, w * 0.68, tableY + 18, w, tableY - 12);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(33,50,74,0.1)";
  ctx.beginPath();
  ctx.ellipse(w * 0.72, tableY + 120, Math.min(300, w * 0.24), 32, 0, 0, Math.PI * 2);
  ctx.fill();

  const cakeW = Math.min(w < 680 ? w * 0.58 : w * 0.28, 320);
  const cakeX = w < 680 ? w * 0.53 : w * 0.72;
  const cakeY = tableY + 28;
  const layerH = cakeW * 0.19;

  ctx.save();
  ctx.translate(cakeX, cakeY);
  ctx.shadowColor = "rgba(33,50,74,0.18)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = "#21324a";
  roundRect(ctx, -cakeW * 0.47, layerH * 1.3, cakeW * 0.94, layerH * 0.22, 12);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const bottomGrad = ctx.createLinearGradient(0, 0, 0, layerH);
  bottomGrad.addColorStop(0, "#ffb5ae");
  bottomGrad.addColorStop(1, "#f2685b");
  ctx.fillStyle = bottomGrad;
  roundRect(ctx, -cakeW * 0.42, layerH * 0.48, cakeW * 0.84, layerH * 0.9, 12);
  ctx.fill();

  ctx.fillStyle = "#fff9ef";
  ctx.beginPath();
  ctx.ellipse(0, layerH * 0.5, cakeW * 0.42, layerH * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffe08a";
  for (let i = -3; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(i * cakeW * 0.11, layerH * 0.42, 6, 0, Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = "#fff2d6";
  roundRect(ctx, -cakeW * 0.31, -layerH * 0.2, cakeW * 0.62, layerH * 0.78, 12);
  ctx.fill();
  ctx.fillStyle = "#1e9b98";
  ctx.beginPath();
  ctx.ellipse(0, -layerH * 0.2, cakeW * 0.31, layerH * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = -2; i <= 2; i += 1) {
    const cx = i * cakeW * 0.11;
    const flame = 1 + Math.sin(time * 7 + i) * 0.15;
    ctx.fillStyle = i % 2 === 0 ? "#f2685b" : "#21324a";
    roundRect(ctx, cx - 4, -layerH * 0.84, 8, layerH * 0.48, 4);
    ctx.fill();
    ctx.fillStyle = "#f6c85f";
    ctx.beginPath();
    ctx.ellipse(cx, -layerH * 0.95, 6 * flame, 12 * flame, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.beginPath();
    ctx.ellipse(cx - 1, -layerH * 0.98, 2.8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawGift(ctx, w * 0.62, tableY + 92, Math.min(82, w * 0.1), "#1e9b98", "#fff2d6");
  drawGift(ctx, w * 0.86, tableY + 84, Math.min(72, w * 0.09), "#ff8f8a", "#21324a");
  drawGift(ctx, w * 0.78, tableY + 142, Math.min(62, w * 0.08), "#f6c85f", "#f2685b");

  requestAnimationFrame(drawScene);
}

function burstConfetti(amount = 120) {
  const colors = ["#f2685b", "#1e9b98", "#f6c85f", "#21324a", "#ff8f8a", "#b8ead8"];
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    confettiPieces.push({
      x: confettiWidth * (0.22 + Math.random() * 0.62),
      y: confettiHeight * (0.18 + Math.random() * 0.18),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 5 + Math.random() * 8,
      spin: Math.random() * Math.PI,
      turn: -0.22 + Math.random() * 0.44,
      color: colors[i % colors.length],
      life: 90 + Math.random() * 60
    });
  }
}

function drawConfetti() {
  const size = resizeCanvas(confettiCanvas, confettiCtx, true);
  confettiWidth = size.width;
  confettiHeight = size.height;

  confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);
  for (let i = confettiPieces.length - 1; i >= 0; i -= 1) {
    const piece = confettiPieces[i];
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.18;
    piece.vx *= 0.99;
    piece.spin += piece.turn;
    piece.life -= 1;

    confettiCtx.save();
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.spin);
    confettiCtx.globalAlpha = Math.max(0, Math.min(1, piece.life / 40));
    confettiCtx.fillStyle = piece.color;
    confettiCtx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
    confettiCtx.restore();

    if (piece.life <= 0 || piece.y > confettiHeight + 80) {
      confettiPieces.splice(i, 1);
    }
  }

  requestAnimationFrame(drawConfetti);
}

function updateName() {
  const value = nameInput.value.trim() || "Hùng em";
  nameTargets.forEach((target) => {
    target.textContent = value;
  });
}

function nextWish() {
  let index = Math.floor(Math.random() * wishes.length);
  if (index === lastWishIndex) {
    index = (index + 1) % wishes.length;
  }
  lastWishIndex = index;
  wishLine.textContent = wishes[index];
  burstConfetti(80);
}

async function copyGreeting() {
  const name = nameInput.value.trim() || "Hùng em";
  const text = `Chúc mừng sinh nhật ${name}! Mong tuổi mới của ${name} thật nhiều sức khỏe, bình yên, may mắn và những niềm vui bất ngờ đến đúng lúc.`;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  const previous = copyBtn.textContent;
  copyBtn.textContent = "Đã copy";
  window.setTimeout(() => {
    copyBtn.textContent = previous;
  }, 1400);
}

nameInput.addEventListener("input", updateName);
celebrateBtn.addEventListener("click", () => burstConfetti(150));
wishBtn.addEventListener("click", nextWish);
copyBtn.addEventListener("click", copyGreeting);
window.addEventListener("resize", () => {
  resizeCanvas(sceneCanvas, sceneCtx);
  resizeCanvas(confettiCanvas, confettiCtx, true);
});

updateName();
resizeCanvas(sceneCanvas, sceneCtx);
resizeCanvas(confettiCanvas, confettiCtx, true);
requestAnimationFrame(drawScene);
requestAnimationFrame(drawConfetti);
window.setTimeout(() => burstConfetti(90), 450);
