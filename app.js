let currentState = "luft";

const explanation = document.getElementById("explanation");
const buttons = document.querySelectorAll("#controls button");

function setState(state) {
  currentState = state;

  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.state === state);
  });

  if (state === "luft") {
    explanation.textContent =
      "Bei sauberer Luft kann der Körper Sauerstoff gut aufnehmen. Die Atmung funktioniert effizient.";
  }

  if (state === "rauch") {
    explanation.textContent =
      "Rauch belastet die Atemwege. Die Sauerstoffaufnahme wird erschwert.";
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    setState(button.dataset.state);
  });
});
