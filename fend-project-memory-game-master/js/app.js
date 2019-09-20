/*
 * Create a list that holds all of your cards
 */
const symbols = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
                 "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
// spread operator to make an array of 16 cards
const cards = [...symbols, ...symbols];

const open_cards = [];

let moves = 0;
let seconds = 0;
let intervalID = null;

const winnerModal = document.getElementById("winner");
const winnerMessage = document.getElementById('winner-message');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCards(cards) {
    //initialize
    moves = 0;
    seconds = 0;
    // empty the open_cards array
    // credit to: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
    open_cards.length = 0;
    updateMoves(moves);
    updateTime(seconds);
    const shuffled_cards = shuffle(cards);
    const container = document.querySelector(".container");
    const deck = document.querySelector(".deck");

    // clear the deck first
    deck && deck.remove();
    const newDeck = document.createElement("ul");
    newDeck.className = "deck";
    
    // build cards
    for (const card of cards) {
        const li = document.createElement("li");
        li.className = "card";
        li.innerHTML = `<i class="fa ${card}"></i>`;

        newDeck.appendChild(li);
    }
    container.appendChild(newDeck);
}

 function addListeners() {
    //avoid to add too many listeners with event delegation
    const deck = document.querySelector(".deck");
    deck.addEventListener("click", function(event) {
        const target = event.target;
        if (target.tagName.toLowerCase() === "li" && !open_cards.includes(target)) {
            flipCard(target);
            // start timer when first click
            if (moves === 0 && open_cards.length === 0) {
                startTimer();
            }
            if (open_cards.length % 2 === 0) {
                open_cards.push(target);
            }
            else {
                moves += 1;
                if (isMatch(target)) {
                    // TODO: add some animation when match.
                    open_cards.push(target);
                    if (open_cards.length === 16) {
                        const [m, s] = convertTime(seconds);
                        setTimeout(() => {
                            clearInterval(intervalID);
                            winnerModal.style.display = "block";
                            winnerMessage.textContent = `You Win the game with ${moves} moves within ${m} minutes and ${s} seconds! You get ${rate(moves)} starts our of 3.`;
                        }, 500);
                    };
                }
                else {
                    const card = open_cards.pop();
                    setTimeout(() => {
                        // TODO: add some animation when unmatch.
                        flipCard(card);
                        flipCard(target);
                    }, 1000);
                }
            }
        }
    });

    const restartNode = document.querySelector(".restart");
    restartNode.addEventListener("click", restart)

    const playAgain = document.querySelector(".play-again");
    playAgain.addEventListener("click", () => {
        winnerModal.style.display = "none";
        restart();});
 }

 function startTimer() {
     intervalID = setInterval(function(){
         updateTime(++seconds);
         updateMoves(moves);
     }, 1000);
 }

 function updateTime(seconds) {
     const [m, s] = convertTime(seconds);
     const timer = document.querySelector(".timer");
     timer.textContent = `${m < 10 ? "0" + m: m}:${s < 10 ? "0" + s : s}`
 }

 function convertTime(seconds) {
     return [Math.floor(seconds / 60), seconds % 60];
 }

 function updateMoves(moves) {
    const movesNode = document.querySelector(".moves");
    movesNode.textContent = moves;
    updateStars(rate(moves));
 }

 function getCardName(target) {
    const i = target.firstElementChild;
    return i.classList[1]
 }

 function isMatch(card) {
    return getCardName(open_cards[open_cards.length - 1]) === getCardName(card);
 }

 function flipCard(card) {
    card.classList.toggle("open");
    card.classList.toggle("show");
 }

 function restart() {
    intervalID && clearInterval(intervalID);
    displayCards(cards);
    addListeners();
 }

 function rate(moves) {
     if (moves > 15) {
         return 1;
     }
     else if(moves > 10) {
         return 2;
     }
     else {
         return 3;
     }
 }

 function updateStars(stars) {
    const startList = document.querySelector(".stars");
    startList.innerHTML = "";
    for (let i = 0; i < stars; i++) {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa fa-star"></i>`;
        startList.appendChild(li);
    }
    for (let i = 0; i < 3 - stars; i++) {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa fa-star-o"></i>`;
        startList.appendChild(li);
    }
 }

 displayCards(cards);
 addListeners();
