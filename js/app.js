/*
 * 创建一个包含所有卡片的数组
 */


/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
let openCard;

function matchCard(card1, card2) {
    let category1 = card1.firstElementChild;
    let category2 = card2.firstElementChild;
    if (!card1.classList.contains('open') || !card2.classList.contains('open')) {
        return false;
    }
    return category1.classList[1] === category2.classList[1];
}

function turnOnCard(card) {
    turnOffCard(card);
    card.classList.add('open');
    card.classList.add('show');
}

function turnOffCard(card) {
    card.classList.remove('open');
    card.classList.remove('show');
    card.classList.remove('match');
}

function turnOffAfter(card, number) {
    setTimeout(() => {
        if (card.classList.contains('open')) {
            turnOffCard(card);
        }
    }, number);
}

function turnOffBothAfter(card1, card2, number) {
    setTimeout(() => {
        if (card1.classList.contains('open')) {
            turnOffCard(card1);
        }
        if (card2.classList.contains('open')) {
            turnOffCard(card2);
        }
    }, number);
}

function turnMatchCard(card) {
    turnOffCard(card);
    card.classList.add('match');
}

function shuffleCards() {
    let deck = document.querySelector('.deck');
    let cards = deck.querySelectorAll('.card');
    let arrayCards = Array.prototype.slice.call(cards);
    shuffle(arrayCards);
    deck.innerHTML = '';
    for (let i = 0; i < arrayCards.length; i++) {
        deck.appendChild(arrayCards[i]);
    }
}

function selectOneCard(evt) {
    if (!evt.target.className.includes('card')) {
        return;
    }
    let card = evt.target;
    if (card.classList.contains('match') || card.classList.contains('show')) {
        return;
    }
    turnOnCard(card);
    if (openCard === undefined) {
        openCard = card;
        turnOffAfter(card, 1000);
    } else {
        if (matchCard(openCard, card)) {
            turnMatchCard(card);
            turnMatchCard(openCard);
        } else {
            turnOffBothAfter(card, openCard, 1000);
        }
        openCard = undefined;
    }

}

function addListeners() {
    let restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click', shuffleCards);
    let deck = document.querySelector('.deck');
    deck.addEventListener('click', selectOneCard);
}

addListeners();