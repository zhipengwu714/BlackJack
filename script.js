// ---- THE DECK ----

const suits = ["♠", "♥", "♦", "♣"];
const cardNames = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const cardValues = [2,3,4,5,6,7,8,9,10,10,10,10,11];

let deck = [];
let playerHand = [];
let dealerHand = [];

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