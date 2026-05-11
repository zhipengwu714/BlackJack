// ---- THE DECK ----

const suits = ["♠", "♥", "♦", "♣"];
const cardNames = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const cardValues = [2,3,4,5,6,7,8,9,10,10,10,10,11];

let deck = [];
let playerHand = [];
let dealerHand = [];
const redSuits = ["♥", "♦"];
let gameOver = false;
let chips = 1000;
let bestChips = 1000;
let currentBet = 0;
let wins = 0;
let losses = 0;

function buildDeck() {
  deck = [];
  for (let s = 0; s < suits.length; s++) {
    for (let c = 0; c < cardNames.length; c++) {
      deck.push({
        suit: suits[s],
        name: cardNames[c],
        value: cardValues[c]
      });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function dealCard() {
  return deck.pop();
}

function getHandValue(hand) {
  let total = 0;
  let aces = 0;

  for (let i = 0; i < hand.length; i++) {
    total += hand[i].value;
    if (hand[i].name === "A") {
      aces++;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function displayHands() {
  let playerDiv = document.getElementById("player-cards");
  let dealerDiv = document.getElementById("dealer-cards");

  playerDiv.innerHTML = "";
  dealerDiv.innerHTML = "";

  for (let i = 0; i < playerHand.length; i++) {
    let redSuits = ["♥", "♦"];
    let playerColor = redSuits.includes(playerHand[i].suit) ? "card red" : "card";
    playerDiv.innerHTML += "<span class='" + playerColor + "'>" + playerHand[i].name + playerHand[i].suit + "</span>";
  }

  for (let i = 0; i < dealerHand.length; i++) {
    if (i === 1 && !gameOver) {
      dealerDiv.innerHTML += "<span class='card hidden-card'>?</span>";
    } else {
      let dealerColor = redSuits.includes(dealerHand[i].suit) ? "card red" : "card";
      dealerDiv.innerHTML += "<span class='" + dealerColor + "'>" + dealerHand[i].name + dealerHand[i].suit + "</span>";
    }
  }

  document.getElementById("player-score").innerText = getHandValue(playerHand);
  if (gameOver) {
    document.getElementById("dealer-score").innerText = getHandValue(dealerHand);
  } else {
    document.getElementById("dealer-score").innerText = "?";
  }
}

function setButtons(playing) {
  document.getElementById("hit-btn").disabled = !playing;
  document.getElementById("stand-btn").disabled = !playing;
  document.getElementById("double-btn").disabled = !playing;
}

function placeBet() {
  if (chips <= 0) {
    document.getElementById("message").innerText = "You're out of chips! Reset to play again.";
    document.getElementById("message").className = "message-lose";
    document.getElementById("bet-controls").style.display = "none";
    return;
  }
  let amount = parseInt(document.getElementById("bet-slider").value);
  if (amount > chips) {
    document.getElementById("message").innerText = "Not enough chips!";
    return;
  }
  currentBet = amount;
  document.getElementById("chip-count").innerText = chips;
  document.getElementById("bet-amount").innerText = currentBet;
}

function clearBet() {
  currentBet = 0;
  document.getElementById("bet-amount").innerText = 0;
}

function updateChips(result) {
  if (result === "win") {
    chips += currentBet;
    wins++;
    document.getElementById("win-count").innerText = wins;
  } else if (result === "blackjack") {
    chips += Math.floor(currentBet * 1.5);
    wins++;
    document.getElementById("win-count").innerText = wins;
  } else if (result === "lose") {
    chips -= currentBet;
    losses++;
    document.getElementById("loss-count").innerText = losses;
  }
  currentBet = 0;
  document.getElementById("chip-count").innerText = chips;
  document.getElementById("bet-amount").innerText = 0;
  if (chips > bestChips) {
    bestChips = chips;
    localStorage.setItem("bestChips", bestChips);
  }
  updateLeaderboard();
  if (chips <= 0) {
    chips = 0;
    document.getElementById("chip-count").innerText = 0;
    document.getElementById("message").innerText = "You're out of chips! Reset to play again.";
    document.getElementById("message").className = "message-lose";
    document.getElementById("bet-controls").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("new-game-controls").style.display = "block";
  } else {
    document.getElementById("bet-slider").max = chips;
  }
  saveStats();
}

function newGame() {
  if (currentBet === 0) {
    document.getElementById("message").innerText = "Place a bet first!";
    return;
  }
  gameOver = false;
  buildDeck();
  shuffleDeck();
  playerHand = [];
  dealerHand = [];

  playerHand.push(dealCard());
  playerHand.push(dealCard());
  dealerHand.push(dealCard());
  dealerHand.push(dealCard());

  document.getElementById("message").innerText = "Your move — Hit or Stand?";
  if (getHandValue(playerHand) === 21) {
    document.getElementById("message").innerText = "Blackjack! You win!";
    document.getElementById("message").className = "message-win";
    updateChips("blackjack");
    setButtons(false);
    gameOver = true;
    setStage("gameover");
    return;
  }
  document.getElementById("message").className = "";
  displayHands();
  setButtons(true);
  setStage("playing");
}

function hit() {
  playerHand.push(dealCard());
  displayHands();

  if (getHandValue(playerHand) > 21) {
    document.getElementById("message").innerText = "Bust! You lose.";
    document.getElementById("message").className = "message-lose";
    setButtons(false);
    updateChips("lose");
    setStage("gameover");
  }
}

function doubleDown() {
  if (currentBet > chips) {
    document.getElementById("message").innerText = "Not enough chips to double down!";
    return;
  }
  currentBet *= 2;
  document.getElementById("bet-amount").innerText = currentBet;
  playerHand.push(dealCard());
  displayHands();

  if (getHandValue(playerHand) > 21) {
    document.getElementById("message").innerText = "Bust! You lose.";
    document.getElementById("message").className = "message-lose";
    setButtons(false);
    updateChips("lose");
  } else {
    stand();
  }
}

function stand() {
  gameOver = true;
  setButtons(false);
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(dealCard());
  }
  displayHands();

  let playerTotal = getHandValue(playerHand);
  let dealerTotal = getHandValue(dealerHand);

  if (dealerTotal > 21) {
    document.getElementById("message").innerText = "Dealer busts! You win!";
    document.getElementById("message").className = "message-win";
    updateChips("win");
  } else if (playerTotal > dealerTotal) {
    document.getElementById("message").innerText = "You win!";
    document.getElementById("message").className = "message-win";
    updateChips("win");
  } else if (playerTotal < dealerTotal) {
    document.getElementById("message").innerText = "Dealer wins.";
    document.getElementById("message").className = "message-lose";
    updateChips("lose");
  } else {
    document.getElementById("message").innerText = "Push — it's a tie!";
    document.getElementById("message").className = "message-tie";
    updateChips("tie");
  }
  setStage("gameover");
}

function saveStats() {
  localStorage.setItem("chips", chips);
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.setItem("bestChips", bestChips);
}

function loadStats() {
  let savedChips = localStorage.getItem("chips");
  let savedWins = localStorage.getItem("wins");
  let savedLosses = localStorage.getItem("losses");
  let savedBestChips = localStorage.getItem("bestChips");

  if (savedChips !== null) {
    chips = parseInt(savedChips);
    document.getElementById("chip-count").innerText = chips;
  }
  if (savedWins !== null) {
    wins = parseInt(savedWins);
    document.getElementById("win-count").innerText = wins;
  }
  if (savedLosses !== null) {
    losses = parseInt(savedLosses);
    document.getElementById("loss-count").innerText = losses;
  }
  if (savedBestChips !== null) {
    bestChips = parseInt(savedBestChips);
  }
  let savedName = localStorage.getItem("playerName");
  if (savedName !== null) {
    document.getElementById("player-name").value = savedName;
    document.getElementById("welcome-msg").innerText = "Welcome back, " + savedName + "!";
    document.getElementById("player-area").querySelector("h2").innerText = savedName;
    document.getElementById("name-area").style.display = "none";
  }
  let savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  displayLeaderboard(savedLeaderboard);
  document.getElementById("bet-slider").max = chips;
}

function resetStats() {
  chips = 1000;
  wins = 0;
  losses = 0;
  currentBet = 0;
  localStorage.setItem("chips", chips);
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.removeItem("leaderboard");
  document.getElementById("chip-count").innerText = chips;
  document.getElementById("win-count").innerText = wins;
  document.getElementById("loss-count").innerText = losses;
  document.getElementById("bet-amount").innerText = 0;
  document.getElementById("message").innerText = "Stats reset! Place a bet to start.";
  document.getElementById("bet-slider").max = chips;
  setStage("betting");
}

function setName() {
  let name = document.getElementById("player-name").value;
  if (name === "") {
    document.getElementById("welcome-msg").innerText = "Please enter a name!";
    return;
  }
  localStorage.setItem("playerName", name);
  document.getElementById("welcome-msg").innerText = "Welcome, " + name + "!";
  document.getElementById("player-area").querySelector("h2").innerText = name;
  document.getElementById("name-area").style.display = "none";
}

function updateLeaderboard() {
  let name = localStorage.getItem("playerName") || "Anonymous";
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  leaderboard = leaderboard.filter(entry => entry.name !== name);

  let best = chips > bestChips ? chips : bestChips;

  leaderboard.push({ name: name, chips: chips, best: best });
  leaderboard.sort((a, b) => b.best - a.best);
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
  let list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  for (let i = 0; i < leaderboard.length; i++) {
    list.innerHTML += "<li><span>" + (i + 1) + ". " + leaderboard[i].name + "</span><span>Best: " + leaderboard[i].best + " | Now: " + leaderboard[i].chips + "</span></li>";
  }
}

function setStage(stage) {
  let betControls = document.getElementById("bet-controls");
  let controls = document.getElementById("controls");
  let newGameControls = document.getElementById("new-game-controls");

  if (stage === "betting") {
    betControls.style.display = "block";
    controls.style.display = "none";
    newGameControls.style.display = "block";
  } else if (stage === "playing") {
    betControls.style.display = "none";
    controls.style.display = "block";
    newGameControls.style.display = "none";
  } else if (stage === "gameover") {
    betControls.style.display = "block";
    controls.style.display = "none";
    newGameControls.style.display = "block";
  }
}

document.getElementById("bet-slider").addEventListener("input", function() {
  document.getElementById("slider-value").innerText = this.value;
});

document.getElementById("slider-value").innerText = document.getElementById("bet-slider").value;
setStage("betting");
loadStats();