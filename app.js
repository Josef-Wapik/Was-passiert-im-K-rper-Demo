const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const buttons = document.querySelectorAll("#controls button");

const explanation = document.getElementById("explanation");
const stateTag = document.getElementById("stateTag");

const markerAtemwege = document.getElementById("markerAtemwege");
const markerSauerstoff = document.getElementById("markerSauerstoff");
const markerTransport = document.getElementById("markerTransport");
const markerBelastung = document.getElementById("markerBelastung");
const markerLeistung = document.getElementById("markerLeistung");

let currentState = "luft";
let airParticles = [];
let smokeParticles = [];
let oxygenParticles = [];
let time = 0;

const centerX = 320;
const centerY = 230;

const states = {
  luft: {
    bgTop: "#f4f9ff",
    bgBottom: "#dbeafe",
    tag: "Saubere Luft",
    tagClass: "state-tag state-tag--luft",
    explanation:
      "Bei sauberer Luft dehnt sich die Lunge frei aus. Viele Sauerstoff-Teilchen werden sichtbar weitertransportiert.",
    inhaleRate: 0.35,
    smokeRate: 0.0,
    oxygenRate: 0.28,
    lungScale: 1.0,
    marker: {
      atemwege: ["weit", "marker__value marker__value--good"],
      sauerstoff: ["hoch", "marker__value marker__value--good"],
      transport: ["deutlich", "marker__value marker__value--good"],
      belastung: ["gering", "marker__value marker__value--neutral"],
      leistung: ["fit", "marker__value marker__value--good"]
    }
  },

  rauch: {
    bgTop: "#fff4f0",
    bgBottom: "#f8d8cc",
    tag: "Zigarettenrauch",
    tagClass: "state-tag state-tag--rauch",
    explanation:
      "Bei Zigarettenrauch dehnt sich die Lunge weniger frei aus. Weniger Sauerstoff wird sichtbar weitertransportiert, während zusätzliche Rauch-Partikel eingeatmet werden.",
    inhaleRate: 0.16,
    smokeRate: 0.22,
    oxygenRate: 0.09,
    lungScale: 0.9,
    marker: {
      atemwege: ["enger", "marker__value marker__value--warn"],
      sauerstoff: ["niedriger", "marker__value marker__value--bad"],
      transport: ["geringer", "marker__value marker__value--warn"],
      belastung: ["höher", "marker__value marker__value--bad"],
      leistung: ["müder", "marker__value marker__value--warn"]
    }
  }
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function setMarker(el, [text, cls]) {
  el.textContent = text;
  el.className = cls;
}

function applyState(stateKey) {
  currentState = stateKey;
  const state = states[stateKey];

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.state === stateKey);
  });

  stateTag.textContent = state.tag;
  stateTag.className = state.tagClass;
  explanation.textContent = state.explanation;

  setMarker(markerAtemwege, state.marker.atemwege);
  setMarker(markerSauerstoff, state.marker.sauerstoff);
  setMarker(markerTransport, state.marker.transport);
  setMarker(markerBelastung, state.marker.belastung);
  setMarker(markerLeistung, state.marker.leistung);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => applyState(button.dataset.state));
});

function spawnAirParticle() {
  airParticles.push({
    x: rand(220, 420),
    y: -20,
    r: rand(4, 8),
    vy: rand(1.2, 2.0),
    alpha: rand(0.55, 0.95)
  });
}

function spawnSmokeParticle() {
  smokeParticles.push({
    x: rand(220, 420),
    y: -20,
    r: rand(6, 12),
    vy: rand(0.8, 1.4),
    alpha: rand(0.15, 0.35)
  });
}

function spawnOxygenParticle() {
  oxygenParticles.push({
    x: rand(centerX - 20, centerX + 20),
    y: rand(centerY - 20, centerY + 20),
    r: rand(4, 7),
    vx: rand(1.4, 2.3),
    vy: rand(0.8, 1.5),
    alpha: rand(0.75, 0.95)
  });
}

function updateParticles() {
  const state = states[currentState];

  if (Math.random() < state.inhaleRate) spawnAirParticle();
  if (Math.random() < state.smokeRate) spawnSmokeParticle();
  if (Math.random() < state.oxygenRate) spawnOxygenParticle();

  airParticles.forEach(p => {
    p.y += p.vy;
  });
  smokeParticles.forEach(p => {
    p.y += p.vy;
  });
  oxygenParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
  });

  airParticles = airParticles.filter(p => p.y < 260);
  smokeParticles = smokeParticles.filter(p => p.y < 260);
  oxygenParticles = oxygenParticles.filter(p => p.x < 700 && p.y < 420);
}

function drawBackground() {
  const state = states[currentState];
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, state.bgTop);
  grad.addColorStop(1, state.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTorso() {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.roundRect(160, 60, 320, 310, 32);
  ctx.fill();
  ctx.restore();
}

function drawLungs() {
  const state = states[currentState];

  const breathe = 1 + Math.sin(time * 0.05) * 0.08 * state.lungScale;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(breathe, breathe);

  // left lung
  ctx.fillStyle = currentState === "luft" ? "rgba(220, 80, 80, 0.90)" : "rgba(195, 90, 70, 0.88)";
  ctx.beginPath();
  ctx.ellipse(-38, 0, 52, 78, -0.18, 0, Math.PI * 2);
  ctx.fill();

  // right lung
  ctx.beginPath();
  ctx.ellipse(38, 0, 52, 78, 0.18, 0, Math.PI * 2);
  ctx.fill();

  // trachea
  ctx.fillStyle = "#b8c5d6";
  ctx.fillRect(-8, -110, 16, 55);

  // bronchi
  ctx.fillRect(-8, -55, 16, 18);
  ctx.save();
  ctx.translate(0, -40);
  ctx.rotate(-0.45);
  ctx.fillRect(-6, 0, 12, 42);
  ctx.restore();

  ctx.save();
  ctx.translate(0, -40);
  ctx.rotate(0.45);
  ctx.fillRect(-6, 0, 12, 42);
  ctx.restore();

  ctx.restore();
}

function drawAirParticles() {
  airParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSmokeParticles() {
  smokeParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "rgba(90,90,90,0.6)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawOxygenParticles() {
  oxygenParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawLabels() {
  ctx.save();
  ctx.fillStyle = "rgba(31, 41, 55, 0.7)";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText("Lunge", 285, 360);
  ctx.fillText("sichtbarer Sauerstoff-Transport", 470, 360);
  ctx.restore();
}

function animate() {
  time++;
  updateParticles();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawTorso();
  drawAirParticles();
  drawSmokeParticles();
  drawLungs();
  drawOxygenParticles();
  drawLabels();

  requestAnimationFrame(animate);
}

// roundRect fallback-safe
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
  };
}

applyState("luft");
animate();
