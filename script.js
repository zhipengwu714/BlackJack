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
let currentBet = 0;

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
  document.getElementById("dealer-score").innerText = getHandValue(dealerHand);
}

function setButtons(playing) {
  document.getElementById("hit-btn").disabled = !playing;
  document.getElementById("stand-btn").disabled = !playing;
}

function placeBet(amount) {
  if (chips <= 0) {
    document.getElementById("message").innerText = "Out of chips! Refresh to restart.";
    return;
  }
  if (currentBet + amount > chips) {
    document.getElementById("message").innerText = "Not enough chips!";
    return;
  }
  currentBet += amount;
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
  } else if (result === "lose") {
    chips -= currentBet;
  }
  currentBet = 0;
  document.getElementById("chip-count").innerText = chips;
  document.getElementById("bet-amount").innerText = 0;
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
  displayHands();
  setButtons(true);
}

function hit() {
  playerHand.push(dealCard());
  displayHands();

  if (getHandValue(playerHand) > 21) {
    document.getElementById("message").innerText = "Bust! You lose.";
    setButtons(false);
    updateChips("lose");
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
    updateChips("win");
  } else if (playerTotal > dealerTotal) {
    document.getElementById("message").innerText = "You win!";
    updateChips("win");
  } else if (playerTotal < dealerTotal) {
    document.getElementById("message").innerText = "Dealer wins.";
    updateChips("lose");
  } else {
    document.getElementById("message").innerText = "Push — it's a tie!";
    updateChips("tie");
  }
}