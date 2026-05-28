const buttons = document.querySelectorAll("#controls button");

const explanation = document.getElementById("explanation");
const stateTag = document.getElementById("stateTag");
const lungVisual = document.getElementById("lungVisual");
const lungBody = document.getElementById("lungBody");

const airParticles = document.getElementById("airParticles");
const smokeParticles = document.getElementById("smokeParticles");
const oxygenTransport = document.getElementById("oxygenTransport");

const markerAtemwege = document.getElementById("markerAtemwege");
const markerSauerstoff = document.getElementById("markerSauerstoff");
const markerTransport = document.getElementById("markerTransport");
const markerBelastung = document.getElementById("markerBelastung");
const markerLeistung = document.getElementById("markerLeistung");

const states = {
  luft: {
    tag: "Saubere Luft",
    tagClass: "state-tag state-tag--luft",
    lungClass: "lung-visual lung-visual--luft",
    breathingClass: "lung-body breathing",
    explanation:
      "Bei sauberer Luft dehnt sich die Lunge frei aus. Viele Sauerstoff-Teilchen werden sichtbar in den Körper transportiert.",

    marker: {
      atemwege: { text: "weit", className: "marker__value marker__value--good" },
      sauerstoff: { text: "hoch", className: "marker__value marker__value--good" },
      transport: { text: "deutlich", className: "marker__value marker__value--good" },
      belastung: { text: "gering", className: "marker__value marker__value--neutral" },
      leistung: { text: "fit", className: "marker__value marker__value--good" }
    },

    inhale: {
      airCount: 16,
      smokeCount: 0,
      oxygenCount: 14,
      airMinSize: 8,
      airMaxSize: 18,
      oxygenMinSize: 8,
      oxygenMaxSize: 14,
      airMinDuration: 4,
      airMaxDuration: 7,
      oxygenMinDuration: 2.6,
      oxygenMaxDuration: 4.0
    }
  },

  rauch: {
    tag: "Zigarettenrauch",
    tagClass: "state-tag state-tag--rauch",
    lungClass: "lung-visual lung-visual--rauch",
    breathingClass: "lung-body breathing-smoke",
    explanation:
      "Bei Rauch dehnt sich die Lunge weniger frei aus. Sichtbar werden weniger Sauerstoff-Teilchen weitertransportiert, während belastende Rauch-Partikel eingeatmet werden.",

    marker: {
      atemwege: { text: "enger", className: "marker__value marker__value--warn" },
      sauerstoff: { text: "niedriger", className: "marker__value marker__value--bad" },
      transport: { text: "geringer", className: "marker__value marker__value--warn" },
      belastung: { text: "höher", className: "marker__value marker__value--bad" },
      leistung: { text: "müder", className: "marker__value marker__value--warn" }
    },

    inhale: {
      airCount: 6,
      smokeCount: 10,
      oxygenCount: 5,
      airMinSize: 7,
      airMaxSize: 14,
      oxygenMinSize: 7,
      oxygenMaxSize: 12,
      airMinDuration: 5,
      airMaxDuration: 8,
      oxygenMinDuration: 3.4,
      oxygenMaxDuration: 5.0
    }
  }
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clearContainer(el) {
  el.innerHTML = "";
}

function createAirParticles(config) {
  clearContainer(airParticles);

  for (let i = 0; i < config.airCount; i++) {
    const p = document.createElement("div");
    p.classList.add("particle", "particle--air");

    const size = randomBetween(config.airMinSize, config.airMaxSize);
    const left = randomBetween(8, 88);
    const duration = randomBetween(config.airMinDuration, config.airMaxDuration);
    const delay = randomBetween(0, 3.5);

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${left}%`;
    p.style.top = `-24px`;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${delay}s`;

    airParticles.appendChild(p);
  }
}

function createSmokeParticles(config) {
  clearContainer(smokeParticles);

  for (let i = 0; i < config.smokeCount; i++) {
    const p = document.createElement("div");
    p.classList.add("particle", "particle--smoke");

    const size = randomBetween(10, 24);
    const left = randomBetween(10, 86);
    const duration = randomBetween(5.5, 9.5);
    const delay = randomBetween(0, 3.8);

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${left}%`;
    p.style.top = `-24px`;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${delay}s`;

    smokeParticles.appendChild(p);
  }
}

function createOxygenTransport(config) {
  clearContainer(oxygenTransport);

  for (let i = 0; i < config.oxygenCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("oxygen-dot");

    const size = randomBetween(config.oxygenMinSize, config.oxygenMaxSize);
    const startLeft = randomBetween(38, 56);
    const startTop = randomBetween(42, 58);
    const duration = randomBetween(config.oxygenMinDuration, config.oxygenMaxDuration);
    const delay = randomBetween(0, 2.8);

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${startLeft}%`;
    dot.style.top = `${startTop}%`;
    dot.style.animationDuration = `${duration}s`;
    dot.style.animationDelay = `${delay}s`;

    oxygenTransport.appendChild(dot);
  }
}

function applyMarker(element, data) {
  element.textContent = data.text;
  element.className = data.className;
}

function applyState(stateKey) {
  const state = states[stateKey];

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.state === stateKey);
  });

  stateTag.textContent = state.tag;
  stateTag.className = state.tagClass;

  lungVisual.className = state.lungClass;
  lungBody.className = state.breathingClass;
  explanation.textContent = state.explanation;

  applyMarker(markerAtemwege, state.marker.atemwege);
  applyMarker(markerSauerstoff, state.marker.sauerstoff);
  applyMarker(markerTransport, state.marker.transport);
  applyMarker(markerBelastung, state.marker.belastung);
  applyMarker(markerLeistung, state.marker.leistung);

  createAirParticles(state.inhale);
  createSmokeParticles(state.inhale);
  createOxygenTransport(state.inhale);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    applyState(button.dataset.state);
  });
});

applyState("luft");
