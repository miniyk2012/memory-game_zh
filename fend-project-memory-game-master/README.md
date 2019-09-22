# 老师的代码

这次审阅我就提一个意见：不要迷信面向对象编程。

你可能是一位初学者，或者之前习惯了面向对象式编程，但这种编程方式在很多时候并不是最优解，尤其是 JavaScript 这种支持多种编程范式的语言。面向对象编程编程会引入很多模板代码，导致程序不必要的复杂。这里我分享自己的实现给你，代码量几乎是你的一半，当然我缺少了你的动画功能，但是两相对比，相信你能有一些不一样的感受。

一些小技巧:
cards = [...symbols, ...symbols]; 类似于python的 cards = [*symbols, *symbols]
open_cards.length = 0;  将数组清空的很方便的写法
node.remove(); 删除自身.
有时候, js代码只考虑后端逻辑. 再写个setInterval去使用变量更新前端样式也是个好方法. 这样就不用时刻去考虑变量变化后, 就立刻改前端样式.


The game is built with plain HTML, CSS and JavaScript. Click the card to open it. Cards will flip over if the next card doesn't match with the open one. Your score will depend on moves taken to open all the cards. The less moves, the better.

## How to Play

You just need to open the `index.html` to let the fun begin~

## Dependencies

I build this game with native dom methods to keep the code clean. It doesn't depend any 3rd party libraries. No more jQuery and Boostrap. Just HTML, CSS and JavaScript! I find the new Udacity courses on ES6 is awesome!


