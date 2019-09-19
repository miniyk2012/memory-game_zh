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

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
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

class Deck {
    constructor(debug = false) {
        this.debug = debug;
        this.clock = new Clock();
        this.deck = document.querySelector('.deck');
        this.restartButton = document.querySelector('.restart');
        this.init();
        this.init_deck2();
    }

    init() {
        this.firstCard = undefined;
        this.secondCard = undefined;
        this.total_match_num = 0;
        this.move = 0;
        this.canPlay = true;
        document.querySelector('.moves').textContent = this.move;
        this.clock.reset();
        this.clock.resume();
    }

    init_deck2() {

        if (!this.debug) {
            return;
        }
        if (this.deck.nextSibling)
            this.deck.nextSibling.remove();
        if (this.deck.nextSibling)
            this.deck.nextSibling.remove();
        let answerHeader = htmlToElement('<h1>Answer</h1>');
        let deck2 = htmlToElement('<ul class="deck" id="deck2"></ul>');
        this.deck.parentNode.insertBefore(deck2, this.deck.nextSibling);
        this.deck.parentNode.insertBefore(answerHeader, this.deck.nextSibling);
        let cards = this.deck.querySelectorAll('.card');
        let arrayCards = Array.prototype.slice.call(cards);
        deck2.innerHTML = '';
        for (let i = 0; i < arrayCards.length; i++) {
            let newCard = arrayCards[i].cloneNode(true);
            this.turnOnCard(newCard);
            deck2.appendChild(newCard);
        }
    }

    matchCard() {
        let category1 = this.firstCard.firstElementChild;
        let category2 = this.secondCard.firstElementChild;
        return category1.classList[1] === category2.classList[1];
    }

    hasMatched(card) {
        if (card == undefined)
            return false;
        return card.classList.contains('match');
    }

    turnOnCard(card) {
        this.turnOffCard(card);
        card.classList.add('open');
        card.classList.add('show');
    }

    turnMatchCard(card) {
        this.turnOffCard(card);
        card.classList.add('match');
    }

    turnOffCard(card) {
        card.classList.remove('open');
        card.classList.remove('show');
        card.classList.remove('match');
    }

    turnOffAfter(number) {
        setTimeout(() => {
            if (this.hasMatched(this.firstCard) || this.hasMatched(this.secondCard))
                return;
            if (this.firstCard != undefined)
                this.turnOffCard(this.firstCard);
            if (this.secondCard != undefined)
                this.turnOffCard(this.secondCard);
            this.firstCard = this.secondCard = undefined;
            this.canPlay = true;
        }, number);
    }

    shuffleCards() {
        this.init();
        let cards = this.deck.querySelectorAll('.card');
        cards.forEach((card) => {
            this.turnOffCard(card);
        })
        let arrayCards = Array.prototype.slice.call(cards);
        shuffle(arrayCards);
        this.deck.innerHTML = '';
        for (let i = 0; i < arrayCards.length; i++) {
            this.deck.appendChild(arrayCards[i]);
        }
        this.init_deck2();
    }

    /**
     * 处理点击到的那张卡片
     * @param {HTMLLIElement} card 
     */
    handleCard(card) {
        if (!this.canPlay) {
            return;
        }
        this.turnOnCard(card);
        if (this.firstCard === undefined) {
            this.firstCard = card;
            this.turnOffAfter(1000);
        } else {
            this.secondCard = card;
            this.canPlay = false;
            if (this.matchCard()) {
                this.turnMatchCard(this.firstCard);
                this.turnMatchCard(this.secondCard);
                this.firstCard = this.secondCard = undefined;
                this.canPlay = true;
                this.total_match_num += 2;
                if (this.total_match_num == 16) {
                    this.congratulations();
                }
            }
        }
    }

    congratulations() {
        setTimeout(() => {
            this.clock.stop();
            swal('你赢了!', `你总共走了${this.move}步, 耗时${this.clock.toStr()}.`, 'success');
        }, 250);
    }


    canClick(card) {
        if (!card.className.includes('card')) {
            return false;
        }
        if (card.classList.contains('match') || card.classList.contains('show')) {
            return false;
        }
        return true;
    }

    addMove() {
        if (!this.canPlay) {
            return;
        }
        this.move += 1;
        document.querySelector('.moves').textContent = this.move;
    }

    /**
     * 点击卡片时, 触发翻牌动作
     * @param {*} evt 
     */
    selectOneCard(evt) {
        let card = evt.target;
        if (!this.canClick(card)) {
            return;
        }
        this.addMove();
        this.handleCard(card);
    }

    addListeners() {
        this.restartButton.addEventListener('click', (evt) => {
            this.shuffleCards(evt)
        });
        this.deck.addEventListener('click', (evt) => {
            this.selectOneCard(evt)
        });
    }

}

class Clock {
    constructor() {
        this.elapseTime = 0;
        this.intervalID = undefined;
        this.clockNode = document.querySelector('.clock');
    }

    reset() {
        this.elapseTime = 0;
        this.clockNode.textContent = this.toStr();
        clearInterval(this.intervalID);
    }

    stop() {
        clearInterval(this.intervalID);
    }

    elapse(seconds) {
        this.elapseTime += seconds;
    }

    toStr() {
        return `${this.elapseTime} s`
    }

    resume() {
        let interval = 1000;
        let self = this;
        this.intervalID = window.setInterval(function () {
            self.elapse(interval/1000);
            self.clockNode.textContent = self.toStr();
        }, interval);
    }
}

let deck = new Deck(true);
deck.addListeners();