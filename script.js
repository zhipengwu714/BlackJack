// We'll build these functions out on Day 2
// For now, they just prove the buttons are wired up

function hit() {
  document.getElementById("message").innerText = "You hit!";
}

function stand() {
  document.getElementById("message").innerText = "You stood!";
}

function newGame() {
  document.getElementById("message").innerText = "New game started!";
}