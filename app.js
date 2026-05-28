const buttons = document.querySelectorAll("#controls button");

const explanation = document.getElementById("explanation");
const stateTag = document.getElementById("stateTag");
const lungVisual = document.getElementById("lungVisual");
const particlesContainer = document.getElementById("particles");

const markerAtemwege = document.getElementById("markerAtemwege");
const markerSauerstoff = document.getElementById("markerSauerstoff");
const markerHerz = document.getElementById("markerHerz");
const markerBelastung = document.getElementById("markerBelastung");
const markerLeistung = document.getElementById("markerLeistung");

const states = {
  luft: {
    tag: "Saubere Luft",
    tagClass: "state-tag state-tag--luft",
    lungClass: "lung-visual lung-visual--luft",
    explanation:
      "Bei sauberer Luft kann der Körper Sauerstoff gut aufnehmen. Die Atmung funktioniert effizient.",

    marker: {
      atemwege: { text: "weit", className: "marker__value marker__value--good" },
      sauerstoff: { text: "hoch", className: "marker__value marker__value--good" },
      herz: { text: "ruhig", className: "marker__value marker__value--good" },
      belastung: { text: "gering", className: "marker__value marker__value--neutral" },
      leistung: { text: "fit", className: "marker__value marker__value--good" }
    },

    particles: {
      count: 16,
      type: "air",
      minSize: 8,
      maxSize: 18,
      minDuration: 4,
      maxDuration: 7
    }
  },

  rauch: {
    tag: "Zigarettenrauch",
    tagClass: "state-tag state-tag--rauch",
    lungClass: "lung-visual lung-visual--rauch",
    explanation:
      "Rauch belastet die Atemwege. Dadurch wird die Sauerstoffaufnahme erschwert, und der Körper reagiert stärker auf Belastung.",

    marker: {
      atemwege: { text: "enger", className: "marker__value marker__value--warn" },
      sauerstoff: { text: "niedriger", className: "marker__value marker__value--bad" },
      herz: { text: "reaktiver", className: "marker__value marker__value--warn" },
      belastung: { text: "höher", className: "marker__value marker__value--bad" },
      leistung: { text: "müder", className: "marker__value marker__value--warn" }
    },

    particles: {
      count: 12,
      type: "smoke",
      minSize: 10,
      maxSize: 24,
      minDuration: 6,
      maxDuration: 10
    }
  }
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles(config) {
  particlesContainer.innerHTML = "";

  for (let i = 0; i < config.count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    if (config.type === "air") {
      particle.classList.add("particle--air");
    }

    if (config.type === "smoke") {
      particle.classList.add("particle--smoke");
    }

    const size = randomBetween(config.minSize, config.maxSize);
    const left = randomBetween(5, 90);
    const duration = randomBetween(config.minDuration, config.maxDuration);
    const delay = randomBetween(0, 4);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.top = `-20px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    particlesContainer.appendChild(particle);
  }
}

function applyState(stateKey) {
  const state = states[stateKey];

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.state === stateKey);
  });

  stateTag.textContent = state.tag;
  stateTag.className = state.tagClass;

  lungVisual.className = state.lungClass;
  explanation.textContent = state.explanation;

  markerAtemwege.textContent = state.marker.atemwege.text;
  markerAtemwege.className = state.marker.atemwege.className;

  markerSauerstoff.textContent = state.marker.sauerstoff.text;
  markerSauerstoff.className = state.marker.sauerstoff.className;

  markerHerz.textContent = state.marker.herz.text;
  markerHerz.className = state.marker.herz.className;

  markerBelastung.textContent = state.marker.belastung.text;
  markerBelastung.className = state.marker.belastung.className;

  markerLeistung.textContent = state.marker.leistung.text;
  markerLeistung.className = state.marker.leistung.className;

  createParticles(state.particles);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    applyState(button.dataset.state);
  });
});

applyState("luft");
``
