/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOM/boards.js":
/*!***************************!*\
  !*** ./src/DOM/boards.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Boards {
  constructor(background, components) {
    this.container = this._boards(background);
    this.components = components;
  }
  _boards(background = this.background) {
    // Create boards wrapper element
    const boards = document.createElement("div");
    boards.classList.add("boards-container");
    boards.style.display = "none";
    background.append(boards);
    return boards;
  }
  _clear(container = this.container) {
    const length = container.children.length;
    for (let i = 0; i < length; i++) {
      container.firstChild.remove();
    }
  }
  _render(player, container = this.container) {
    const boardWrapper = document.createElement("div");
    boardWrapper.classList.add("board-wrapper");
    const playerBoard = document.createElement("div");
    playerBoard.classList.add("player-board");
    boardWrapper.append(playerBoard);
    container.append(boardWrapper);
    for (let i = 0; i < player.board.size; i++) {
      for (let j = 0; j < player.board.size; j++) {
        const square = document.createElement("div");
        square.classList.add(`x${j}y${i}`);
        square.classList.add("square");
        square.classList.add("not-allowed");
        square.addEventListener("mouseover", e => this.#squareHoover(e));
        square.addEventListener("mouseout", e => this.#squareMouseOut(e));
        square.addEventListener("click", e => this.#squareClick(e));
        playerBoard.append(square);
      }
    }
    return playerBoard;
  }
  _shipPlaced(index, axis, length, components = this.components) {
    const squares = components._findSquares(index, length, axis);
    squares.forEach(square => {
      square.classList.add("ship");
    });
  }
  #squareHoover(e, components = this.components) {
    const length = components._retrieveLength();
    const axis = components._retrieveAxis();
    let index = components._index(e.target.classList[0]);
    const squares = components._findSquares(index, length, axis);
    if (squares === false) {
      e.target.classList.add("red");
    } else {
      squares.forEach(square => {
        square.classList.remove("not-allowed");
        square.classList.add("allowed");
      });
    }
  }
  #squareMouseOut(e, components = this.components) {
    const length = components._retrieveLength();
    const axis = components._retrieveAxis();
    let index = components._index(e.target.classList[0]);
    const squares = components._findSquares(index, length, axis);
    if (squares === false) {
      e.target.classList.remove("red");
    } else {
      squares.forEach(square => {
        square.classList.remove("allowed");
        square.classList.add("not-allowed");
      });
    }
  }
  #squareClick(e, components = this.components) {
    if (e.target.classList.contains("ship") || e.target.classList.contains("not-allowed")) return;
    const ships = components.game.player1.ships;
    const index = components._index(e.target.classList[0]);
    const ship = ships.shift();
    const axis = components._retrieveAxis();
    components.game.player1.board.placeShip(ship, index.x, index.y, axis);
    this._shipPlaced(index, axis, ship.length);
    // if ships are empty - turn should start
    if (ships.length === 0) {
      this._clear();
      // initiate rendering of both player boards
      components.game.start();
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Boards);

/***/ }),

/***/ "./src/DOM/components.js":
/*!*******************************!*\
  !*** ./src/DOM/components.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header */ "./src/DOM/header.js");
/* harmony import */ var _boards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boards */ "./src/DOM/boards.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./footer */ "./src/DOM/footer.js");
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form */ "./src/DOM/form.js");




class Components {
  constructor(body) {
    this.body = body;
    this.background = this._background(body);
    this.header = new _header__WEBPACK_IMPORTED_MODULE_0__["default"](this.background, this);
    this.boards = new _boards__WEBPACK_IMPORTED_MODULE_1__["default"](this.background, this);
    this.form = new _form__WEBPACK_IMPORTED_MODULE_3__["default"](this.background, this);
    this.footer = new _footer__WEBPACK_IMPORTED_MODULE_2__["default"](this.background);
    this.game;
    this.axis;
    this.play;
  }
  _background(body) {
    // Create the game wrapper element
    const background = document.createElement("div");
    background.classList.add("wrapper");
    body.append(background);
    return background;
  }
  _axisButton(boards = this.boards) {
    const btn = document.createElement("button");
    btn.textContent = "Axis: X";
    btn.classList.add("btn");
    btn.addEventListener("click", e => this.#axisBtn(e, btn));
    boards.container.append(btn);
    this.axis = btn;
    return btn;
  }
  _findSquares(index, length, axis) {
    const squares = [];
    for (let i = 0; i < length; i++) {
      if (axis == "X") {
        const x = Number(index.x) + i;
        const square = document.querySelector(`.x${x}y${index.y}`);
        if (square) {
          squares.push(square);
        } else return false;
      } else if (axis == "Y") {
        const y = Number(index.y) + i;
        const square = document.querySelector(`.x${index.x}y${y}`);
        if (square) {
          squares.push(square);
        } else return false;
      }
    }
    return squares;
  }
  _retrieveAxis() {
    const btn = this.axis;
    let axis = btn.textContent[6];
    return axis;
  }
  _retrieveLength(game = this.game) {
    const ship = game.player1.ships[0];
    return ship.length;
  }
  _index(string) {
    string = {
      x: string[1],
      y: string[3]
    };
    return string;
  }
  updateShipCount(game = this.game) {
    const player1 = document.querySelector(".player-ships");
    const player2 = document.querySelector(".computer-ships");
    player1.textContent = `Ships left: ${this.checkShips(game.board1)}`;
    player2.textContent = `Ships left: ${this.checkShips(game.board2)}`;
  }
  checkShips(board) {
    const ships = board.ships;
    const arr = ships.filter(ship => {
      return ship.sunk === false;
    });
    return arr.length;
  }
  updateShipContent(game = this.game) {
    const ships = game.player2.board.ships;
    ships.forEach(ship => {
      if (ship.sunk === true) {
        for (let i = 0; i < ship.index.length; i++) {
          let index = ship.index[i];
          index = {
            x: index[0],
            y: index[1]
          };
          const squares = document.querySelectorAll(`.x${index.x}y${index.y}`);
          if (!squares[1].classList.contains("ship")) {
            setTimeout(() => {
              squares[1].classList.add("ship");
            }, 500);
          }
        }
      }
    });
  }
  _animate(element, text) {
    let index = 0;
    const delay = 100;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);
  }

  // Listeners

  #axisBtn(e, btn) {
    const text = btn.textContent;
    if (text == "Axis: X") {
      btn.textContent = "Axis: Y";
    } else {
      btn.textContent = "Axis: X";
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Components);

/***/ }),

/***/ "./src/DOM/footer.js":
/*!***************************!*\
  !*** ./src/DOM/footer.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Footer {
  constructor(background, components) {
    this.footer = this._footer(background);
  }
  _footer(background = this.background) {
    // Create footer element
    const footer = document.createElement("div");
    const paragraph = document.createElement("p");
    const anchor = document.createElement("a");
    footer.classList.add("footer");
    paragraph.textContent = "Created by ";
    paragraph.classList.add("footer-text");
    anchor.textContent = "CJski";
    anchor.target = "_blank";
    anchor.href = "https://github.com/CJskii/Battleship-game";
    paragraph.append(anchor);
    footer.append(paragraph);
    background.append(footer);
    return footer;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ }),

/***/ "./src/DOM/form.js":
/*!*************************!*\
  !*** ./src/DOM/form.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.js");

class Form {
  constructor(background, components) {
    this.components = components;
    this.form = this._nameForm(background);
  }
  _nameForm(background = this.background) {
    // Create form + label + input + submit elements
    const form = document.createElement("form");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const submit = document.createElement("button");
    const text = "Enter player name:";
    input.id = "name";
    input.placeholder = "Captain name...";
    input.addEventListener("keydown", e => this.#inputValidation(e, input));
    label.setAttribute("for", input);
    this.components._animate(label, text);
    submit.textContent = "Submit";
    submit.classList.add("btn");
    submit.addEventListener("click", e => this.#submitBtn(e, input));
    form.append(label);
    form.append(input);
    form.append(submit);
    background.append(form);
    input.setAttribute("autocomplete", "off");
    input.focus();
    return form;
  }
  #inputValidation(e, input) {
    const key = e.keyCode;
    if (key === 13) {
      this.#submitBtn(e, input);
    }
    // only letters, backspace, and delete
    if (key === 8 || key === 46 || key >= 65 && key <= 90 || key >= 97 && key <= 122) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }
  #submitBtn(e, input, form = this.form, components = this.components) {
    if (input.value == "") {
      input.placeholder = "You must enter name";
      e.preventDefault();
    } else if (input.value.length >= 12) {
      input.value = "";
      input.placeholder = "Too long - 12 characters allowed";
      e.preventDefault();
    } else {
      // call to index.js
      e.preventDefault();
      let name = input.value;
      name = name.charAt(0).toUpperCase() + name.substring(1);
      components.game = new _index__WEBPACK_IMPORTED_MODULE_0__["default"](name, this.components);
      form.remove();
      components.boards.container.style.display = "";
    }
    return input.value;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Form);

/***/ }),

/***/ "./src/DOM/game.js":
/*!*************************!*\
  !*** ./src/DOM/game.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Turn {
  constructor(game, background) {
    this.game = game;
    this.boards = background;
    this.header = this._renderHeader();
    this.board1 = this._renderBoard(game.player1);
    this.board2 = this._renderBoard(game.player2);
    this.stop = false;
    this.init = this.init();
  }
  init(game = this.game, board1 = this.board1, board2 = this.board2) {
    const player1 = game.board1.ships;
    const player2 = game.board2.ships;
    this._renderShips(board1, player1);
    //this._renderShips(board2, player2);
  }

  _renderHeader(background = this.boards.container) {
    const container = document.createElement("div");
    container.classList.add("header-wrapper");
    const header = document.createElement("h5");
    header.classList.add("header-turn");
    const text = "Make a move captain...";
    this.game.components._animate(header, text);
    container.appendChild(header);
    background.appendChild(container);
    return header;
  }
  _renderBoard(player, background = this.boards.container) {
    const container = document.createElement("div");
    container.classList.add("player-container");
    this._addPlayerName(player, container);
    this._addShipCount(player, container);
    const playerBoard = document.createElement("div");
    playerBoard.classList.add("player-board");
    playerBoard.classList.add(`${player.name}`);
    for (let i = 0; i < player.board.size; i++) {
      for (let j = 0; j < player.board.size; j++) {
        const square = document.createElement("div");
        square.classList.add(`x${j}y${i}`);
        square.classList.add("square");
        if (player.name == "Computer") {
          square.classList.add("target");
          square.addEventListener("click", e => this.#squareClick(e));
        }
        playerBoard.append(square);
      }
    }
    container.append(playerBoard);
    background.append(container);
    return playerBoard;
  }
  _addPlayerName(player, container) {
    const playerName = document.createElement("h5");
    playerName.classList.add("player-name");
    playerName.textContent = `${player.name}'s board`;
    container.append(playerName);
    return playerName;
  }
  _addShipCount(player, container) {
    const shipStatus = document.createElement("span");
    shipStatus.textContent = "Ships left: 5";
    shipStatus.classList = "ship-status";
    if (player.name == "Computer") {
      shipStatus.classList = "computer-ships";
    } else {
      shipStatus.classList = "player-ships";
    }
    container.append(shipStatus);
    return shipStatus;
  }
  _renderShips(board, ships) {
    ships.forEach(ship => {
      const axis = ship.axis;
      const length = ship.length;
      let index = ship.index[0];
      index = {
        x: index[0],
        y: index[1]
      };
      const squares = this._findSquares(index, length, axis, board);
      squares.forEach(square => {
        square.classList.add("ship");
      });
    });
  }
  _findSquares(index, length, axis, board) {
    const squares = [];
    for (let i = 0; i < length; i++) {
      if (axis == "X") {
        const x = Number(index.x) + i;
        const square = board.querySelector(`.x${x}y${index.y}`);
        if (square) {
          squares.push(square);
        } else return false;
      } else if (axis == "Y") {
        const y = Number(index.y) + i;
        const square = board.querySelector(`.x${index.x}y${y}`);
        if (square) {
          squares.push(square);
        } else return false;
      }
    }
    return squares;
  }
  _hitORmiss(index, target, board) {
    if (target == undefined) return;else if (target == "miss") {
      board = this._findSquare(index, board);
      this._missColor(board);
    } else if (target == "hit") {
      board = this._findSquare(index, board);
      this._hitColor(board);
    }
    board.classList.remove("target");
    board.classList.add("not-allowed");
  }
  _findSquare(index, board) {
    if (board == "Player") {
      board = this.board1;
    } else if (board == "Computer") {
      board = this.board2;
    }
    const square = board.querySelector(`.x${index.x}y${index.y}`);
    return square;
  }
  _missColor(square) {
    square.classList.add("miss");
  }
  _hitColor(square) {
    square.classList.add("hit");
  }
  stopGame() {
    this.stop = true;
  }
  #squareClick(e, game = this.game, stop = this.stop) {
    if (stop === true) return;
    const board = e.target.parentElement;
    const string = e.target.classList[0];
    const index = game.components._index(string);
    if (e.target.classList.contains("not-allowed")) return;else if (board.classList.contains("Computer")) {
      game.turn("Computer", index);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Turn);

/***/ }),

/***/ "./src/DOM/header.js":
/*!***************************!*\
  !*** ./src/DOM/header.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Header {
  constructor(background, components) {
    this.header = this._header(background);
    this.components = components;
  }
  _header(background) {
    // Create the title element
    const header = document.createElement("h1");
    header.textContent = "Battleship";
    header.classList.add("game-title");
    background.append(header);
    return header;
  }
  _render(player, components = this.components) {
    const header = document.createElement("h6");
    const text = `Captain ${player.name},<br> please place your ships`;
    header.classList.add("captain-header");
    //this._animate(header, text);
    header.innerHTML = `Captain ${player.name},<br> please place your ships`;
    components.boards.container.append(header);
    return header;
  }
  _animate(header, text) {
    //const text = "Make a move captain...";
    let index = 0;
    const delay = 100;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        header.innerHTML += text[index];
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/style.css */ "./src/styles/style.css");
/* harmony import */ var _DOM_components_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOM/components.js */ "./src/DOM/components.js");
/* harmony import */ var _objects_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/player */ "./src/objects/player.js");
/* harmony import */ var _objects_random__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/random */ "./src/objects/random.js");
/* harmony import */ var _DOM_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DOM/game */ "./src/DOM/game.js");





(function () {
  const body = document.body;
  const game = new _DOM_components_js__WEBPACK_IMPORTED_MODULE_1__["default"](body);
})();
class Game {
  constructor(player1, components) {
    this.player1 = new _objects_player__WEBPACK_IMPORTED_MODULE_2__["default"](player1);
    this.player2 = new _objects_player__WEBPACK_IMPORTED_MODULE_2__["default"]("Computer");
    this.board1 = this.player1.board;
    this.board2 = this.player2.board;
    this.computer = new _objects_random__WEBPACK_IMPORTED_MODULE_3__["default"](this.player2);
    this.components = components;
    this.loaded = this._init();
  }
  _init(components = this.components) {
    components.header._render(this.player1);
    components._axisButton();
    components.boards._render(this.player1);
  }
  start(background = this.components.boards) {
    this.components.play = new _DOM_game__WEBPACK_IMPORTED_MODULE_4__["default"](this, background);
  }
  turn(board, index, game = this.components.play, computer = this.computer) {
    if (board === "Player") {
      // logic for computer
      this.computerTurn(board, index, game, computer);
      const allShipsSunk = this.board1._areShipsSunk();
      if (allShipsSunk === true) {
        // print winner and stop the game
        this.printWinner(board);
        game.stopGame();
      }
    } else if (board === "Computer") {
      // logic for player
      const hit = this.player2.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      const allShipsSunk = this.board2._areShipsSunk();
      this.components.updateShipContent();
      if (allShipsSunk === true) {
        // print winner and stop the game
        this.printWinner(board);
        game.stopGame();
      } else {
        // if all ships are not sunk - computer will make random move
        this.turn("Player", index);
      }
    }
    this.components.updateShipCount();
  }
  computerTurn(board, index, game, computer) {
    // get random index and check if it is valid
    let lastHit = computer.lastHit;
    index = computer.randomCoords();
    let validMove = computer.isValidMove(index, this.board1);
    // if last hit wasn't miss - attempt to hit adjacent squares
    if (lastHit != 0) {
      // Hit adjacent square
      const nextMove = computer.adjacentMoves(lastHit, this.board1);
      if (nextMove != false) {
        // if next adjacent move is valid
        this.computerHit(nextMove, board, game, computer);
      } else {
        // if there's no valid adjacent moves call itself
        this.computerTurn(board, index, game, computer);
      }
    } else if (validMove === true) {
      // Hit random coords
      this.computerHit(index, board, game, computer);
    } else {
      // if index is invalid call itself to generate new random coords
      this.computerTurn(board, index, game, computer);
    }
  }
  computerHit(index, board, game, computer) {
    setTimeout(() => {
      let hit = this.player1.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      if (hit == "hit") {
        computer.lastHit = index;
        computer.missed = false;
      } else {
        computer.missed = true;
      }
    }, 500);
  }
  printWinner(string, game = this.components.play) {
    const text = this.evaluateWinner(string);
    game.header.textContent = "";
    this.components._animate(game.header, text);
  }
  evaluateWinner(string) {
    if (string == "Player") {
      return "You have lost, try again!";
    } else {
      return `${this.player1.name} has won!`;
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/objects/gameboard.js":
/*!**********************************!*\
  !*** ./src/objects/gameboard.js ***!
  \**********************************/
/***/ ((module) => {

class Gameboard {
  constructor() {
    this.size = 10;
    this.board = this._createBoard(this.size);
    this.missed = [];
    this.ships = [];
  }
  _createBoard(size) {
    const grid = Array(size).fill().map(() => Array(size).fill(0));
    return grid;
  }
  _areShipsSunk(ships = this.ships) {
    let arr = [];
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].sunk === false) {
        arr.push(false);
      }
    }
    if (arr.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  _isMissedAttack(x, y) {
    if (this.board[x][y] === 0) {
      return true;
    } else {
      return false;
    }
  }
  placeShip(ship, x, y, axis) {
    // check for axis from DOM
    this.ships.push(ship);
    x = Number(x);
    y = Number(y);
    if (axis == "X") {
      for (let i = 0; i < ship.length; i++) {
        ship.index.push([x + i, y]);
        this.board[x + i][y] = ship;
        ship.axis = axis;
      }
    } else if (axis == "Y") {
      for (let i = 0; i < ship.length; i++) {
        ship.index.push([x, y + i]);
        this.board[x][y + i] = ship;
        ship.axis = axis;
      }
    }
  }
  receiveAttack(x, y) {
    const ship = this.board[x][y];
    const missedAttack = this._isMissedAttack(x, y);
    if (ship != 0 && missedAttack === false) {
      ship.hit([x, y]);
      return "hit";
    } else {
      // check for duplicates
      const arrLookup = this.missed.filter(coords => {
        return coords[0] == x && coords[1] == y;
      });
      // if duplicate found do nothing
      if (arrLookup.length > 0) {
        return;
      }
      // if no duplicates push to missed array
      else {
        this.missed.push([x, y]); // push missed cords to miss array
        return "miss";
      }
    }
  }
}
module.exports = Gameboard;

/***/ }),

/***/ "./src/objects/player.js":
/*!*******************************!*\
  !*** ./src/objects/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/objects/gameboard.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_gameboard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/objects/ship.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ship__WEBPACK_IMPORTED_MODULE_1__);


class Player {
  constructor(name) {
    this.name = name;
    this.board = new (_gameboard__WEBPACK_IMPORTED_MODULE_0___default())();
    this.ships = [new (_ship__WEBPACK_IMPORTED_MODULE_1___default())(5), new (_ship__WEBPACK_IMPORTED_MODULE_1___default())(4), new (_ship__WEBPACK_IMPORTED_MODULE_1___default())(3), new (_ship__WEBPACK_IMPORTED_MODULE_1___default())(3), new (_ship__WEBPACK_IMPORTED_MODULE_1___default())(2)];
  }
  move(x, y) {
    return this.board.receiveAttack(x, y);
  }
  init(string) {
    if (!string) {
      console.log("render player 1");
    } else {
      console.log("render player 2");
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/objects/random.js":
/*!*******************************!*\
  !*** ./src/objects/random.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Random {
  constructor(player) {
    this.player = player;
    this.init = this.init();
    this.lastHit = 0;
    this.missed;
  }
  init(player = this.player) {
    const ship = player.ships.shift();
    const axis = this.randomAxis();
    if (!ship) return;
    this.placeShipRandom(ship, axis);
  }
  placeShipRandom(ship, axis) {
    const index = this.randomCoords();
    const isValidMove = this._isValidMove(ship, axis, index);
    if (isValidMove === false) {
      // generate new coords
      this.placeShipRandom(ship, axis);
    } else {
      // place ships here
      this.player.board.placeShip(ship, index.x, index.y, axis);
      this.init();
    }
  }
  _isValidMove(ship, axis, index, player = this.player) {
    const length = ship.length;
    const board = player.board.board;
    let arr = [];
    const x = Number(index.x);
    const y = Number(index.y);
    for (let i = 0; i < length; i++) {
      if (axis == "X") {
        const square = this._square([x + i], [y], board);
        if (square != 0 || square === false) {
          arr.push(false);
        }
      } else if (axis == "Y") {
        const square = this._square([x], [y + i], board);
        if (square != 0 || square === false) {
          arr.push(false);
        }
      }
    }
    if (arr.length == 0) return true;else return false;
  }
  _square(x, y, board) {
    if (x >= 0 && x < 10 && y < 10 && y >= 0) {
      let square = board[x][y];
      return square;
    } else {
      return false;
    }
  }
  randomCoords() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return {
      x,
      y
    };
  }
  randomAxis() {
    const axis = Math.floor(Math.random() * 10);
    if (axis > 5) {
      return "X";
    } else {
      return "Y";
    }
  }
  adjacentMoves(lastHit, board) {
    let moves = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const x = Number(lastHit.x);
    const y = Number(lastHit.y);
    let validMove;
    let nextMove;
    const object = board.board[x][y];
    const hits = this.compareHits(object);
    if (object.sunk === true) {
      this.lastHit = 0;
      return false;
    } else if (hits) {
      // calculate the next move here
      nextMove = this.estimateNextMove(hits, board);
      if (nextMove) return nextMove;else {
        if (hits.firstHit.x < hits.lastHit.x) {
          nextMove = {
            x: hits.firstHit.x - 1,
            y: hits.firstHit.y
          };
        } else if (hits.firstHit.x > hits.lastHit.x) {
          nextMove = {
            x: hits.firstHit.x + 1,
            y: hits.firstHit.y
          };
        } else if (hits.firstHit.y < hits.lastHit.y) {
          nextMove = {
            x: hits.firstHit.x,
            y: hits.firstHit.y - 1
          };
        } else if (hits.firstHit.x > hits.lastHit.x) {
          nextMove = {
            x: hits.firstHit.x,
            y: hits.firstHit.y + 1
          };
        }
        if (this.isValidMove(nextMove, board)) return nextMove;
      }
    }
    // if estimateNextMove is null
    for (let i = 0; i < moves.length; i++) {
      // calculate next move coords
      let nextX = x + Number(moves[i][0]);
      let nextY = y + Number(moves[i][1]);
      nextMove = {
        x: nextX,
        y: nextY
      };
      // check if next move will hit a ship
      validMove = this.isValidMove(nextMove, board);
      if (validMove === true) {
        return nextMove;
      }
    }
    // if there's no valid adjacent move
    if (validMove === false) {
      // reset lastHit
      this.lastHit = 0;
      // return false so computer can make callback on itself
      return false;
    }
  }
  estimateNextMove(hits, board) {
    let nextMove;
    if (hits.previousHit.x != hits.lastHit.x) {
      nextMove = this.estimateNextXMove(hits, board);
    } else if (hits.previousHit.y != hits.lastHit.y) {
      nextMove = this.estimateNextYMove(hits, board);
    }
    return nextMove;
  }
  estimateNextXMove(hits, board) {
    let nextMove;
    let x;
    if (hits.previousHit.x < hits.lastHit.x) {
      // computer is moving right
      x = hits.lastHit.x + 1;
    } else {
      // computer is moving left
      x = hits.lastHit.x - 1;
    }
    nextMove = {
      x,
      y: hits.lastHit.y
    };
    if (this.isValidMove(nextMove, board)) {
      return nextMove;
    } else {
      // next move in the same direction
      x = x + (x - hits.lastHit.x);
      nextMove = {
        x,
        y: hits.lastHit.y
      };
      if (this.isValidMove(nextMove, board)) {
        return nextMove;
      } else {
        // next move in the opposite direction
        x = x - 2 * (x - hits.lastHit.x);
        nextMove = {
          x,
          y: hits.lastHit.y
        };
        if (this.isValidMove(nextMove, board)) {
          return nextMove;
        }
      }
      // no move is found, return null
      return null;
    }
  }
  estimateNextYMove(hits, board) {
    let nextMove;
    let y;
    if (hits.previousHit.y < hits.lastHit.y) {
      // computer is moving down
      y = hits.lastHit.y + 1;
    } else {
      // computer is moving up
      y = hits.lastHit.y - 1;
    }
    nextMove = {
      x: hits.lastHit.x,
      y
    };
    if (this.isValidMove(nextMove, board)) {
      return nextMove;
    } else {
      // next move in the same direction
      y = y + (y - hits.lastHit.y);
      nextMove = {
        x: hits.lastHit.x,
        y
      };
      if (this.isValidMove(nextMove, board)) {
        return nextMove;
      } else {
        // next move in the opposite direction
        y = y - 2 * (y - hits.lastHit.y);
        nextMove = {
          x: hits.lastHit.x,
          y
        };
        if (this.isValidMove(nextMove, board)) {
          return nextMove;
        }
      }
    }
    // if no move is found, return null
    return null;
  }
  compareHits(object) {
    const length = object.hits.length;
    if (length >= 2) {
      let firstHit = object.hits[0];
      firstHit = {
        x: firstHit[0],
        y: firstHit[1]
      };
      let previousHit = object.hits[length - 2];
      previousHit = {
        x: previousHit[0],
        y: previousHit[1]
      };
      const lastHit = this.lastHit;
      const hits = {
        firstHit,
        lastHit,
        previousHit
      };
      return hits;
    }
  }
  isValidMove(index, board) {
    if (index.x >= 0 && index.x < 10 && index.y >= 0 && index.y < 10) {
      const move = board.board[index.x][index.y];
      const arr = [];
      let missed = this.checkMissedArray(index, board);
      if (missed === true) return false;
      if (move == "0" && missed === false) return true;else if (typeof move === "object") {
        move.hits.forEach(hit => {
          if (hit[0] == index.x && hit[1] == index.y) {
            arr.push(false);
          }
        });
        if (arr.length == 0) {
          return true;
        } else return false;
      }
    } else return false;
  }
  checkMissedArray(index, board) {
    const missedArray = board.missed;
    const isMissed = missedArray.filter(coords => {
      return coords[0] == index.x && coords[1] == index.y;
    });
    if (isMissed.length == 0) return false;else return true;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Random);

/***/ }),

/***/ "./src/objects/ship.js":
/*!*****************************!*\
  !*** ./src/objects/ship.js ***!
  \*****************************/
/***/ ((module) => {

class Ship {
  constructor(length) {
    this.length = length;
    this.hits = [];
    this.sunk = this._isSunk();
    this.index = [];
    // axis from DOM
  }

  _isSunk(length = this.length, hits = this.hits) {
    if (length === hits.length) return true;else return false;
  }
  hit(index) {
    const arrLookup = this.hits.filter(coords => {
      return coords[0] == index[0] && coords[1] == index[1];
    });
    if (arrLookup.length == 0) {
      this.hits.push(index);
    }
    this.sunk = this._isSunk();
    return this.hits;
  }
}
module.exports = Ship;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/style.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/PressStart2P-Regular.ttf */ "./src/styles/fonts/PressStart2P-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/Audiowide-Regular.ttf */ "./src/styles/fonts/Audiowide-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./img/background.jpg */ "./src/styles/img/background.jpg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ./img/patrol.svg */ "./src/styles/img/patrol.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --color-1: #1f75fe;\n  --color-1-dark: #004488;\n  --color-2: #a2bff2;\n  --color-3: #e6e6e6;\n  --color-4: #f97306;\n  --color-5: #c6b1d6;\n  --color-6: #c6d8af;\n  --border-radius: 5px;\n  font-size: 24px;\n  font-family: Audiowide, sans-serif;\n}\n\n@font-face {\n  font-family: Press-start;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n}\n\n@font-face {\n  font-family: Audiowide;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n}\n\n* {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  max-width: 100vw;\n  max-height: 100vh;\n  height: 100%;\n  width: 100%;\n}\n\nbody {\n  background-color: var(--color-1-dark);\n  min-height: 100vh;\n  max-width: 100vw;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n  background-size: cover;\n  background-position: center;\n}\n\n/* GAME WRAPPER */\n\n.wrapper {\n  width: 100vw;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.61);\n}\n\n/* HEADER */\n\n.game-title {\n  color: var(--color-4);\n  text-align: center;\n  font-size: 2.5rem;\n  padding-top: 1rem;\n  letter-spacing: 5px;\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\n.captain-header {\n  text-align: center;\n  font-size: 1.2rem;\n  color: var(--color-2);\n  letter-spacing: 2px;\n  animation: fade-in 4s;\n  padding: 0 0.2rem;\n}\n\n.header-wrapper {\n  background-color: #00448833;\n  width: 90%;\n  height: 100%;\n  border-radius: 5px;\n  border: 1px solid rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: var(--color-2);\n  font-family: Press-start;\n}\n\n.header-turn {\n  text-align: center;\n  color: var(--color-2);\n  letter-spacing: 2px;\n  border-radius: 50%;\n  animation: typing 1s linear infinite;\n  padding: 0.5rem;\n}\n\n/* BUTTONS */\n\n.btn {\n  box-shadow: inset 0px 1px 0px 0px #fce2c1;\n  background: linear-gradient(to bottom, #ffc477 5%, var(--color-4) 100%);\n  background-color: #ffc477;\n  border-radius: 6px;\n  border: 1px solid #eeb44f;\n  display: inline-block;\n  cursor: pointer;\n  color: #ffffff;\n  font-family: Arial;\n  font-size: 15px;\n  font-weight: bold;\n  padding: 6px 24px;\n  text-decoration: none;\n  text-shadow: 0px 1px 0px #cc9f52;\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 3s, 3s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\n.btn:hover {\n  background: linear-gradient(to bottom, #fb9e25 5%, #ffc477 100%);\n  background-color: #fb9e25;\n}\n.btn:active {\n  position: relative;\n  top: 1px;\n}\n\n/* NAME FORM */\n\nform {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 60vh;\n  width: 100vw;\n  gap: 25px;\n}\n\nlabel {\n  font-size: 1.2rem;\n  color: var(--color-3);\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 1s;\n  animation-timing-function: ease-in-out, ease-out;\n  font-family: Press-start;\n}\n\ninput {\n  width: 90vw;\n  height: 8vh;\n  font-size: 1.2rem;\n  background-color: transparent;\n  outline: none;\n  border: 1px solid rgba(255, 255, 255, 0.137);\n  text-align: center;\n  color: var(--color-3);\n  border-radius: var(--border-radius);\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\ninput:focus {\n  border: 1px solid rgb(255, 255, 255);\n}\n\ninput::placeholder {\n  text-align: center;\n  font-size: 1.2rem;\n}\n\n/* PLAYER BOARDS */\n\n.boards-container {\n  width: 100vw;\n  height: 100%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  row-gap: 10px;\n  margin: 1rem 0px;\n}\n\n.player-board {\n  display: grid;\n  grid-template-columns: repeat(10, 25px);\n  grid-template-rows: repeat(10, 25px);\n  gap: 3px;\n  width: 100%;\n  height: 100%;\n  background: #00448848;\n  border-radius: 16px;\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10.1px);\n  -webkit-backdrop-filter: blur(10.1px);\n  animation-name: slide-in, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n  justify-self: center;\n}\n\n.square {\n  width: 25px;\n  height: 25px;\n  border: 2px solid rgba(255, 255, 255, 0.5);\n  border-radius: 2px;\n  transition-duration: 1s;\n  transition: ease-in-out 0.3s;\n}\n\nspan {\n  font-size: 0.8rem;\n  padding-bottom: 0.2rem;\n  color: var(--color-2);\n}\n\n.not-allowed {\n  cursor: not-allowed;\n}\n\n.allowed {\n  cursor: pointer;\n  background-color: rgba(153, 205, 50, 0.5);\n}\n\n.red {\n  background-color: rgba(255, 0, 0, 0.7);\n}\n\n.ship {\n  background-color: rgba(0, 183, 255, 0.521);\n  cursor: no-drop;\n  content: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ");\n}\n\n.player-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  justify-self: center;\n}\n\n.player-name {\n  padding-bottom: 0.3rem;\n  color: var(--color-3);\n  letter-spacing: 2px;\n  font-size: 1rem;\n  animation: fade-in 4s;\n}\n\n.target {\n  cursor: crosshair;\n}\n\n.target:hover {\n  background-color: var(--color-1);\n}\n\n.hit {\n  background-color: red;\n  border-radius: 50px;\n}\n\n.miss {\n  background-color: grey;\n}\n\n/* FOOTER */\n\n.footer {\n  font-size: 0.6rem;\n  text-align: center;\n  background-color: #c6b1d67e;\n  width: 100%;\n  height: 5vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  animation: fade-in 2s;\n  font-family: Press-start;\n  background: #00448816;\n  border-radius: 16px;\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10.1px);\n  -webkit-backdrop-filter: blur(10.1px);\n}\n\na {\n  text-decoration: none;\n  cursor: pointer;\n  color: var(--color-6);\n}\n\na:hover {\n  color: var(--color-4);\n}\n.footer-text {\n  color: var(--color-5);\n}\n\n@keyframes slide-in {\n  from {\n    transform: translateX(-50%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes slide-in-top {\n  from {\n    transform: translateY(-100%);\n  }\n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-in-bottom {\n  from {\n    transform: translateY(0);\n  }\n  to {\n    transform: translateY(-100%);\n  }\n}\n\n/* MEDIA QUERY */\n\n@media (max-width: 426px) {\n  .wrapper {\n    background-color: rgba(0, 0, 0, 0.804);\n  }\n}\n\n@media (max-width: 319px) {\n  .wrapper {\n    display: none;\n  }\n\n  body {\n    background: black;\n  }\n}\n\n@media (max-width: 426px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 35px);\n    grid-template-rows: repeat(10, 35px);\n  }\n\n  .square {\n    width: 35px;\n    height: 35px;\n  }\n\n  .game-title {\n    font-size: 1.6rem;\n  }\n\n  .captain-header {\n    font-size: 1rem;\n  }\n\n  label {\n    font-size: 1rem;\n    text-align: center;\n  }\n}\n\n@media (max-width: 376px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .game-title {\n    font-size: 1.5rem;\n  }\n}\n\n@media (min-width: 768px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n    width: fit-content;\n  }\n\n  .board-wrapper {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    grid-column: 1/ -1;\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .boards-container {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }\n\n  .header-wrapper {\n    grid-area: 1 / 1 / 2/ 3;\n  }\n  .captain-header {\n    grid-area: 1/ 1 / 2 / 3;\n  }\n\n  .btn {\n    grid-area: 2 / 1 / 3 / 3;\n  }\n\n  input {\n    width: 70%;\n  }\n}\n\n@media (min-width: 1024px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n    width: fit-content;\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .boards-container {\n    gap: 25px;\n  }\n\n  input {\n    width: 50%;\n  }\n\n  .footer {\n    font-size: 1.1rem;\n  }\n}\n\n@media (min-width: 1440px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 45px);\n    grid-template-rows: repeat(10, 45px);\n    width: fit-content;\n  }\n\n  .square {\n    width: 45px;\n    height: 45px;\n  }\n\n  .captain-header {\n    font-size: 1.5rem;\n  }\n\n  .player-name {\n    font-size: 1.5rem;\n  }\n\n  span {\n    font-size: 1.3rem;\n  }\n\n  .header-turn {\n    font-size: 1.3rem;\n  }\n}\n\n@media (min-width: 2560px) {\n  .game-title {\n    font-size: 5rem;\n  }\n\n  label,\n  input,\n  input::placeholder,\n  .captain-header {\n    font-size: 3rem;\n  }\n\n  .btn {\n    font-size: 2rem;\n    padding: 1rem;\n  }\n\n  .footer {\n    font-size: 2.5rem;\n  }\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 70px);\n    grid-template-rows: repeat(10, 70px);\n    width: fit-content;\n    gap: 7px;\n  }\n\n  .square {\n    width: 70px;\n    height: 70px;\n  }\n\n  .player-name {\n    font-size: 2.8rem;\n  }\n\n  span {\n    font-size: 2.2rem;\n  }\n\n  .header-turn {\n    font-size: 2.6rem;\n  }\n}\n", "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"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","sourcesContent":[":root {\n  --color-1: #1f75fe;\n  --color-1-dark: #004488;\n  --color-2: #a2bff2;\n  --color-3: #e6e6e6;\n  --color-4: #f97306;\n  --color-5: #c6b1d6;\n  --color-6: #c6d8af;\n  --border-radius: 5px;\n  font-size: 24px;\n  font-family: Audiowide, sans-serif;\n}\n\n@font-face {\n  font-family: Press-start;\n  src: url(./fonts/PressStart2P-Regular.ttf);\n}\n\n@font-face {\n  font-family: Audiowide;\n  src: url(./fonts/Audiowide-Regular.ttf);\n}\n\n* {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  max-width: 100vw;\n  max-height: 100vh;\n  height: 100%;\n  width: 100%;\n}\n\nbody {\n  background-color: var(--color-1-dark);\n  min-height: 100vh;\n  max-width: 100vw;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: url(./img/background.jpg);\n  background-size: cover;\n  background-position: center;\n}\n\n/* GAME WRAPPER */\n\n.wrapper {\n  width: 100vw;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.61);\n}\n\n/* HEADER */\n\n.game-title {\n  color: var(--color-4);\n  text-align: center;\n  font-size: 2.5rem;\n  padding-top: 1rem;\n  letter-spacing: 5px;\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\n.captain-header {\n  text-align: center;\n  font-size: 1.2rem;\n  color: var(--color-2);\n  letter-spacing: 2px;\n  animation: fade-in 4s;\n  padding: 0 0.2rem;\n}\n\n.header-wrapper {\n  background-color: #00448833;\n  width: 90%;\n  height: 100%;\n  border-radius: 5px;\n  border: 1px solid rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: var(--color-2);\n  font-family: Press-start;\n}\n\n.header-turn {\n  text-align: center;\n  color: var(--color-2);\n  letter-spacing: 2px;\n  border-radius: 50%;\n  animation: typing 1s linear infinite;\n  padding: 0.5rem;\n}\n\n/* BUTTONS */\n\n.btn {\n  box-shadow: inset 0px 1px 0px 0px #fce2c1;\n  background: linear-gradient(to bottom, #ffc477 5%, var(--color-4) 100%);\n  background-color: #ffc477;\n  border-radius: 6px;\n  border: 1px solid #eeb44f;\n  display: inline-block;\n  cursor: pointer;\n  color: #ffffff;\n  font-family: Arial;\n  font-size: 15px;\n  font-weight: bold;\n  padding: 6px 24px;\n  text-decoration: none;\n  text-shadow: 0px 1px 0px #cc9f52;\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 3s, 3s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\n.btn:hover {\n  background: linear-gradient(to bottom, #fb9e25 5%, #ffc477 100%);\n  background-color: #fb9e25;\n}\n.btn:active {\n  position: relative;\n  top: 1px;\n}\n\n/* NAME FORM */\n\nform {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 60vh;\n  width: 100vw;\n  gap: 25px;\n}\n\nlabel {\n  font-size: 1.2rem;\n  color: var(--color-3);\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 1s;\n  animation-timing-function: ease-in-out, ease-out;\n  font-family: Press-start;\n}\n\ninput {\n  width: 90vw;\n  height: 8vh;\n  font-size: 1.2rem;\n  background-color: transparent;\n  outline: none;\n  border: 1px solid rgba(255, 255, 255, 0.137);\n  text-align: center;\n  color: var(--color-3);\n  border-radius: var(--border-radius);\n  animation-name: slide-in-top, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n}\n\ninput:focus {\n  border: 1px solid rgb(255, 255, 255);\n}\n\ninput::placeholder {\n  text-align: center;\n  font-size: 1.2rem;\n}\n\n/* PLAYER BOARDS */\n\n.boards-container {\n  width: 100vw;\n  height: 100%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  row-gap: 10px;\n  margin: 1rem 0px;\n}\n\n.player-board {\n  display: grid;\n  grid-template-columns: repeat(10, 25px);\n  grid-template-rows: repeat(10, 25px);\n  gap: 3px;\n  width: 100%;\n  height: 100%;\n  background: #00448848;\n  border-radius: 16px;\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10.1px);\n  -webkit-backdrop-filter: blur(10.1px);\n  animation-name: slide-in, fade-in;\n  animation-duration: 1s, 2s;\n  animation-timing-function: ease-in-out, ease-out;\n  justify-self: center;\n}\n\n.square {\n  width: 25px;\n  height: 25px;\n  border: 2px solid rgba(255, 255, 255, 0.5);\n  border-radius: 2px;\n  transition-duration: 1s;\n  transition: ease-in-out 0.3s;\n}\n\nspan {\n  font-size: 0.8rem;\n  padding-bottom: 0.2rem;\n  color: var(--color-2);\n}\n\n.not-allowed {\n  cursor: not-allowed;\n}\n\n.allowed {\n  cursor: pointer;\n  background-color: rgba(153, 205, 50, 0.5);\n}\n\n.red {\n  background-color: rgba(255, 0, 0, 0.7);\n}\n\n.ship {\n  background-color: rgba(0, 183, 255, 0.521);\n  cursor: no-drop;\n  content: url(./img/patrol.svg);\n}\n\n.player-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  justify-self: center;\n}\n\n.player-name {\n  padding-bottom: 0.3rem;\n  color: var(--color-3);\n  letter-spacing: 2px;\n  font-size: 1rem;\n  animation: fade-in 4s;\n}\n\n.target {\n  cursor: crosshair;\n}\n\n.target:hover {\n  background-color: var(--color-1);\n}\n\n.hit {\n  background-color: red;\n  border-radius: 50px;\n}\n\n.miss {\n  background-color: grey;\n}\n\n/* FOOTER */\n\n.footer {\n  font-size: 0.6rem;\n  text-align: center;\n  background-color: #c6b1d67e;\n  width: 100%;\n  height: 5vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  animation: fade-in 2s;\n  font-family: Press-start;\n  background: #00448816;\n  border-radius: 16px;\n  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10.1px);\n  -webkit-backdrop-filter: blur(10.1px);\n}\n\na {\n  text-decoration: none;\n  cursor: pointer;\n  color: var(--color-6);\n}\n\na:hover {\n  color: var(--color-4);\n}\n.footer-text {\n  color: var(--color-5);\n}\n\n@keyframes slide-in {\n  from {\n    transform: translateX(-50%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes slide-in-top {\n  from {\n    transform: translateY(-100%);\n  }\n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-in-bottom {\n  from {\n    transform: translateY(0);\n  }\n  to {\n    transform: translateY(-100%);\n  }\n}\n\n/* MEDIA QUERY */\n\n@media (max-width: 426px) {\n  .wrapper {\n    background-color: rgba(0, 0, 0, 0.804);\n  }\n}\n\n@media (max-width: 319px) {\n  .wrapper {\n    display: none;\n  }\n\n  body {\n    background: black;\n  }\n}\n\n@media (max-width: 426px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 35px);\n    grid-template-rows: repeat(10, 35px);\n  }\n\n  .square {\n    width: 35px;\n    height: 35px;\n  }\n\n  .game-title {\n    font-size: 1.6rem;\n  }\n\n  .captain-header {\n    font-size: 1rem;\n  }\n\n  label {\n    font-size: 1rem;\n    text-align: center;\n  }\n}\n\n@media (max-width: 376px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .game-title {\n    font-size: 1.5rem;\n  }\n}\n\n@media (min-width: 768px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n    width: fit-content;\n  }\n\n  .board-wrapper {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    grid-column: 1/ -1;\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .boards-container {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }\n\n  .header-wrapper {\n    grid-area: 1 / 1 / 2/ 3;\n  }\n  .captain-header {\n    grid-area: 1/ 1 / 2 / 3;\n  }\n\n  .btn {\n    grid-area: 2 / 1 / 3 / 3;\n  }\n\n  input {\n    width: 70%;\n  }\n}\n\n@media (min-width: 1024px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 25px);\n    grid-template-rows: repeat(10, 25px);\n    width: fit-content;\n  }\n\n  .square {\n    width: 25px;\n    height: 25px;\n  }\n\n  .boards-container {\n    gap: 25px;\n  }\n\n  input {\n    width: 50%;\n  }\n\n  .footer {\n    font-size: 1.1rem;\n  }\n}\n\n@media (min-width: 1440px) {\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 45px);\n    grid-template-rows: repeat(10, 45px);\n    width: fit-content;\n  }\n\n  .square {\n    width: 45px;\n    height: 45px;\n  }\n\n  .captain-header {\n    font-size: 1.5rem;\n  }\n\n  .player-name {\n    font-size: 1.5rem;\n  }\n\n  span {\n    font-size: 1.3rem;\n  }\n\n  .header-turn {\n    font-size: 1.3rem;\n  }\n}\n\n@media (min-width: 2560px) {\n  .game-title {\n    font-size: 5rem;\n  }\n\n  label,\n  input,\n  input::placeholder,\n  .captain-header {\n    font-size: 3rem;\n  }\n\n  .btn {\n    font-size: 2rem;\n    padding: 1rem;\n  }\n\n  .footer {\n    font-size: 2.5rem;\n  }\n  .player-board {\n    display: grid;\n    grid-template-columns: repeat(10, 70px);\n    grid-template-rows: repeat(10, 70px);\n    width: fit-content;\n    gap: 7px;\n  }\n\n  .square {\n    width: 70px;\n    height: 70px;\n  }\n\n  .player-name {\n    font-size: 2.8rem;\n  }\n\n  span {\n    font-size: 2.2rem;\n  }\n\n  .header-turn {\n    font-size: 2.6rem;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/styles/fonts/Audiowide-Regular.ttf":
/*!************************************************!*\
  !*** ./src/styles/fonts/Audiowide-Regular.ttf ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2017bdb174a62d0daa3e.ttf";

/***/ }),

/***/ "./src/styles/fonts/PressStart2P-Regular.ttf":
/*!***************************************************!*\
  !*** ./src/styles/fonts/PressStart2P-Regular.ttf ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "21503c6a5385ab41dde9.ttf";

/***/ }),

/***/ "./src/styles/img/background.jpg":
/*!***************************************!*\
  !*** ./src/styles/img/background.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "e2b55af836d6329a7099.jpg";

/***/ }),

/***/ "./src/styles/img/patrol.svg":
/*!***********************************!*\
  !*** ./src/styles/img/patrol.svg ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5050c3ee4e2425de07ce.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsTUFBTSxDQUFDO0VBQ1hDLFdBQVcsQ0FBQ0MsVUFBVSxFQUFFQyxVQUFVLEVBQUU7SUFDbEMsSUFBSSxDQUFDQyxTQUFTLEdBQUcsSUFBSSxDQUFDQyxPQUFPLENBQUNILFVBQVUsQ0FBQztJQUN6QyxJQUFJLENBQUNDLFVBQVUsR0FBR0EsVUFBVTtFQUM5QjtFQUVBRSxPQUFPLENBQUNILFVBQVUsR0FBRyxJQUFJLENBQUNBLFVBQVUsRUFBRTtJQUNwQztJQUNBLE1BQU1JLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQzVDRixNQUFNLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0lBQ3hDSixNQUFNLENBQUNLLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07SUFDN0JWLFVBQVUsQ0FBQ1csTUFBTSxDQUFDUCxNQUFNLENBQUM7SUFDekIsT0FBT0EsTUFBTTtFQUNmO0VBRUFRLE1BQU0sQ0FBQ1YsU0FBUyxHQUFHLElBQUksQ0FBQ0EsU0FBUyxFQUFFO0lBQ2pDLE1BQU1XLE1BQU0sR0FBR1gsU0FBUyxDQUFDWSxRQUFRLENBQUNELE1BQU07SUFDeEMsS0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdGLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDL0JiLFNBQVMsQ0FBQ2MsVUFBVSxDQUFDQyxNQUFNLEVBQUU7SUFDL0I7RUFDRjtFQUVBQyxPQUFPLENBQUNDLE1BQU0sRUFBRWpCLFNBQVMsR0FBRyxJQUFJLENBQUNBLFNBQVMsRUFBRTtJQUMxQyxNQUFNa0IsWUFBWSxHQUFHZixRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDbERjLFlBQVksQ0FBQ2IsU0FBUyxDQUFDQyxHQUFHLENBQUMsZUFBZSxDQUFDO0lBQzNDLE1BQU1hLFdBQVcsR0FBR2hCLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUNqRGUsV0FBVyxDQUFDZCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxjQUFjLENBQUM7SUFDekNZLFlBQVksQ0FBQ1QsTUFBTSxDQUFDVSxXQUFXLENBQUM7SUFDaENuQixTQUFTLENBQUNTLE1BQU0sQ0FBQ1MsWUFBWSxDQUFDO0lBQzlCLEtBQUssSUFBSUwsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSSxNQUFNLENBQUNHLEtBQUssQ0FBQ0MsSUFBSSxFQUFFUixDQUFDLEVBQUUsRUFBRTtNQUMxQyxLQUFLLElBQUlTLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0wsTUFBTSxDQUFDRyxLQUFLLENBQUNDLElBQUksRUFBRUMsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsTUFBTUMsTUFBTSxHQUFHcEIsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDbUIsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUUsSUFBR2dCLENBQUUsSUFBR1QsQ0FBRSxFQUFDLENBQUM7UUFDbENVLE1BQU0sQ0FBQ2xCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QmlCLE1BQU0sQ0FBQ2xCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUNuQ2lCLE1BQU0sQ0FBQ0MsZ0JBQWdCLENBQUMsV0FBVyxFQUFHQyxDQUFDLElBQUssSUFBSSxDQUFDLENBQUNDLFlBQVksQ0FBQ0QsQ0FBQyxDQUFDLENBQUM7UUFDbEVGLE1BQU0sQ0FBQ0MsZ0JBQWdCLENBQUMsVUFBVSxFQUFHQyxDQUFDLElBQUssSUFBSSxDQUFDLENBQUNFLGNBQWMsQ0FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDbkVGLE1BQU0sQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFHQyxDQUFDLElBQUssSUFBSSxDQUFDLENBQUNHLFdBQVcsQ0FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDN0ROLFdBQVcsQ0FBQ1YsTUFBTSxDQUFDYyxNQUFNLENBQUM7TUFDNUI7SUFDRjtJQUNBLE9BQU9KLFdBQVc7RUFDcEI7RUFFQVUsV0FBVyxDQUFDQyxLQUFLLEVBQUVDLElBQUksRUFBRXBCLE1BQU0sRUFBRVosVUFBVSxHQUFHLElBQUksQ0FBQ0EsVUFBVSxFQUFFO0lBQzdELE1BQU1pQyxPQUFPLEdBQUdqQyxVQUFVLENBQUNrQyxZQUFZLENBQUNILEtBQUssRUFBRW5CLE1BQU0sRUFBRW9CLElBQUksQ0FBQztJQUM1REMsT0FBTyxDQUFDRSxPQUFPLENBQUVYLE1BQU0sSUFBSztNQUMxQkEsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzlCLENBQUMsQ0FBQztFQUNKO0VBRUEsQ0FBQ29CLFlBQVksQ0FBQ0QsQ0FBQyxFQUFFMUIsVUFBVSxHQUFHLElBQUksQ0FBQ0EsVUFBVSxFQUFFO0lBQzdDLE1BQU1ZLE1BQU0sR0FBR1osVUFBVSxDQUFDb0MsZUFBZSxFQUFFO0lBQzNDLE1BQU1KLElBQUksR0FBR2hDLFVBQVUsQ0FBQ3FDLGFBQWEsRUFBRTtJQUN2QyxJQUFJTixLQUFLLEdBQUcvQixVQUFVLENBQUNzQyxNQUFNLENBQUNaLENBQUMsQ0FBQ2EsTUFBTSxDQUFDakMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0yQixPQUFPLEdBQUdqQyxVQUFVLENBQUNrQyxZQUFZLENBQUNILEtBQUssRUFBRW5CLE1BQU0sRUFBRW9CLElBQUksQ0FBQztJQUM1RCxJQUFJQyxPQUFPLEtBQUssS0FBSyxFQUFFO01BQ3JCUCxDQUFDLENBQUNhLE1BQU0sQ0FBQ2pDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUMvQixDQUFDLE1BQU07TUFDTDBCLE9BQU8sQ0FBQ0UsT0FBTyxDQUFFWCxNQUFNLElBQUs7UUFDMUJBLE1BQU0sQ0FBQ2xCLFNBQVMsQ0FBQ1UsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUN0Q1EsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO01BQ2pDLENBQUMsQ0FBQztJQUNKO0VBQ0Y7RUFFQSxDQUFDcUIsY0FBYyxDQUFDRixDQUFDLEVBQUUxQixVQUFVLEdBQUcsSUFBSSxDQUFDQSxVQUFVLEVBQUU7SUFDL0MsTUFBTVksTUFBTSxHQUFHWixVQUFVLENBQUNvQyxlQUFlLEVBQUU7SUFDM0MsTUFBTUosSUFBSSxHQUFHaEMsVUFBVSxDQUFDcUMsYUFBYSxFQUFFO0lBQ3ZDLElBQUlOLEtBQUssR0FBRy9CLFVBQVUsQ0FBQ3NDLE1BQU0sQ0FBQ1osQ0FBQyxDQUFDYSxNQUFNLENBQUNqQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTTJCLE9BQU8sR0FBR2pDLFVBQVUsQ0FBQ2tDLFlBQVksQ0FBQ0gsS0FBSyxFQUFFbkIsTUFBTSxFQUFFb0IsSUFBSSxDQUFDO0lBQzVELElBQUlDLE9BQU8sS0FBSyxLQUFLLEVBQUU7TUFDckJQLENBQUMsQ0FBQ2EsTUFBTSxDQUFDakMsU0FBUyxDQUFDVSxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUMsTUFBTTtNQUNMaUIsT0FBTyxDQUFDRSxPQUFPLENBQUVYLE1BQU0sSUFBSztRQUMxQkEsTUFBTSxDQUFDbEIsU0FBUyxDQUFDVSxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDUSxNQUFNLENBQUNsQixTQUFTLENBQUNDLEdBQUcsQ0FBQyxhQUFhLENBQUM7TUFDckMsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUVBLENBQUNzQixXQUFXLENBQUNILENBQUMsRUFBRTFCLFVBQVUsR0FBRyxJQUFJLENBQUNBLFVBQVUsRUFBRTtJQUM1QyxJQUNFMEIsQ0FBQyxDQUFDYSxNQUFNLENBQUNqQyxTQUFTLENBQUNrQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQ25DZCxDQUFDLENBQUNhLE1BQU0sQ0FBQ2pDLFNBQVMsQ0FBQ2tDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFFMUM7SUFDRixNQUFNQyxLQUFLLEdBQUd6QyxVQUFVLENBQUMwQyxJQUFJLENBQUNDLE9BQU8sQ0FBQ0YsS0FBSztJQUMzQyxNQUFNVixLQUFLLEdBQUcvQixVQUFVLENBQUNzQyxNQUFNLENBQUNaLENBQUMsQ0FBQ2EsTUFBTSxDQUFDakMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELE1BQU1zQyxJQUFJLEdBQUdILEtBQUssQ0FBQ0ksS0FBSyxFQUFFO0lBQzFCLE1BQU1iLElBQUksR0FBR2hDLFVBQVUsQ0FBQ3FDLGFBQWEsRUFBRTtJQUN2Q3JDLFVBQVUsQ0FBQzBDLElBQUksQ0FBQ0MsT0FBTyxDQUFDdEIsS0FBSyxDQUFDeUIsU0FBUyxDQUFDRixJQUFJLEVBQUViLEtBQUssQ0FBQ2dCLENBQUMsRUFBRWhCLEtBQUssQ0FBQ2lCLENBQUMsRUFBRWhCLElBQUksQ0FBQztJQUNyRSxJQUFJLENBQUNGLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFQyxJQUFJLEVBQUVZLElBQUksQ0FBQ2hDLE1BQU0sQ0FBQztJQUMxQztJQUNBLElBQUk2QixLQUFLLENBQUM3QixNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ3RCLElBQUksQ0FBQ0QsTUFBTSxFQUFFO01BQ2I7TUFDQVgsVUFBVSxDQUFDMEMsSUFBSSxDQUFDTyxLQUFLLEVBQUU7SUFDekI7RUFDRjtBQUNGO0FBRUEsaUVBQWVwRCxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEdTO0FBQ0E7QUFDQTtBQUNKO0FBRTFCLE1BQU13RCxVQUFVLENBQUM7RUFDZnZELFdBQVcsQ0FBQ3dELElBQUksRUFBRTtJQUNoQixJQUFJLENBQUNBLElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJLENBQUN2RCxVQUFVLEdBQUcsSUFBSSxDQUFDd0QsV0FBVyxDQUFDRCxJQUFJLENBQUM7SUFDeEMsSUFBSSxDQUFDRSxNQUFNLEdBQUcsSUFBSU4sK0NBQU0sQ0FBQyxJQUFJLENBQUNuRCxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBQy9DLElBQUksQ0FBQ0ksTUFBTSxHQUFHLElBQUlOLCtDQUFNLENBQUMsSUFBSSxDQUFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDO0lBQy9DLElBQUksQ0FBQzBELElBQUksR0FBRyxJQUFJTCw2Q0FBSSxDQUFDLElBQUksQ0FBQ3JELFVBQVUsRUFBRSxJQUFJLENBQUM7SUFDM0MsSUFBSSxDQUFDMkQsTUFBTSxHQUFHLElBQUlQLCtDQUFNLENBQUMsSUFBSSxDQUFDcEQsVUFBVSxDQUFDO0lBQ3pDLElBQUksQ0FBQzJDLElBQUk7SUFDVCxJQUFJLENBQUNWLElBQUk7SUFDVCxJQUFJLENBQUMyQixJQUFJO0VBQ1g7RUFFQUosV0FBVyxDQUFDRCxJQUFJLEVBQUU7SUFDaEI7SUFDQSxNQUFNdkQsVUFBVSxHQUFHSyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDaEROLFVBQVUsQ0FBQ08sU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBQ25DK0MsSUFBSSxDQUFDNUMsTUFBTSxDQUFDWCxVQUFVLENBQUM7SUFDdkIsT0FBT0EsVUFBVTtFQUNuQjtFQUVBNkQsV0FBVyxDQUFDekQsTUFBTSxHQUFHLElBQUksQ0FBQ0EsTUFBTSxFQUFFO0lBQ2hDLE1BQU0wRCxHQUFHLEdBQUd6RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDNUN3RCxHQUFHLENBQUNDLFdBQVcsR0FBRyxTQUFTO0lBQzNCRCxHQUFHLENBQUN2RCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDeEJzRCxHQUFHLENBQUNwQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUdDLENBQUMsSUFBSyxJQUFJLENBQUMsQ0FBQ3FDLE9BQU8sQ0FBQ3JDLENBQUMsRUFBRW1DLEdBQUcsQ0FBQyxDQUFDO0lBQzNEMUQsTUFBTSxDQUFDRixTQUFTLENBQUNTLE1BQU0sQ0FBQ21ELEdBQUcsQ0FBQztJQUM1QixJQUFJLENBQUM3QixJQUFJLEdBQUc2QixHQUFHO0lBQ2YsT0FBT0EsR0FBRztFQUNaO0VBRUEzQixZQUFZLENBQUNILEtBQUssRUFBRW5CLE1BQU0sRUFBRW9CLElBQUksRUFBRTtJQUNoQyxNQUFNQyxPQUFPLEdBQUcsRUFBRTtJQUNsQixLQUFLLElBQUluQixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdGLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDL0IsSUFBSWtCLElBQUksSUFBSSxHQUFHLEVBQUU7UUFDZixNQUFNZSxDQUFDLEdBQUdpQixNQUFNLENBQUNqQyxLQUFLLENBQUNnQixDQUFDLENBQUMsR0FBR2pDLENBQUM7UUFDN0IsTUFBTVUsTUFBTSxHQUFHcEIsUUFBUSxDQUFDNkQsYUFBYSxDQUFFLEtBQUlsQixDQUFFLElBQUdoQixLQUFLLENBQUNpQixDQUFFLEVBQUMsQ0FBQztRQUMxRCxJQUFJeEIsTUFBTSxFQUFFO1VBQ1ZTLE9BQU8sQ0FBQ2lDLElBQUksQ0FBQzFDLE1BQU0sQ0FBQztRQUN0QixDQUFDLE1BQU0sT0FBTyxLQUFLO01BQ3JCLENBQUMsTUFBTSxJQUFJUSxJQUFJLElBQUksR0FBRyxFQUFFO1FBQ3RCLE1BQU1nQixDQUFDLEdBQUdnQixNQUFNLENBQUNqQyxLQUFLLENBQUNpQixDQUFDLENBQUMsR0FBR2xDLENBQUM7UUFDN0IsTUFBTVUsTUFBTSxHQUFHcEIsUUFBUSxDQUFDNkQsYUFBYSxDQUFFLEtBQUlsQyxLQUFLLENBQUNnQixDQUFFLElBQUdDLENBQUUsRUFBQyxDQUFDO1FBQzFELElBQUl4QixNQUFNLEVBQUU7VUFDVlMsT0FBTyxDQUFDaUMsSUFBSSxDQUFDMUMsTUFBTSxDQUFDO1FBQ3RCLENBQUMsTUFBTSxPQUFPLEtBQUs7TUFDckI7SUFDRjtJQUNBLE9BQU9TLE9BQU87RUFDaEI7RUFFQUksYUFBYSxHQUFHO0lBQ2QsTUFBTXdCLEdBQUcsR0FBRyxJQUFJLENBQUM3QixJQUFJO0lBQ3JCLElBQUlBLElBQUksR0FBRzZCLEdBQUcsQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUM3QixPQUFPOUIsSUFBSTtFQUNiO0VBRUFJLGVBQWUsQ0FBQ00sSUFBSSxHQUFHLElBQUksQ0FBQ0EsSUFBSSxFQUFFO0lBQ2hDLE1BQU1FLElBQUksR0FBR0YsSUFBSSxDQUFDQyxPQUFPLENBQUNGLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEMsT0FBT0csSUFBSSxDQUFDaEMsTUFBTTtFQUNwQjtFQUVBMEIsTUFBTSxDQUFDNkIsTUFBTSxFQUFFO0lBQ2JBLE1BQU0sR0FBRztNQUFFcEIsQ0FBQyxFQUFFb0IsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUFFbkIsQ0FBQyxFQUFFbUIsTUFBTSxDQUFDLENBQUM7SUFBRSxDQUFDO0lBQ3ZDLE9BQU9BLE1BQU07RUFDZjtFQUVBQyxlQUFlLENBQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDQSxJQUFJLEVBQUU7SUFDaEMsTUFBTUMsT0FBTyxHQUFHdkMsUUFBUSxDQUFDNkQsYUFBYSxDQUFDLGVBQWUsQ0FBQztJQUN2RCxNQUFNSSxPQUFPLEdBQUdqRSxRQUFRLENBQUM2RCxhQUFhLENBQUMsaUJBQWlCLENBQUM7SUFDekR0QixPQUFPLENBQUNtQixXQUFXLEdBQUksZUFBYyxJQUFJLENBQUNRLFVBQVUsQ0FBQzVCLElBQUksQ0FBQzZCLE1BQU0sQ0FBRSxFQUFDO0lBQ25FRixPQUFPLENBQUNQLFdBQVcsR0FBSSxlQUFjLElBQUksQ0FBQ1EsVUFBVSxDQUFDNUIsSUFBSSxDQUFDOEIsTUFBTSxDQUFFLEVBQUM7RUFDckU7RUFFQUYsVUFBVSxDQUFDakQsS0FBSyxFQUFFO0lBQ2hCLE1BQU1vQixLQUFLLEdBQUdwQixLQUFLLENBQUNvQixLQUFLO0lBQ3pCLE1BQU1nQyxHQUFHLEdBQUdoQyxLQUFLLENBQUNpQyxNQUFNLENBQUU5QixJQUFJLElBQUs7TUFDakMsT0FBT0EsSUFBSSxDQUFDK0IsSUFBSSxLQUFLLEtBQUs7SUFDNUIsQ0FBQyxDQUFDO0lBQ0YsT0FBT0YsR0FBRyxDQUFDN0QsTUFBTTtFQUNuQjtFQUVBZ0UsaUJBQWlCLENBQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDQSxJQUFJLEVBQUU7SUFDbEMsTUFBTUQsS0FBSyxHQUFHQyxJQUFJLENBQUMyQixPQUFPLENBQUNoRCxLQUFLLENBQUNvQixLQUFLO0lBQ3RDQSxLQUFLLENBQUNOLE9BQU8sQ0FBRVMsSUFBSSxJQUFLO01BQ3RCLElBQUlBLElBQUksQ0FBQytCLElBQUksS0FBSyxJQUFJLEVBQUU7UUFDdEIsS0FBSyxJQUFJN0QsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHOEIsSUFBSSxDQUFDYixLQUFLLENBQUNuQixNQUFNLEVBQUVFLENBQUMsRUFBRSxFQUFFO1VBQzFDLElBQUlpQixLQUFLLEdBQUdhLElBQUksQ0FBQ2IsS0FBSyxDQUFDakIsQ0FBQyxDQUFDO1VBQ3pCaUIsS0FBSyxHQUFHO1lBQUVnQixDQUFDLEVBQUVoQixLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQUVpQixDQUFDLEVBQUVqQixLQUFLLENBQUMsQ0FBQztVQUFFLENBQUM7VUFDcEMsTUFBTUUsT0FBTyxHQUFHN0IsUUFBUSxDQUFDeUUsZ0JBQWdCLENBQUUsS0FBSTlDLEtBQUssQ0FBQ2dCLENBQUUsSUFBR2hCLEtBQUssQ0FBQ2lCLENBQUUsRUFBQyxDQUFDO1VBQ3BFLElBQUksQ0FBQ2YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDM0IsU0FBUyxDQUFDa0MsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFDc0MsVUFBVSxDQUFDLE1BQU07Y0FDZjdDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzNCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1VBQ1Q7UUFDRjtNQUNGO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQXdFLFFBQVEsQ0FBQ0MsT0FBTyxFQUFFQyxJQUFJLEVBQUU7SUFDdEIsSUFBSWxELEtBQUssR0FBRyxDQUFDO0lBQ2IsTUFBTW1ELEtBQUssR0FBRyxHQUFHO0lBQ2pCLE1BQU1DLFVBQVUsR0FBR0MsV0FBVyxDQUFDLE1BQU07TUFDbkMsSUFBSXJELEtBQUssR0FBR2tELElBQUksQ0FBQ3JFLE1BQU0sRUFBRTtRQUN2Qm9FLE9BQU8sQ0FBQ2xCLFdBQVcsSUFBSW1CLElBQUksQ0FBQ2xELEtBQUssQ0FBQztRQUNsQ0EsS0FBSyxFQUFFO01BQ1QsQ0FBQyxNQUFNO1FBQ0xzRCxhQUFhLENBQUNGLFVBQVUsQ0FBQztNQUMzQjtJQUNGLENBQUMsRUFBRUQsS0FBSyxDQUFDO0VBQ1g7O0VBRUE7O0VBRUEsQ0FBQ25CLE9BQU8sQ0FBQ3JDLENBQUMsRUFBRW1DLEdBQUcsRUFBRTtJQUNmLE1BQU1vQixJQUFJLEdBQUdwQixHQUFHLENBQUNDLFdBQVc7SUFDNUIsSUFBSW1CLElBQUksSUFBSSxTQUFTLEVBQUU7TUFDckJwQixHQUFHLENBQUNDLFdBQVcsR0FBRyxTQUFTO0lBQzdCLENBQUMsTUFBTTtNQUNMRCxHQUFHLENBQUNDLFdBQVcsR0FBRyxTQUFTO0lBQzdCO0VBQ0Y7QUFDRjtBQUVBLGlFQUFlVCxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7QUNsSXpCLE1BQU1GLE1BQU0sQ0FBQztFQUNYckQsV0FBVyxDQUFDQyxVQUFVLEVBQUVDLFVBQVUsRUFBRTtJQUNsQyxJQUFJLENBQUMwRCxNQUFNLEdBQUcsSUFBSSxDQUFDNEIsT0FBTyxDQUFDdkYsVUFBVSxDQUFDO0VBQ3hDO0VBQ0F1RixPQUFPLENBQUN2RixVQUFVLEdBQUcsSUFBSSxDQUFDQSxVQUFVLEVBQUU7SUFDcEM7SUFDQSxNQUFNMkQsTUFBTSxHQUFHdEQsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQzVDLE1BQU1rRixTQUFTLEdBQUduRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxHQUFHLENBQUM7SUFDN0MsTUFBTW1GLE1BQU0sR0FBR3BGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEdBQUcsQ0FBQztJQUMxQ3FELE1BQU0sQ0FBQ3BELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM5QmdGLFNBQVMsQ0FBQ3pCLFdBQVcsR0FBRyxhQUFhO0lBQ3JDeUIsU0FBUyxDQUFDakYsU0FBUyxDQUFDQyxHQUFHLENBQUMsYUFBYSxDQUFDO0lBQ3RDaUYsTUFBTSxDQUFDMUIsV0FBVyxHQUFHLE9BQU87SUFDNUIwQixNQUFNLENBQUNqRCxNQUFNLEdBQUcsUUFBUTtJQUN4QmlELE1BQU0sQ0FBQ0MsSUFBSSxHQUFHLDJDQUEyQztJQUN6REYsU0FBUyxDQUFDN0UsTUFBTSxDQUFDOEUsTUFBTSxDQUFDO0lBQ3hCOUIsTUFBTSxDQUFDaEQsTUFBTSxDQUFDNkUsU0FBUyxDQUFDO0lBQ3hCeEYsVUFBVSxDQUFDVyxNQUFNLENBQUNnRCxNQUFNLENBQUM7SUFDekIsT0FBT0EsTUFBTTtFQUNmO0FBQ0Y7QUFFQSxpRUFBZVAsTUFBTTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCTztBQUU1QixNQUFNQyxJQUFJLENBQUM7RUFDVHRELFdBQVcsQ0FBQ0MsVUFBVSxFQUFFQyxVQUFVLEVBQUU7SUFDbEMsSUFBSSxDQUFDQSxVQUFVLEdBQUdBLFVBQVU7SUFDNUIsSUFBSSxDQUFDeUQsSUFBSSxHQUFHLElBQUksQ0FBQ2tDLFNBQVMsQ0FBQzVGLFVBQVUsQ0FBQztFQUN4QztFQUVBNEYsU0FBUyxDQUFDNUYsVUFBVSxHQUFHLElBQUksQ0FBQ0EsVUFBVSxFQUFFO0lBQ3RDO0lBQ0EsTUFBTTBELElBQUksR0FBR3JELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxNQUFNdUYsS0FBSyxHQUFHeEYsUUFBUSxDQUFDQyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBQzdDLE1BQU13RixLQUFLLEdBQUd6RixRQUFRLENBQUNDLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFDN0MsTUFBTXlGLE1BQU0sR0FBRzFGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUMvQyxNQUFNNEUsSUFBSSxHQUFHLG9CQUFvQjtJQUNqQ1ksS0FBSyxDQUFDRSxFQUFFLEdBQUcsTUFBTTtJQUNqQkYsS0FBSyxDQUFDRyxXQUFXLEdBQUcsaUJBQWlCO0lBQ3JDSCxLQUFLLENBQUNwRSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUdDLENBQUMsSUFBSyxJQUFJLENBQUMsQ0FBQ3VFLGVBQWUsQ0FBQ3ZFLENBQUMsRUFBRW1FLEtBQUssQ0FBQyxDQUFDO0lBQ3pFRCxLQUFLLENBQUNNLFlBQVksQ0FBQyxLQUFLLEVBQUVMLEtBQUssQ0FBQztJQUNoQyxJQUFJLENBQUM3RixVQUFVLENBQUMrRSxRQUFRLENBQUNhLEtBQUssRUFBRVgsSUFBSSxDQUFDO0lBQ3JDYSxNQUFNLENBQUNoQyxXQUFXLEdBQUcsUUFBUTtJQUM3QmdDLE1BQU0sQ0FBQ3hGLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUMzQnVGLE1BQU0sQ0FBQ3JFLGdCQUFnQixDQUFDLE9BQU8sRUFBR0MsQ0FBQyxJQUFLLElBQUksQ0FBQyxDQUFDeUUsU0FBUyxDQUFDekUsQ0FBQyxFQUFFbUUsS0FBSyxDQUFDLENBQUM7SUFDbEVwQyxJQUFJLENBQUMvQyxNQUFNLENBQUNrRixLQUFLLENBQUM7SUFDbEJuQyxJQUFJLENBQUMvQyxNQUFNLENBQUNtRixLQUFLLENBQUM7SUFDbEJwQyxJQUFJLENBQUMvQyxNQUFNLENBQUNvRixNQUFNLENBQUM7SUFDbkIvRixVQUFVLENBQUNXLE1BQU0sQ0FBQytDLElBQUksQ0FBQztJQUN2Qm9DLEtBQUssQ0FBQ0ssWUFBWSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUM7SUFDekNMLEtBQUssQ0FBQ08sS0FBSyxFQUFFO0lBQ2IsT0FBTzNDLElBQUk7RUFDYjtFQUVBLENBQUN3QyxlQUFlLENBQUN2RSxDQUFDLEVBQUVtRSxLQUFLLEVBQUU7SUFDekIsTUFBTVEsR0FBRyxHQUFHM0UsQ0FBQyxDQUFDNEUsT0FBTztJQUNyQixJQUFJRCxHQUFHLEtBQUssRUFBRSxFQUFFO01BQ2QsSUFBSSxDQUFDLENBQUNGLFNBQVMsQ0FBQ3pFLENBQUMsRUFBRW1FLEtBQUssQ0FBQztJQUMzQjtJQUNBO0lBQ0EsSUFDRVEsR0FBRyxLQUFLLENBQUMsSUFDVEEsR0FBRyxLQUFLLEVBQUUsSUFDVEEsR0FBRyxJQUFJLEVBQUUsSUFBSUEsR0FBRyxJQUFJLEVBQUcsSUFDdkJBLEdBQUcsSUFBSSxFQUFFLElBQUlBLEdBQUcsSUFBSSxHQUFJLEVBQ3pCO01BQ0EsT0FBTyxJQUFJO0lBQ2IsQ0FBQyxNQUFNO01BQ0wzRSxDQUFDLENBQUM2RSxjQUFjLEVBQUU7TUFDbEIsT0FBTyxLQUFLO0lBQ2Q7RUFDRjtFQUVBLENBQUNKLFNBQVMsQ0FBQ3pFLENBQUMsRUFBRW1FLEtBQUssRUFBRXBDLElBQUksR0FBRyxJQUFJLENBQUNBLElBQUksRUFBRXpELFVBQVUsR0FBRyxJQUFJLENBQUNBLFVBQVUsRUFBRTtJQUNuRSxJQUFJNkYsS0FBSyxDQUFDVyxLQUFLLElBQUksRUFBRSxFQUFFO01BQ3JCWCxLQUFLLENBQUNHLFdBQVcsR0FBRyxxQkFBcUI7TUFDekN0RSxDQUFDLENBQUM2RSxjQUFjLEVBQUU7SUFDcEIsQ0FBQyxNQUFNLElBQUlWLEtBQUssQ0FBQ1csS0FBSyxDQUFDNUYsTUFBTSxJQUFJLEVBQUUsRUFBRTtNQUNuQ2lGLEtBQUssQ0FBQ1csS0FBSyxHQUFHLEVBQUU7TUFDaEJYLEtBQUssQ0FBQ0csV0FBVyxHQUFHLGtDQUFrQztNQUN0RHRFLENBQUMsQ0FBQzZFLGNBQWMsRUFBRTtJQUNwQixDQUFDLE1BQU07TUFDTDtNQUNBN0UsQ0FBQyxDQUFDNkUsY0FBYyxFQUFFO01BQ2xCLElBQUlFLElBQUksR0FBR1osS0FBSyxDQUFDVyxLQUFLO01BQ3RCQyxJQUFJLEdBQUdBLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxXQUFXLEVBQUUsR0FBR0YsSUFBSSxDQUFDRyxTQUFTLENBQUMsQ0FBQyxDQUFDO01BQ3ZENUcsVUFBVSxDQUFDMEMsSUFBSSxHQUFHLElBQUlnRCw4Q0FBSSxDQUFDZSxJQUFJLEVBQUUsSUFBSSxDQUFDekcsVUFBVSxDQUFDO01BQ2pEeUQsSUFBSSxDQUFDekMsTUFBTSxFQUFFO01BQ2JoQixVQUFVLENBQUNHLE1BQU0sQ0FBQ0YsU0FBUyxDQUFDTyxLQUFLLENBQUNDLE9BQU8sR0FBRyxFQUFFO0lBQ2hEO0lBQ0EsT0FBT29GLEtBQUssQ0FBQ1csS0FBSztFQUNwQjtBQUNGO0FBRUEsaUVBQWVwRCxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUN4RW5CLE1BQU15RCxJQUFJLENBQUM7RUFDVC9HLFdBQVcsQ0FBQzRDLElBQUksRUFBRTNDLFVBQVUsRUFBRTtJQUM1QixJQUFJLENBQUMyQyxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDdkMsTUFBTSxHQUFHSixVQUFVO0lBQ3hCLElBQUksQ0FBQ3lELE1BQU0sR0FBRyxJQUFJLENBQUNzRCxhQUFhLEVBQUU7SUFDbEMsSUFBSSxDQUFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQ3dDLFlBQVksQ0FBQ3JFLElBQUksQ0FBQ0MsT0FBTyxDQUFDO0lBQzdDLElBQUksQ0FBQzZCLE1BQU0sR0FBRyxJQUFJLENBQUN1QyxZQUFZLENBQUNyRSxJQUFJLENBQUMyQixPQUFPLENBQUM7SUFDN0MsSUFBSSxDQUFDMkMsSUFBSSxHQUFHLEtBQUs7SUFDakIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsSUFBSSxDQUFDQSxJQUFJLEVBQUU7RUFDekI7RUFFQUEsSUFBSSxDQUFDdkUsSUFBSSxHQUFHLElBQUksQ0FBQ0EsSUFBSSxFQUFFNkIsTUFBTSxHQUFHLElBQUksQ0FBQ0EsTUFBTSxFQUFFQyxNQUFNLEdBQUcsSUFBSSxDQUFDQSxNQUFNLEVBQUU7SUFDakUsTUFBTTdCLE9BQU8sR0FBR0QsSUFBSSxDQUFDNkIsTUFBTSxDQUFDOUIsS0FBSztJQUNqQyxNQUFNNEIsT0FBTyxHQUFHM0IsSUFBSSxDQUFDOEIsTUFBTSxDQUFDL0IsS0FBSztJQUNqQyxJQUFJLENBQUN5RSxZQUFZLENBQUMzQyxNQUFNLEVBQUU1QixPQUFPLENBQUM7SUFDbEM7RUFDRjs7RUFFQW1FLGFBQWEsQ0FBQy9HLFVBQVUsR0FBRyxJQUFJLENBQUNJLE1BQU0sQ0FBQ0YsU0FBUyxFQUFFO0lBQ2hELE1BQU1BLFNBQVMsR0FBR0csUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQy9DSixTQUFTLENBQUNLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0lBQ3pDLE1BQU1pRCxNQUFNLEdBQUdwRCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDM0NtRCxNQUFNLENBQUNsRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFDbkMsTUFBTTBFLElBQUksR0FBRyx3QkFBd0I7SUFDckMsSUFBSSxDQUFDdkMsSUFBSSxDQUFDMUMsVUFBVSxDQUFDK0UsUUFBUSxDQUFDdkIsTUFBTSxFQUFFeUIsSUFBSSxDQUFDO0lBQzNDaEYsU0FBUyxDQUFDa0gsV0FBVyxDQUFDM0QsTUFBTSxDQUFDO0lBQzdCekQsVUFBVSxDQUFDb0gsV0FBVyxDQUFDbEgsU0FBUyxDQUFDO0lBQ2pDLE9BQU91RCxNQUFNO0VBQ2Y7RUFFQXVELFlBQVksQ0FBQzdGLE1BQU0sRUFBRW5CLFVBQVUsR0FBRyxJQUFJLENBQUNJLE1BQU0sQ0FBQ0YsU0FBUyxFQUFFO0lBQ3ZELE1BQU1BLFNBQVMsR0FBR0csUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQy9DSixTQUFTLENBQUNLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0lBQzNDLElBQUksQ0FBQzZHLGNBQWMsQ0FBQ2xHLE1BQU0sRUFBRWpCLFNBQVMsQ0FBQztJQUN0QyxJQUFJLENBQUNvSCxhQUFhLENBQUNuRyxNQUFNLEVBQUVqQixTQUFTLENBQUM7SUFDckMsTUFBTW1CLFdBQVcsR0FBR2hCLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUNqRGUsV0FBVyxDQUFDZCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxjQUFjLENBQUM7SUFDekNhLFdBQVcsQ0FBQ2QsU0FBUyxDQUFDQyxHQUFHLENBQUUsR0FBRVcsTUFBTSxDQUFDdUYsSUFBSyxFQUFDLENBQUM7SUFDM0MsS0FBSyxJQUFJM0YsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSSxNQUFNLENBQUNHLEtBQUssQ0FBQ0MsSUFBSSxFQUFFUixDQUFDLEVBQUUsRUFBRTtNQUMxQyxLQUFLLElBQUlTLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0wsTUFBTSxDQUFDRyxLQUFLLENBQUNDLElBQUksRUFBRUMsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsTUFBTUMsTUFBTSxHQUFHcEIsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDbUIsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUUsSUFBR2dCLENBQUUsSUFBR1QsQ0FBRSxFQUFDLENBQUM7UUFDbENVLE1BQU0sQ0FBQ2xCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJVyxNQUFNLENBQUN1RixJQUFJLElBQUksVUFBVSxFQUFFO1VBQzdCakYsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO1VBQzlCaUIsTUFBTSxDQUFDQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUdDLENBQUMsSUFBSyxJQUFJLENBQUMsQ0FBQ0csV0FBVyxDQUFDSCxDQUFDLENBQUMsQ0FBQztRQUMvRDtRQUNBTixXQUFXLENBQUNWLE1BQU0sQ0FBQ2MsTUFBTSxDQUFDO01BQzVCO0lBQ0Y7SUFDQXZCLFNBQVMsQ0FBQ1MsTUFBTSxDQUFDVSxXQUFXLENBQUM7SUFDN0JyQixVQUFVLENBQUNXLE1BQU0sQ0FBQ1QsU0FBUyxDQUFDO0lBQzVCLE9BQU9tQixXQUFXO0VBQ3BCO0VBRUFnRyxjQUFjLENBQUNsRyxNQUFNLEVBQUVqQixTQUFTLEVBQUU7SUFDaEMsTUFBTXFILFVBQVUsR0FBR2xILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLElBQUksQ0FBQztJQUMvQ2lILFVBQVUsQ0FBQ2hILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztJQUN2QytHLFVBQVUsQ0FBQ3hELFdBQVcsR0FBSSxHQUFFNUMsTUFBTSxDQUFDdUYsSUFBSyxVQUFTO0lBQ2pEeEcsU0FBUyxDQUFDUyxNQUFNLENBQUM0RyxVQUFVLENBQUM7SUFDNUIsT0FBT0EsVUFBVTtFQUNuQjtFQUVBRCxhQUFhLENBQUNuRyxNQUFNLEVBQUVqQixTQUFTLEVBQUU7SUFDL0IsTUFBTXNILFVBQVUsR0FBR25ILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNqRGtILFVBQVUsQ0FBQ3pELFdBQVcsR0FBRyxlQUFlO0lBQ3hDeUQsVUFBVSxDQUFDakgsU0FBUyxHQUFHLGFBQWE7SUFDcEMsSUFBSVksTUFBTSxDQUFDdUYsSUFBSSxJQUFJLFVBQVUsRUFBRTtNQUM3QmMsVUFBVSxDQUFDakgsU0FBUyxHQUFHLGdCQUFnQjtJQUN6QyxDQUFDLE1BQU07TUFDTGlILFVBQVUsQ0FBQ2pILFNBQVMsR0FBRyxjQUFjO0lBQ3ZDO0lBQ0FMLFNBQVMsQ0FBQ1MsTUFBTSxDQUFDNkcsVUFBVSxDQUFDO0lBQzVCLE9BQU9BLFVBQVU7RUFDbkI7RUFFQUwsWUFBWSxDQUFDN0YsS0FBSyxFQUFFb0IsS0FBSyxFQUFFO0lBQ3pCQSxLQUFLLENBQUNOLE9BQU8sQ0FBRVMsSUFBSSxJQUFLO01BQ3RCLE1BQU1aLElBQUksR0FBR1ksSUFBSSxDQUFDWixJQUFJO01BQ3RCLE1BQU1wQixNQUFNLEdBQUdnQyxJQUFJLENBQUNoQyxNQUFNO01BQzFCLElBQUltQixLQUFLLEdBQUdhLElBQUksQ0FBQ2IsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUN6QkEsS0FBSyxHQUFHO1FBQUVnQixDQUFDLEVBQUVoQixLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQUVpQixDQUFDLEVBQUVqQixLQUFLLENBQUMsQ0FBQztNQUFFLENBQUM7TUFDcEMsTUFBTUUsT0FBTyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxDQUFDSCxLQUFLLEVBQUVuQixNQUFNLEVBQUVvQixJQUFJLEVBQUVYLEtBQUssQ0FBQztNQUM3RFksT0FBTyxDQUFDRSxPQUFPLENBQUVYLE1BQU0sSUFBSztRQUMxQkEsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO01BQzlCLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKO0VBRUEyQixZQUFZLENBQUNILEtBQUssRUFBRW5CLE1BQU0sRUFBRW9CLElBQUksRUFBRVgsS0FBSyxFQUFFO0lBQ3ZDLE1BQU1ZLE9BQU8sR0FBRyxFQUFFO0lBQ2xCLEtBQUssSUFBSW5CLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0YsTUFBTSxFQUFFRSxDQUFDLEVBQUUsRUFBRTtNQUMvQixJQUFJa0IsSUFBSSxJQUFJLEdBQUcsRUFBRTtRQUNmLE1BQU1lLENBQUMsR0FBR2lCLE1BQU0sQ0FBQ2pDLEtBQUssQ0FBQ2dCLENBQUMsQ0FBQyxHQUFHakMsQ0FBQztRQUM3QixNQUFNVSxNQUFNLEdBQUdILEtBQUssQ0FBQzRDLGFBQWEsQ0FBRSxLQUFJbEIsQ0FBRSxJQUFHaEIsS0FBSyxDQUFDaUIsQ0FBRSxFQUFDLENBQUM7UUFDdkQsSUFBSXhCLE1BQU0sRUFBRTtVQUNWUyxPQUFPLENBQUNpQyxJQUFJLENBQUMxQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxNQUFNLE9BQU8sS0FBSztNQUNyQixDQUFDLE1BQU0sSUFBSVEsSUFBSSxJQUFJLEdBQUcsRUFBRTtRQUN0QixNQUFNZ0IsQ0FBQyxHQUFHZ0IsTUFBTSxDQUFDakMsS0FBSyxDQUFDaUIsQ0FBQyxDQUFDLEdBQUdsQyxDQUFDO1FBQzdCLE1BQU1VLE1BQU0sR0FBR0gsS0FBSyxDQUFDNEMsYUFBYSxDQUFFLEtBQUlsQyxLQUFLLENBQUNnQixDQUFFLElBQUdDLENBQUUsRUFBQyxDQUFDO1FBQ3ZELElBQUl4QixNQUFNLEVBQUU7VUFDVlMsT0FBTyxDQUFDaUMsSUFBSSxDQUFDMUMsTUFBTSxDQUFDO1FBQ3RCLENBQUMsTUFBTSxPQUFPLEtBQUs7TUFDckI7SUFDRjtJQUNBLE9BQU9TLE9BQU87RUFDaEI7RUFFQXVGLFVBQVUsQ0FBQ3pGLEtBQUssRUFBRVEsTUFBTSxFQUFFbEIsS0FBSyxFQUFFO0lBQy9CLElBQUlrQixNQUFNLElBQUlrRixTQUFTLEVBQUUsT0FBTyxLQUMzQixJQUFJbEYsTUFBTSxJQUFJLE1BQU0sRUFBRTtNQUN6QmxCLEtBQUssR0FBRyxJQUFJLENBQUNxRyxXQUFXLENBQUMzRixLQUFLLEVBQUVWLEtBQUssQ0FBQztNQUN0QyxJQUFJLENBQUNzRyxVQUFVLENBQUN0RyxLQUFLLENBQUM7SUFDeEIsQ0FBQyxNQUFNLElBQUlrQixNQUFNLElBQUksS0FBSyxFQUFFO01BQzFCbEIsS0FBSyxHQUFHLElBQUksQ0FBQ3FHLFdBQVcsQ0FBQzNGLEtBQUssRUFBRVYsS0FBSyxDQUFDO01BQ3RDLElBQUksQ0FBQ3VHLFNBQVMsQ0FBQ3ZHLEtBQUssQ0FBQztJQUN2QjtJQUNBQSxLQUFLLENBQUNmLFNBQVMsQ0FBQ1UsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNoQ0ssS0FBSyxDQUFDZixTQUFTLENBQUNDLEdBQUcsQ0FBQyxhQUFhLENBQUM7RUFDcEM7RUFFQW1ILFdBQVcsQ0FBQzNGLEtBQUssRUFBRVYsS0FBSyxFQUFFO0lBQ3hCLElBQUlBLEtBQUssSUFBSSxRQUFRLEVBQUU7TUFDckJBLEtBQUssR0FBRyxJQUFJLENBQUNrRCxNQUFNO0lBQ3JCLENBQUMsTUFBTSxJQUFJbEQsS0FBSyxJQUFJLFVBQVUsRUFBRTtNQUM5QkEsS0FBSyxHQUFHLElBQUksQ0FBQ21ELE1BQU07SUFDckI7SUFDQSxNQUFNaEQsTUFBTSxHQUFHSCxLQUFLLENBQUM0QyxhQUFhLENBQUUsS0FBSWxDLEtBQUssQ0FBQ2dCLENBQUUsSUFBR2hCLEtBQUssQ0FBQ2lCLENBQUUsRUFBQyxDQUFDO0lBQzdELE9BQU94QixNQUFNO0VBQ2Y7RUFFQW1HLFVBQVUsQ0FBQ25HLE1BQU0sRUFBRTtJQUNqQkEsTUFBTSxDQUFDbEIsU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0VBQzlCO0VBRUFxSCxTQUFTLENBQUNwRyxNQUFNLEVBQUU7SUFDaEJBLE1BQU0sQ0FBQ2xCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztFQUM3QjtFQUVBc0gsUUFBUSxHQUFHO0lBQ1QsSUFBSSxDQUFDYixJQUFJLEdBQUcsSUFBSTtFQUNsQjtFQUVBLENBQUNuRixXQUFXLENBQUNILENBQUMsRUFBRWdCLElBQUksR0FBRyxJQUFJLENBQUNBLElBQUksRUFBRXNFLElBQUksR0FBRyxJQUFJLENBQUNBLElBQUksRUFBRTtJQUNsRCxJQUFJQSxJQUFJLEtBQUssSUFBSSxFQUFFO0lBQ25CLE1BQU0zRixLQUFLLEdBQUdLLENBQUMsQ0FBQ2EsTUFBTSxDQUFDdUYsYUFBYTtJQUNwQyxNQUFNM0QsTUFBTSxHQUFHekMsQ0FBQyxDQUFDYSxNQUFNLENBQUNqQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU15QixLQUFLLEdBQUdXLElBQUksQ0FBQzFDLFVBQVUsQ0FBQ3NDLE1BQU0sQ0FBQzZCLE1BQU0sQ0FBQztJQUM1QyxJQUFJekMsQ0FBQyxDQUFDYSxNQUFNLENBQUNqQyxTQUFTLENBQUNrQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxLQUNsRCxJQUFJbkIsS0FBSyxDQUFDZixTQUFTLENBQUNrQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7TUFDN0NFLElBQUksQ0FBQ3FGLElBQUksQ0FBQyxVQUFVLEVBQUVoRyxLQUFLLENBQUM7SUFDOUI7RUFDRjtBQUNGO0FBRUEsaUVBQWU4RSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUM1Sm5CLE1BQU0zRCxNQUFNLENBQUM7RUFDWHBELFdBQVcsQ0FBQ0MsVUFBVSxFQUFFQyxVQUFVLEVBQUU7SUFDbEMsSUFBSSxDQUFDd0QsTUFBTSxHQUFHLElBQUksQ0FBQ3dFLE9BQU8sQ0FBQ2pJLFVBQVUsQ0FBQztJQUN0QyxJQUFJLENBQUNDLFVBQVUsR0FBR0EsVUFBVTtFQUM5QjtFQUNBZ0ksT0FBTyxDQUFDakksVUFBVSxFQUFFO0lBQ2xCO0lBQ0EsTUFBTXlELE1BQU0sR0FBR3BELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLElBQUksQ0FBQztJQUMzQ21ELE1BQU0sQ0FBQ00sV0FBVyxHQUFHLFlBQVk7SUFDakNOLE1BQU0sQ0FBQ2xELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFlBQVksQ0FBQztJQUNsQ1IsVUFBVSxDQUFDVyxNQUFNLENBQUM4QyxNQUFNLENBQUM7SUFDekIsT0FBT0EsTUFBTTtFQUNmO0VBRUF2QyxPQUFPLENBQUNDLE1BQU0sRUFBRWxCLFVBQVUsR0FBRyxJQUFJLENBQUNBLFVBQVUsRUFBRTtJQUM1QyxNQUFNd0QsTUFBTSxHQUFHcEQsUUFBUSxDQUFDQyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQzNDLE1BQU00RSxJQUFJLEdBQUksV0FBVS9ELE1BQU0sQ0FBQ3VGLElBQUssK0JBQThCO0lBQ2xFakQsTUFBTSxDQUFDbEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7SUFDdEM7SUFDQWlELE1BQU0sQ0FBQ3lFLFNBQVMsR0FBSSxXQUFVL0csTUFBTSxDQUFDdUYsSUFBSywrQkFBOEI7SUFDeEV6RyxVQUFVLENBQUNHLE1BQU0sQ0FBQ0YsU0FBUyxDQUFDUyxNQUFNLENBQUM4QyxNQUFNLENBQUM7SUFDMUMsT0FBT0EsTUFBTTtFQUNmO0VBRUF1QixRQUFRLENBQUN2QixNQUFNLEVBQUV5QixJQUFJLEVBQUU7SUFDckI7SUFDQSxJQUFJbEQsS0FBSyxHQUFHLENBQUM7SUFDYixNQUFNbUQsS0FBSyxHQUFHLEdBQUc7SUFDakIsTUFBTUMsVUFBVSxHQUFHQyxXQUFXLENBQUMsTUFBTTtNQUNuQyxJQUFJckQsS0FBSyxHQUFHa0QsSUFBSSxDQUFDckUsTUFBTSxFQUFFO1FBQ3ZCNEMsTUFBTSxDQUFDeUUsU0FBUyxJQUFJaEQsSUFBSSxDQUFDbEQsS0FBSyxDQUFDO1FBQy9CQSxLQUFLLEVBQUU7TUFDVCxDQUFDLE1BQU07UUFDTHNELGFBQWEsQ0FBQ0YsVUFBVSxDQUFDO01BQzNCO0lBQ0YsQ0FBQyxFQUFFRCxLQUFLLENBQUM7RUFDWDtBQUNGO0FBRUEsaUVBQWVoQyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDTztBQUNpQjtBQUNQO0FBQ0E7QUFDUjtBQUU5QixDQUFDLFlBQVk7RUFDWCxNQUFNSSxJQUFJLEdBQUdsRCxRQUFRLENBQUNrRCxJQUFJO0VBQzFCLE1BQU1aLElBQUksR0FBRyxJQUFJVywwREFBVSxDQUFDQyxJQUFJLENBQUM7QUFDbkMsQ0FBQyxHQUFHO0FBRUosTUFBTW9DLElBQUksQ0FBQztFQUNUNUYsV0FBVyxDQUFDNkMsT0FBTyxFQUFFM0MsVUFBVSxFQUFFO0lBQy9CLElBQUksQ0FBQzJDLE9BQU8sR0FBRyxJQUFJdUYsdURBQU0sQ0FBQ3ZGLE9BQU8sQ0FBQztJQUNsQyxJQUFJLENBQUMwQixPQUFPLEdBQUcsSUFBSTZELHVEQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3JDLElBQUksQ0FBQzNELE1BQU0sR0FBRyxJQUFJLENBQUM1QixPQUFPLENBQUN0QixLQUFLO0lBQ2hDLElBQUksQ0FBQ21ELE1BQU0sR0FBRyxJQUFJLENBQUNILE9BQU8sQ0FBQ2hELEtBQUs7SUFDaEMsSUFBSSxDQUFDK0csUUFBUSxHQUFHLElBQUlELHVEQUFNLENBQUMsSUFBSSxDQUFDOUQsT0FBTyxDQUFDO0lBQ3hDLElBQUksQ0FBQ3JFLFVBQVUsR0FBR0EsVUFBVTtJQUM1QixJQUFJLENBQUNxSSxNQUFNLEdBQUcsSUFBSSxDQUFDQyxLQUFLLEVBQUU7RUFDNUI7RUFFQUEsS0FBSyxDQUFDdEksVUFBVSxHQUFHLElBQUksQ0FBQ0EsVUFBVSxFQUFFO0lBQ2xDQSxVQUFVLENBQUN3RCxNQUFNLENBQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDMEIsT0FBTyxDQUFDO0lBQ3ZDM0MsVUFBVSxDQUFDNEQsV0FBVyxFQUFFO0lBQ3hCNUQsVUFBVSxDQUFDRyxNQUFNLENBQUNjLE9BQU8sQ0FBQyxJQUFJLENBQUMwQixPQUFPLENBQUM7RUFDekM7RUFFQU0sS0FBSyxDQUFDbEQsVUFBVSxHQUFHLElBQUksQ0FBQ0MsVUFBVSxDQUFDRyxNQUFNLEVBQUU7SUFDekMsSUFBSSxDQUFDSCxVQUFVLENBQUMyRCxJQUFJLEdBQUcsSUFBSWtELGlEQUFJLENBQUMsSUFBSSxFQUFFOUcsVUFBVSxDQUFDO0VBQ25EO0VBRUFnSSxJQUFJLENBQUMxRyxLQUFLLEVBQUVVLEtBQUssRUFBRVcsSUFBSSxHQUFHLElBQUksQ0FBQzFDLFVBQVUsQ0FBQzJELElBQUksRUFBRXlFLFFBQVEsR0FBRyxJQUFJLENBQUNBLFFBQVEsRUFBRTtJQUN4RSxJQUFJL0csS0FBSyxLQUFLLFFBQVEsRUFBRTtNQUN0QjtNQUNBLElBQUksQ0FBQ2tILFlBQVksQ0FBQ2xILEtBQUssRUFBRVUsS0FBSyxFQUFFVyxJQUFJLEVBQUUwRixRQUFRLENBQUM7TUFDL0MsTUFBTUksWUFBWSxHQUFHLElBQUksQ0FBQ2pFLE1BQU0sQ0FBQ2tFLGFBQWEsRUFBRTtNQUNoRCxJQUFJRCxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQ3pCO1FBQ0EsSUFBSSxDQUFDRSxXQUFXLENBQUNySCxLQUFLLENBQUM7UUFDdkJxQixJQUFJLENBQUNtRixRQUFRLEVBQUU7TUFDakI7SUFDRixDQUFDLE1BQU0sSUFBSXhHLEtBQUssS0FBSyxVQUFVLEVBQUU7TUFDL0I7TUFDQSxNQUFNc0gsR0FBRyxHQUFHLElBQUksQ0FBQ3RFLE9BQU8sQ0FBQ3VFLElBQUksQ0FBQzdHLEtBQUssQ0FBQ2dCLENBQUMsRUFBRWhCLEtBQUssQ0FBQ2lCLENBQUMsQ0FBQztNQUMvQ04sSUFBSSxDQUFDOEUsVUFBVSxDQUFDekYsS0FBSyxFQUFFNEcsR0FBRyxFQUFFdEgsS0FBSyxDQUFDO01BQ2xDLE1BQU1tSCxZQUFZLEdBQUcsSUFBSSxDQUFDaEUsTUFBTSxDQUFDaUUsYUFBYSxFQUFFO01BQ2hELElBQUksQ0FBQ3pJLFVBQVUsQ0FBQzRFLGlCQUFpQixFQUFFO01BQ25DLElBQUk0RCxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQ3pCO1FBQ0EsSUFBSSxDQUFDRSxXQUFXLENBQUNySCxLQUFLLENBQUM7UUFDdkJxQixJQUFJLENBQUNtRixRQUFRLEVBQUU7TUFDakIsQ0FBQyxNQUFNO1FBQ0w7UUFDQSxJQUFJLENBQUNFLElBQUksQ0FBQyxRQUFRLEVBQUVoRyxLQUFLLENBQUM7TUFDNUI7SUFDRjtJQUNBLElBQUksQ0FBQy9CLFVBQVUsQ0FBQ29FLGVBQWUsRUFBRTtFQUNuQztFQUVBbUUsWUFBWSxDQUFDbEgsS0FBSyxFQUFFVSxLQUFLLEVBQUVXLElBQUksRUFBRTBGLFFBQVEsRUFBRTtJQUN6QztJQUNBLElBQUlTLE9BQU8sR0FBR1QsUUFBUSxDQUFDUyxPQUFPO0lBQzlCOUcsS0FBSyxHQUFHcUcsUUFBUSxDQUFDVSxZQUFZLEVBQUU7SUFDL0IsSUFBSUMsU0FBUyxHQUFHWCxRQUFRLENBQUNZLFdBQVcsQ0FBQ2pILEtBQUssRUFBRSxJQUFJLENBQUN3QyxNQUFNLENBQUM7SUFDeEQ7SUFDQSxJQUFJc0UsT0FBTyxJQUFJLENBQUMsRUFBRTtNQUNoQjtNQUNBLE1BQU1JLFFBQVEsR0FBR2IsUUFBUSxDQUFDYyxhQUFhLENBQUNMLE9BQU8sRUFBRSxJQUFJLENBQUN0RSxNQUFNLENBQUM7TUFDN0QsSUFBSTBFLFFBQVEsSUFBSSxLQUFLLEVBQUU7UUFDckI7UUFDQSxJQUFJLENBQUNFLFdBQVcsQ0FBQ0YsUUFBUSxFQUFFNUgsS0FBSyxFQUFFcUIsSUFBSSxFQUFFMEYsUUFBUSxDQUFDO01BQ25ELENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBSSxDQUFDRyxZQUFZLENBQUNsSCxLQUFLLEVBQUVVLEtBQUssRUFBRVcsSUFBSSxFQUFFMEYsUUFBUSxDQUFDO01BQ2pEO0lBQ0YsQ0FBQyxNQUFNLElBQUlXLFNBQVMsS0FBSyxJQUFJLEVBQUU7TUFDN0I7TUFDQSxJQUFJLENBQUNJLFdBQVcsQ0FBQ3BILEtBQUssRUFBRVYsS0FBSyxFQUFFcUIsSUFBSSxFQUFFMEYsUUFBUSxDQUFDO0lBQ2hELENBQUMsTUFBTTtNQUNMO01BQ0EsSUFBSSxDQUFDRyxZQUFZLENBQUNsSCxLQUFLLEVBQUVVLEtBQUssRUFBRVcsSUFBSSxFQUFFMEYsUUFBUSxDQUFDO0lBQ2pEO0VBQ0Y7RUFFQWUsV0FBVyxDQUFDcEgsS0FBSyxFQUFFVixLQUFLLEVBQUVxQixJQUFJLEVBQUUwRixRQUFRLEVBQUU7SUFDeEN0RCxVQUFVLENBQUMsTUFBTTtNQUNmLElBQUk2RCxHQUFHLEdBQUcsSUFBSSxDQUFDaEcsT0FBTyxDQUFDaUcsSUFBSSxDQUFDN0csS0FBSyxDQUFDZ0IsQ0FBQyxFQUFFaEIsS0FBSyxDQUFDaUIsQ0FBQyxDQUFDO01BQzdDTixJQUFJLENBQUM4RSxVQUFVLENBQUN6RixLQUFLLEVBQUU0RyxHQUFHLEVBQUV0SCxLQUFLLENBQUM7TUFDbEMsSUFBSXNILEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFDaEJQLFFBQVEsQ0FBQ1MsT0FBTyxHQUFHOUcsS0FBSztRQUN4QnFHLFFBQVEsQ0FBQ2dCLE1BQU0sR0FBRyxLQUFLO01BQ3pCLENBQUMsTUFBTTtRQUNMaEIsUUFBUSxDQUFDZ0IsTUFBTSxHQUFHLElBQUk7TUFDeEI7SUFDRixDQUFDLEVBQUUsR0FBRyxDQUFDO0VBQ1Q7RUFFQVYsV0FBVyxDQUFDdkUsTUFBTSxFQUFFekIsSUFBSSxHQUFHLElBQUksQ0FBQzFDLFVBQVUsQ0FBQzJELElBQUksRUFBRTtJQUMvQyxNQUFNc0IsSUFBSSxHQUFHLElBQUksQ0FBQ29FLGNBQWMsQ0FBQ2xGLE1BQU0sQ0FBQztJQUN4Q3pCLElBQUksQ0FBQ2MsTUFBTSxDQUFDTSxXQUFXLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUM5RCxVQUFVLENBQUMrRSxRQUFRLENBQUNyQyxJQUFJLENBQUNjLE1BQU0sRUFBRXlCLElBQUksQ0FBQztFQUM3QztFQUVBb0UsY0FBYyxDQUFDbEYsTUFBTSxFQUFFO0lBQ3JCLElBQUlBLE1BQU0sSUFBSSxRQUFRLEVBQUU7TUFDdEIsT0FBTywyQkFBMkI7SUFDcEMsQ0FBQyxNQUFNO01BQ0wsT0FBUSxHQUFFLElBQUksQ0FBQ3hCLE9BQU8sQ0FBQzhELElBQUssV0FBVTtJQUN4QztFQUNGO0FBQ0Y7QUFFQSxpRUFBZWYsSUFBSTs7Ozs7Ozs7OztBQ2pIbkIsTUFBTTRELFNBQVMsQ0FBQztFQUNkeEosV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDd0IsSUFBSSxHQUFHLEVBQUU7SUFDZCxJQUFJLENBQUNELEtBQUssR0FBRyxJQUFJLENBQUNrSSxZQUFZLENBQUMsSUFBSSxDQUFDakksSUFBSSxDQUFDO0lBQ3pDLElBQUksQ0FBQzhILE1BQU0sR0FBRyxFQUFFO0lBQ2hCLElBQUksQ0FBQzNHLEtBQUssR0FBRyxFQUFFO0VBQ2pCO0VBRUE4RyxZQUFZLENBQUNqSSxJQUFJLEVBQUU7SUFDakIsTUFBTWtJLElBQUksR0FBR0MsS0FBSyxDQUFDbkksSUFBSSxDQUFDLENBQ3JCb0ksSUFBSSxFQUFFLENBQ05DLEdBQUcsQ0FBQyxNQUFNRixLQUFLLENBQUNuSSxJQUFJLENBQUMsQ0FBQ29JLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxPQUFPRixJQUFJO0VBQ2I7RUFFQWYsYUFBYSxDQUFDaEcsS0FBSyxHQUFHLElBQUksQ0FBQ0EsS0FBSyxFQUFFO0lBQ2hDLElBQUlnQyxHQUFHLEdBQUcsRUFBRTtJQUNaLEtBQUssSUFBSTNELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzJCLEtBQUssQ0FBQzdCLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDckMsSUFBSTJCLEtBQUssQ0FBQzNCLENBQUMsQ0FBQyxDQUFDNkQsSUFBSSxLQUFLLEtBQUssRUFBRTtRQUMzQkYsR0FBRyxDQUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDO01BQ2pCO0lBQ0Y7SUFDQSxJQUFJTyxHQUFHLENBQUM3RCxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ3BCLE9BQU8sSUFBSTtJQUNiLENBQUMsTUFBTTtNQUNMLE9BQU8sS0FBSztJQUNkO0VBQ0Y7RUFFQWdKLGVBQWUsQ0FBQzdHLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0lBQ3BCLElBQUksSUFBSSxDQUFDM0IsS0FBSyxDQUFDMEIsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUMxQixPQUFPLElBQUk7SUFDYixDQUFDLE1BQU07TUFDTCxPQUFPLEtBQUs7SUFDZDtFQUNGO0VBRUFGLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFRyxDQUFDLEVBQUVDLENBQUMsRUFBRWhCLElBQUksRUFBRTtJQUMxQjtJQUNBLElBQUksQ0FBQ1MsS0FBSyxDQUFDeUIsSUFBSSxDQUFDdEIsSUFBSSxDQUFDO0lBQ3JCRyxDQUFDLEdBQUdpQixNQUFNLENBQUNqQixDQUFDLENBQUM7SUFDYkMsQ0FBQyxHQUFHZ0IsTUFBTSxDQUFDaEIsQ0FBQyxDQUFDO0lBQ2IsSUFBSWhCLElBQUksSUFBSSxHQUFHLEVBQUU7TUFDZixLQUFLLElBQUlsQixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUc4QixJQUFJLENBQUNoQyxNQUFNLEVBQUVFLENBQUMsRUFBRSxFQUFFO1FBQ3BDOEIsSUFBSSxDQUFDYixLQUFLLENBQUNtQyxJQUFJLENBQUMsQ0FBQ25CLENBQUMsR0FBR2pDLENBQUMsRUFBRWtDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQzNCLEtBQUssQ0FBQzBCLENBQUMsR0FBR2pDLENBQUMsQ0FBQyxDQUFDa0MsQ0FBQyxDQUFDLEdBQUdKLElBQUk7UUFDM0JBLElBQUksQ0FBQ1osSUFBSSxHQUFHQSxJQUFJO01BQ2xCO0lBQ0YsQ0FBQyxNQUFNLElBQUlBLElBQUksSUFBSSxHQUFHLEVBQUU7TUFDdEIsS0FBSyxJQUFJbEIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHOEIsSUFBSSxDQUFDaEMsTUFBTSxFQUFFRSxDQUFDLEVBQUUsRUFBRTtRQUNwQzhCLElBQUksQ0FBQ2IsS0FBSyxDQUFDbUMsSUFBSSxDQUFDLENBQUNuQixDQUFDLEVBQUVDLENBQUMsR0FBR2xDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQ08sS0FBSyxDQUFDMEIsQ0FBQyxDQUFDLENBQUNDLENBQUMsR0FBR2xDLENBQUMsQ0FBQyxHQUFHOEIsSUFBSTtRQUMzQkEsSUFBSSxDQUFDWixJQUFJLEdBQUdBLElBQUk7TUFDbEI7SUFDRjtFQUNGO0VBRUE2SCxhQUFhLENBQUM5RyxDQUFDLEVBQUVDLENBQUMsRUFBRTtJQUNsQixNQUFNSixJQUFJLEdBQUcsSUFBSSxDQUFDdkIsS0FBSyxDQUFDMEIsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQztJQUM3QixNQUFNOEcsWUFBWSxHQUFHLElBQUksQ0FBQ0YsZUFBZSxDQUFDN0csQ0FBQyxFQUFFQyxDQUFDLENBQUM7SUFDL0MsSUFBSUosSUFBSSxJQUFJLENBQUMsSUFBSWtILFlBQVksS0FBSyxLQUFLLEVBQUU7TUFDdkNsSCxJQUFJLENBQUMrRixHQUFHLENBQUMsQ0FBQzVGLENBQUMsRUFBRUMsQ0FBQyxDQUFDLENBQUM7TUFDaEIsT0FBTyxLQUFLO0lBQ2QsQ0FBQyxNQUFNO01BQ0w7TUFDQSxNQUFNK0csU0FBUyxHQUFHLElBQUksQ0FBQ1gsTUFBTSxDQUFDMUUsTUFBTSxDQUFFc0YsTUFBTSxJQUFLO1FBQy9DLE9BQU9BLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSWpILENBQUMsSUFBSWlILE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSWhILENBQUM7TUFDekMsQ0FBQyxDQUFDO01BQ0Y7TUFDQSxJQUFJK0csU0FBUyxDQUFDbkosTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN4QjtNQUNGO01BQ0E7TUFBQSxLQUNLO1FBQ0gsSUFBSSxDQUFDd0ksTUFBTSxDQUFDbEYsSUFBSSxDQUFDLENBQUNuQixDQUFDLEVBQUVDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLE1BQU07TUFDZjtJQUNGO0VBQ0Y7QUFDRjtBQUVBaUgsTUFBTSxDQUFDQyxPQUFPLEdBQUdaLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRlU7QUFDVjtBQUUxQixNQUFNcEIsTUFBTSxDQUFDO0VBQ1hwSSxXQUFXLENBQUMyRyxJQUFJLEVBQUU7SUFDaEIsSUFBSSxDQUFDQSxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDcEYsS0FBSyxHQUFHLElBQUlpSSxtREFBUyxFQUFFO0lBQzVCLElBQUksQ0FBQzdHLEtBQUssR0FBRyxDQUNYLElBQUkwSCw4Q0FBSSxDQUFDLENBQUMsQ0FBQyxFQUNYLElBQUlBLDhDQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1gsSUFBSUEsOENBQUksQ0FBQyxDQUFDLENBQUMsRUFDWCxJQUFJQSw4Q0FBSSxDQUFDLENBQUMsQ0FBQyxFQUNYLElBQUlBLDhDQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1o7RUFDSDtFQUVBdkIsSUFBSSxDQUFDN0YsQ0FBQyxFQUFFQyxDQUFDLEVBQUU7SUFDVCxPQUFPLElBQUksQ0FBQzNCLEtBQUssQ0FBQ3dJLGFBQWEsQ0FBQzlHLENBQUMsRUFBRUMsQ0FBQyxDQUFDO0VBQ3ZDO0VBRUFpRSxJQUFJLENBQUM5QyxNQUFNLEVBQUU7SUFDWCxJQUFJLENBQUNBLE1BQU0sRUFBRTtNQUNYaUcsT0FBTyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQyxNQUFNO01BQ0xELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDO0VBQ0Y7QUFDRjtBQUVBLGlFQUFlbkMsTUFBTTs7Ozs7Ozs7Ozs7Ozs7O0FDN0JyQixNQUFNQyxNQUFNLENBQUM7RUFDWHJJLFdBQVcsQ0FBQ29CLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtJQUNwQixJQUFJLENBQUMrRixJQUFJLEdBQUcsSUFBSSxDQUFDQSxJQUFJLEVBQUU7SUFDdkIsSUFBSSxDQUFDNEIsT0FBTyxHQUFHLENBQUM7SUFDaEIsSUFBSSxDQUFDTyxNQUFNO0VBQ2I7RUFFQW5DLElBQUksQ0FBQy9GLE1BQU0sR0FBRyxJQUFJLENBQUNBLE1BQU0sRUFBRTtJQUN6QixNQUFNMEIsSUFBSSxHQUFHMUIsTUFBTSxDQUFDdUIsS0FBSyxDQUFDSSxLQUFLLEVBQUU7SUFDakMsTUFBTWIsSUFBSSxHQUFHLElBQUksQ0FBQ3NJLFVBQVUsRUFBRTtJQUM5QixJQUFJLENBQUMxSCxJQUFJLEVBQUU7SUFDWCxJQUFJLENBQUMySCxlQUFlLENBQUMzSCxJQUFJLEVBQUVaLElBQUksQ0FBQztFQUNsQztFQUVBdUksZUFBZSxDQUFDM0gsSUFBSSxFQUFFWixJQUFJLEVBQUU7SUFDMUIsTUFBTUQsS0FBSyxHQUFHLElBQUksQ0FBQytHLFlBQVksRUFBRTtJQUNqQyxNQUFNRSxXQUFXLEdBQUcsSUFBSSxDQUFDd0IsWUFBWSxDQUFDNUgsSUFBSSxFQUFFWixJQUFJLEVBQUVELEtBQUssQ0FBQztJQUN4RCxJQUFJaUgsV0FBVyxLQUFLLEtBQUssRUFBRTtNQUN6QjtNQUNBLElBQUksQ0FBQ3VCLGVBQWUsQ0FBQzNILElBQUksRUFBRVosSUFBSSxDQUFDO0lBQ2xDLENBQUMsTUFBTTtNQUNMO01BQ0EsSUFBSSxDQUFDZCxNQUFNLENBQUNHLEtBQUssQ0FBQ3lCLFNBQVMsQ0FBQ0YsSUFBSSxFQUFFYixLQUFLLENBQUNnQixDQUFDLEVBQUVoQixLQUFLLENBQUNpQixDQUFDLEVBQUVoQixJQUFJLENBQUM7TUFDekQsSUFBSSxDQUFDaUYsSUFBSSxFQUFFO0lBQ2I7RUFDRjtFQUVBdUQsWUFBWSxDQUFDNUgsSUFBSSxFQUFFWixJQUFJLEVBQUVELEtBQUssRUFBRWIsTUFBTSxHQUFHLElBQUksQ0FBQ0EsTUFBTSxFQUFFO0lBQ3BELE1BQU1OLE1BQU0sR0FBR2dDLElBQUksQ0FBQ2hDLE1BQU07SUFDMUIsTUFBTVMsS0FBSyxHQUFHSCxNQUFNLENBQUNHLEtBQUssQ0FBQ0EsS0FBSztJQUNoQyxJQUFJb0QsR0FBRyxHQUFHLEVBQUU7SUFDWixNQUFNMUIsQ0FBQyxHQUFHaUIsTUFBTSxDQUFDakMsS0FBSyxDQUFDZ0IsQ0FBQyxDQUFDO0lBQ3pCLE1BQU1DLENBQUMsR0FBR2dCLE1BQU0sQ0FBQ2pDLEtBQUssQ0FBQ2lCLENBQUMsQ0FBQztJQUN6QixLQUFLLElBQUlsQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdGLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDL0IsSUFBSWtCLElBQUksSUFBSSxHQUFHLEVBQUU7UUFDZixNQUFNUixNQUFNLEdBQUcsSUFBSSxDQUFDaUosT0FBTyxDQUFDLENBQUMxSCxDQUFDLEdBQUdqQyxDQUFDLENBQUMsRUFBRSxDQUFDa0MsQ0FBQyxDQUFDLEVBQUUzQixLQUFLLENBQUM7UUFDaEQsSUFBSUcsTUFBTSxJQUFJLENBQUMsSUFBSUEsTUFBTSxLQUFLLEtBQUssRUFBRTtVQUNuQ2lELEdBQUcsQ0FBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQjtNQUNGLENBQUMsTUFBTSxJQUFJbEMsSUFBSSxJQUFJLEdBQUcsRUFBRTtRQUN0QixNQUFNUixNQUFNLEdBQUcsSUFBSSxDQUFDaUosT0FBTyxDQUFDLENBQUMxSCxDQUFDLENBQUMsRUFBRSxDQUFDQyxDQUFDLEdBQUdsQyxDQUFDLENBQUMsRUFBRU8sS0FBSyxDQUFDO1FBQ2hELElBQUlHLE1BQU0sSUFBSSxDQUFDLElBQUlBLE1BQU0sS0FBSyxLQUFLLEVBQUU7VUFDbkNpRCxHQUFHLENBQUNQLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDakI7TUFDRjtJQUNGO0lBQ0EsSUFBSU8sR0FBRyxDQUFDN0QsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUM1QixPQUFPLEtBQUs7RUFDbkI7RUFFQTZKLE9BQU8sQ0FBQzFILENBQUMsRUFBRUMsQ0FBQyxFQUFFM0IsS0FBSyxFQUFFO0lBQ25CLElBQUkwQixDQUFDLElBQUksQ0FBQyxJQUFJQSxDQUFDLEdBQUcsRUFBRSxJQUFJQyxDQUFDLEdBQUcsRUFBRSxJQUFJQSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3hDLElBQUl4QixNQUFNLEdBQUdILEtBQUssQ0FBQzBCLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUM7TUFDeEIsT0FBT3hCLE1BQU07SUFDZixDQUFDLE1BQU07TUFDTCxPQUFPLEtBQUs7SUFDZDtFQUNGO0VBRUFzSCxZQUFZLEdBQUc7SUFDYixNQUFNL0YsQ0FBQyxHQUFHMkgsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3hDLE1BQU01SCxDQUFDLEdBQUcwSCxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDeEMsT0FBTztNQUFFN0gsQ0FBQztNQUFFQztJQUFFLENBQUM7RUFDakI7RUFFQXNILFVBQVUsR0FBRztJQUNYLE1BQU10SSxJQUFJLEdBQUcwSSxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDM0MsSUFBSTVJLElBQUksR0FBRyxDQUFDLEVBQUU7TUFDWixPQUFPLEdBQUc7SUFDWixDQUFDLE1BQU07TUFDTCxPQUFPLEdBQUc7SUFDWjtFQUNGO0VBRUFrSCxhQUFhLENBQUNMLE9BQU8sRUFBRXhILEtBQUssRUFBRTtJQUM1QixJQUFJd0osS0FBSyxHQUFHLENBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNSO0lBQ0QsTUFBTTlILENBQUMsR0FBR2lCLE1BQU0sQ0FBQzZFLE9BQU8sQ0FBQzlGLENBQUMsQ0FBQztJQUMzQixNQUFNQyxDQUFDLEdBQUdnQixNQUFNLENBQUM2RSxPQUFPLENBQUM3RixDQUFDLENBQUM7SUFDM0IsSUFBSStGLFNBQVM7SUFDYixJQUFJRSxRQUFRO0lBQ1osTUFBTTZCLE1BQU0sR0FBR3pKLEtBQUssQ0FBQ0EsS0FBSyxDQUFDMEIsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQztJQUNoQyxNQUFNK0gsSUFBSSxHQUFHLElBQUksQ0FBQ0MsV0FBVyxDQUFDRixNQUFNLENBQUM7SUFDckMsSUFBSUEsTUFBTSxDQUFDbkcsSUFBSSxLQUFLLElBQUksRUFBRTtNQUN4QixJQUFJLENBQUNrRSxPQUFPLEdBQUcsQ0FBQztNQUNoQixPQUFPLEtBQUs7SUFDZCxDQUFDLE1BQU0sSUFBSWtDLElBQUksRUFBRTtNQUNmO01BQ0E5QixRQUFRLEdBQUcsSUFBSSxDQUFDZ0MsZ0JBQWdCLENBQUNGLElBQUksRUFBRTFKLEtBQUssQ0FBQztNQUM3QyxJQUFJNEgsUUFBUSxFQUFFLE9BQU9BLFFBQVEsQ0FBQyxLQUN6QjtRQUNILElBQUk4QixJQUFJLENBQUNHLFFBQVEsQ0FBQ25JLENBQUMsR0FBR2dJLElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzlGLENBQUMsRUFBRTtVQUNwQ2tHLFFBQVEsR0FBRztZQUFFbEcsQ0FBQyxFQUFFZ0ksSUFBSSxDQUFDRyxRQUFRLENBQUNuSSxDQUFDLEdBQUcsQ0FBQztZQUFFQyxDQUFDLEVBQUUrSCxJQUFJLENBQUNHLFFBQVEsQ0FBQ2xJO1VBQUUsQ0FBQztRQUMzRCxDQUFDLE1BQU0sSUFBSStILElBQUksQ0FBQ0csUUFBUSxDQUFDbkksQ0FBQyxHQUFHZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQyxFQUFFO1VBQzNDa0csUUFBUSxHQUFHO1lBQUVsRyxDQUFDLEVBQUVnSSxJQUFJLENBQUNHLFFBQVEsQ0FBQ25JLENBQUMsR0FBRyxDQUFDO1lBQUVDLENBQUMsRUFBRStILElBQUksQ0FBQ0csUUFBUSxDQUFDbEk7VUFBRSxDQUFDO1FBQzNELENBQUMsTUFBTSxJQUFJK0gsSUFBSSxDQUFDRyxRQUFRLENBQUNsSSxDQUFDLEdBQUcrSCxJQUFJLENBQUNsQyxPQUFPLENBQUM3RixDQUFDLEVBQUU7VUFDM0NpRyxRQUFRLEdBQUc7WUFBRWxHLENBQUMsRUFBRWdJLElBQUksQ0FBQ0csUUFBUSxDQUFDbkksQ0FBQztZQUFFQyxDQUFDLEVBQUUrSCxJQUFJLENBQUNHLFFBQVEsQ0FBQ2xJLENBQUMsR0FBRztVQUFFLENBQUM7UUFDM0QsQ0FBQyxNQUFNLElBQUkrSCxJQUFJLENBQUNHLFFBQVEsQ0FBQ25JLENBQUMsR0FBR2dJLElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzlGLENBQUMsRUFBRTtVQUMzQ2tHLFFBQVEsR0FBRztZQUFFbEcsQ0FBQyxFQUFFZ0ksSUFBSSxDQUFDRyxRQUFRLENBQUNuSSxDQUFDO1lBQUVDLENBQUMsRUFBRStILElBQUksQ0FBQ0csUUFBUSxDQUFDbEksQ0FBQyxHQUFHO1VBQUUsQ0FBQztRQUMzRDtRQUNBLElBQUksSUFBSSxDQUFDZ0csV0FBVyxDQUFDQyxRQUFRLEVBQUU1SCxLQUFLLENBQUMsRUFBRSxPQUFPNEgsUUFBUTtNQUN4RDtJQUNGO0lBQ0E7SUFDQSxLQUFLLElBQUluSSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcrSixLQUFLLENBQUNqSyxNQUFNLEVBQUVFLENBQUMsRUFBRSxFQUFFO01BQ3JDO01BQ0EsSUFBSXFLLEtBQUssR0FBR3BJLENBQUMsR0FBR2lCLE1BQU0sQ0FBQzZHLEtBQUssQ0FBQy9KLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25DLElBQUlzSyxLQUFLLEdBQUdwSSxDQUFDLEdBQUdnQixNQUFNLENBQUM2RyxLQUFLLENBQUMvSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNuQ21JLFFBQVEsR0FBRztRQUFFbEcsQ0FBQyxFQUFFb0ksS0FBSztRQUFFbkksQ0FBQyxFQUFFb0k7TUFBTSxDQUFDO01BQ2pDO01BQ0FyQyxTQUFTLEdBQUcsSUFBSSxDQUFDQyxXQUFXLENBQUNDLFFBQVEsRUFBRTVILEtBQUssQ0FBQztNQUM3QyxJQUFJMEgsU0FBUyxLQUFLLElBQUksRUFBRTtRQUN0QixPQUFPRSxRQUFRO01BQ2pCO0lBQ0Y7SUFDQTtJQUNBLElBQUlGLFNBQVMsS0FBSyxLQUFLLEVBQUU7TUFDdkI7TUFDQSxJQUFJLENBQUNGLE9BQU8sR0FBRyxDQUFDO01BQ2hCO01BQ0EsT0FBTyxLQUFLO0lBQ2Q7RUFDRjtFQUVBb0MsZ0JBQWdCLENBQUNGLElBQUksRUFBRTFKLEtBQUssRUFBRTtJQUM1QixJQUFJNEgsUUFBUTtJQUNaLElBQUk4QixJQUFJLENBQUNNLFdBQVcsQ0FBQ3RJLENBQUMsSUFBSWdJLElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzlGLENBQUMsRUFBRTtNQUN4Q2tHLFFBQVEsR0FBRyxJQUFJLENBQUNxQyxpQkFBaUIsQ0FBQ1AsSUFBSSxFQUFFMUosS0FBSyxDQUFDO0lBQ2hELENBQUMsTUFBTSxJQUFJMEosSUFBSSxDQUFDTSxXQUFXLENBQUNySSxDQUFDLElBQUkrSCxJQUFJLENBQUNsQyxPQUFPLENBQUM3RixDQUFDLEVBQUU7TUFDL0NpRyxRQUFRLEdBQUcsSUFBSSxDQUFDc0MsaUJBQWlCLENBQUNSLElBQUksRUFBRTFKLEtBQUssQ0FBQztJQUNoRDtJQUNBLE9BQU80SCxRQUFRO0VBQ2pCO0VBRUFxQyxpQkFBaUIsQ0FBQ1AsSUFBSSxFQUFFMUosS0FBSyxFQUFFO0lBQzdCLElBQUk0SCxRQUFRO0lBQ1osSUFBSWxHLENBQUM7SUFDTCxJQUFJZ0ksSUFBSSxDQUFDTSxXQUFXLENBQUN0SSxDQUFDLEdBQUdnSSxJQUFJLENBQUNsQyxPQUFPLENBQUM5RixDQUFDLEVBQUU7TUFDdkM7TUFDQUEsQ0FBQyxHQUFHZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQyxHQUFHLENBQUM7SUFDeEIsQ0FBQyxNQUFNO01BQ0w7TUFDQUEsQ0FBQyxHQUFHZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQyxHQUFHLENBQUM7SUFDeEI7SUFDQWtHLFFBQVEsR0FBRztNQUFFbEcsQ0FBQztNQUFFQyxDQUFDLEVBQUUrSCxJQUFJLENBQUNsQyxPQUFPLENBQUM3RjtJQUFFLENBQUM7SUFDbkMsSUFBSSxJQUFJLENBQUNnRyxXQUFXLENBQUNDLFFBQVEsRUFBRTVILEtBQUssQ0FBQyxFQUFFO01BQ3JDLE9BQU80SCxRQUFRO0lBQ2pCLENBQUMsTUFBTTtNQUNMO01BQ0FsRyxDQUFDLEdBQUdBLENBQUMsSUFBSUEsQ0FBQyxHQUFHZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQyxDQUFDO01BQzVCa0csUUFBUSxHQUFHO1FBQUVsRyxDQUFDO1FBQUVDLENBQUMsRUFBRStILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGO01BQUUsQ0FBQztNQUNuQyxJQUFJLElBQUksQ0FBQ2dHLFdBQVcsQ0FBQ0MsUUFBUSxFQUFFNUgsS0FBSyxDQUFDLEVBQUU7UUFDckMsT0FBTzRILFFBQVE7TUFDakIsQ0FBQyxNQUFNO1FBQ0w7UUFDQWxHLENBQUMsR0FBR0EsQ0FBQyxHQUFHLENBQUMsSUFBSUEsQ0FBQyxHQUFHZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQyxDQUFDO1FBQ2hDa0csUUFBUSxHQUFHO1VBQUVsRyxDQUFDO1VBQUVDLENBQUMsRUFBRStILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGO1FBQUUsQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQ2dHLFdBQVcsQ0FBQ0MsUUFBUSxFQUFFNUgsS0FBSyxDQUFDLEVBQUU7VUFDckMsT0FBTzRILFFBQVE7UUFDakI7TUFDRjtNQUNBO01BQ0EsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQUVBc0MsaUJBQWlCLENBQUNSLElBQUksRUFBRTFKLEtBQUssRUFBRTtJQUM3QixJQUFJNEgsUUFBUTtJQUNaLElBQUlqRyxDQUFDO0lBQ0wsSUFBSStILElBQUksQ0FBQ00sV0FBVyxDQUFDckksQ0FBQyxHQUFHK0gsSUFBSSxDQUFDbEMsT0FBTyxDQUFDN0YsQ0FBQyxFQUFFO01BQ3ZDO01BQ0FBLENBQUMsR0FBRytILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGLENBQUMsR0FBRyxDQUFDO0lBQ3hCLENBQUMsTUFBTTtNQUNMO01BQ0FBLENBQUMsR0FBRytILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGLENBQUMsR0FBRyxDQUFDO0lBQ3hCO0lBQ0FpRyxRQUFRLEdBQUc7TUFBRWxHLENBQUMsRUFBRWdJLElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzlGLENBQUM7TUFBRUM7SUFBRSxDQUFDO0lBQ25DLElBQUksSUFBSSxDQUFDZ0csV0FBVyxDQUFDQyxRQUFRLEVBQUU1SCxLQUFLLENBQUMsRUFBRTtNQUNyQyxPQUFPNEgsUUFBUTtJQUNqQixDQUFDLE1BQU07TUFDTDtNQUNBakcsQ0FBQyxHQUFHQSxDQUFDLElBQUlBLENBQUMsR0FBRytILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGLENBQUMsQ0FBQztNQUM1QmlHLFFBQVEsR0FBRztRQUFFbEcsQ0FBQyxFQUFFZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQztRQUFFQztNQUFFLENBQUM7TUFDbkMsSUFBSSxJQUFJLENBQUNnRyxXQUFXLENBQUNDLFFBQVEsRUFBRTVILEtBQUssQ0FBQyxFQUFFO1FBQ3JDLE9BQU80SCxRQUFRO01BQ2pCLENBQUMsTUFBTTtRQUNMO1FBQ0FqRyxDQUFDLEdBQUdBLENBQUMsR0FBRyxDQUFDLElBQUlBLENBQUMsR0FBRytILElBQUksQ0FBQ2xDLE9BQU8sQ0FBQzdGLENBQUMsQ0FBQztRQUNoQ2lHLFFBQVEsR0FBRztVQUFFbEcsQ0FBQyxFQUFFZ0ksSUFBSSxDQUFDbEMsT0FBTyxDQUFDOUYsQ0FBQztVQUFFQztRQUFFLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUNnRyxXQUFXLENBQUNDLFFBQVEsRUFBRTVILEtBQUssQ0FBQyxFQUFFO1VBQ3JDLE9BQU80SCxRQUFRO1FBQ2pCO01BQ0Y7SUFDRjtJQUNBO0lBQ0EsT0FBTyxJQUFJO0VBQ2I7RUFFQStCLFdBQVcsQ0FBQ0YsTUFBTSxFQUFFO0lBQ2xCLE1BQU1sSyxNQUFNLEdBQUdrSyxNQUFNLENBQUNDLElBQUksQ0FBQ25LLE1BQU07SUFDakMsSUFBSUEsTUFBTSxJQUFJLENBQUMsRUFBRTtNQUNmLElBQUlzSyxRQUFRLEdBQUdKLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUM3QkcsUUFBUSxHQUFHO1FBQUVuSSxDQUFDLEVBQUVtSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQUVsSSxDQUFDLEVBQUVrSSxRQUFRLENBQUMsQ0FBQztNQUFFLENBQUM7TUFDN0MsSUFBSUcsV0FBVyxHQUFHUCxNQUFNLENBQUNDLElBQUksQ0FBQ25LLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDekN5SyxXQUFXLEdBQUc7UUFBRXRJLENBQUMsRUFBRXNJLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFBRXJJLENBQUMsRUFBRXFJLFdBQVcsQ0FBQyxDQUFDO01BQUUsQ0FBQztNQUN0RCxNQUFNeEMsT0FBTyxHQUFHLElBQUksQ0FBQ0EsT0FBTztNQUM1QixNQUFNa0MsSUFBSSxHQUFHO1FBQUVHLFFBQVE7UUFBRXJDLE9BQU87UUFBRXdDO01BQVksQ0FBQztNQUMvQyxPQUFPTixJQUFJO0lBQ2I7RUFDRjtFQUVBL0IsV0FBVyxDQUFDakgsS0FBSyxFQUFFVixLQUFLLEVBQUU7SUFDeEIsSUFBSVUsS0FBSyxDQUFDZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSWhCLEtBQUssQ0FBQ2dCLENBQUMsR0FBRyxFQUFFLElBQUloQixLQUFLLENBQUNpQixDQUFDLElBQUksQ0FBQyxJQUFJakIsS0FBSyxDQUFDaUIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtNQUNoRSxNQUFNNEYsSUFBSSxHQUFHdkgsS0FBSyxDQUFDQSxLQUFLLENBQUNVLEtBQUssQ0FBQ2dCLENBQUMsQ0FBQyxDQUFDaEIsS0FBSyxDQUFDaUIsQ0FBQyxDQUFDO01BQzFDLE1BQU15QixHQUFHLEdBQUcsRUFBRTtNQUNkLElBQUkyRSxNQUFNLEdBQUcsSUFBSSxDQUFDb0MsZ0JBQWdCLENBQUN6SixLQUFLLEVBQUVWLEtBQUssQ0FBQztNQUNoRCxJQUFJK0gsTUFBTSxLQUFLLElBQUksRUFBRSxPQUFPLEtBQUs7TUFDakMsSUFBSVIsSUFBSSxJQUFJLEdBQUcsSUFBSVEsTUFBTSxLQUFLLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQyxLQUM1QyxJQUFJLE9BQU9SLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDakNBLElBQUksQ0FBQ21DLElBQUksQ0FBQzVJLE9BQU8sQ0FBRXdHLEdBQUcsSUFBSztVQUN6QixJQUFJQSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUk1RyxLQUFLLENBQUNnQixDQUFDLElBQUk0RixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUk1RyxLQUFLLENBQUNpQixDQUFDLEVBQUU7WUFDMUN5QixHQUFHLENBQUNQLElBQUksQ0FBQyxLQUFLLENBQUM7VUFDakI7UUFDRixDQUFDLENBQUM7UUFDRixJQUFJTyxHQUFHLENBQUM3RCxNQUFNLElBQUksQ0FBQyxFQUFFO1VBQ25CLE9BQU8sSUFBSTtRQUNiLENBQUMsTUFBTSxPQUFPLEtBQUs7TUFDckI7SUFDRixDQUFDLE1BQU0sT0FBTyxLQUFLO0VBQ3JCO0VBRUE0SyxnQkFBZ0IsQ0FBQ3pKLEtBQUssRUFBRVYsS0FBSyxFQUFFO0lBQzdCLE1BQU1vSyxXQUFXLEdBQUdwSyxLQUFLLENBQUMrSCxNQUFNO0lBQ2hDLE1BQU1zQyxRQUFRLEdBQUdELFdBQVcsQ0FBQy9HLE1BQU0sQ0FBRXNGLE1BQU0sSUFBSztNQUM5QyxPQUFPQSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlqSSxLQUFLLENBQUNnQixDQUFDLElBQUlpSCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlqSSxLQUFLLENBQUNpQixDQUFDO0lBQ3JELENBQUMsQ0FBQztJQUNGLElBQUkwSSxRQUFRLENBQUM5SyxNQUFNLElBQUksQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDLEtBQ2xDLE9BQU8sSUFBSTtFQUNsQjtBQUNGO0FBRUEsaUVBQWV1SCxNQUFNOzs7Ozs7Ozs7O0FDdFByQixNQUFNZ0MsSUFBSSxDQUFDO0VBQ1RySyxXQUFXLENBQUNjLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtJQUNwQixJQUFJLENBQUNtSyxJQUFJLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQ3BHLElBQUksR0FBRyxJQUFJLENBQUNnSCxPQUFPLEVBQUU7SUFDMUIsSUFBSSxDQUFDNUosS0FBSyxHQUFHLEVBQUU7SUFDZjtFQUNGOztFQUVBNEosT0FBTyxDQUFDL0ssTUFBTSxHQUFHLElBQUksQ0FBQ0EsTUFBTSxFQUFFbUssSUFBSSxHQUFHLElBQUksQ0FBQ0EsSUFBSSxFQUFFO0lBQzlDLElBQUluSyxNQUFNLEtBQUttSyxJQUFJLENBQUNuSyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FDbkMsT0FBTyxLQUFLO0VBQ25CO0VBRUErSCxHQUFHLENBQUM1RyxLQUFLLEVBQUU7SUFDVCxNQUFNZ0ksU0FBUyxHQUFHLElBQUksQ0FBQ2dCLElBQUksQ0FBQ3JHLE1BQU0sQ0FBRXNGLE1BQU0sSUFBSztNQUM3QyxPQUFPQSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlqSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUlpSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUlqSSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztJQUNGLElBQUlnSSxTQUFTLENBQUNuSixNQUFNLElBQUksQ0FBQyxFQUFFO01BQ3pCLElBQUksQ0FBQ21LLElBQUksQ0FBQzdHLElBQUksQ0FBQ25DLEtBQUssQ0FBQztJQUN2QjtJQUNBLElBQUksQ0FBQzRDLElBQUksR0FBRyxJQUFJLENBQUNnSCxPQUFPLEVBQUU7SUFDMUIsT0FBTyxJQUFJLENBQUNaLElBQUk7RUFDbEI7QUFDRjtBQUVBZCxNQUFNLENBQUNDLE9BQU8sR0FBR0MsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJyQjtBQUM2RztBQUNqQjtBQUNPO0FBQ25HLDRDQUE0QyxvSkFBbUQ7QUFDL0YsNENBQTRDLDhJQUFnRDtBQUM1Riw0Q0FBNEMsNEhBQXVDO0FBQ25GLDRDQUE0QyxvSEFBbUM7QUFDL0UsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRix5Q0FBeUMsc0ZBQStCO0FBQ3hFLHlDQUF5QyxzRkFBK0I7QUFDeEUseUNBQXlDLHNGQUErQjtBQUN4RSx5Q0FBeUMsc0ZBQStCO0FBQ3hFO0FBQ0EsaURBQWlELHVCQUF1Qiw0QkFBNEIsdUJBQXVCLHVCQUF1Qix1QkFBdUIsdUJBQXVCLHVCQUF1Qix5QkFBeUIsb0JBQW9CLHVDQUF1QyxHQUFHLGdCQUFnQiw2QkFBNkIseURBQXlELEdBQUcsZ0JBQWdCLDJCQUEyQix5REFBeUQsR0FBRyxPQUFPLGVBQWUsY0FBYywyQkFBMkIsR0FBRyxVQUFVLHFCQUFxQixzQkFBc0IsaUJBQWlCLGdCQUFnQixHQUFHLFVBQVUsMENBQTBDLHNCQUFzQixxQkFBcUIsa0JBQWtCLDRCQUE0Qix3QkFBd0IsZ0VBQWdFLDJCQUEyQixnQ0FBZ0MsR0FBRyxvQ0FBb0MsaUJBQWlCLHNCQUFzQixrQkFBa0IsMkJBQTJCLG1DQUFtQyx3QkFBd0IsMENBQTBDLEdBQUcsaUNBQWlDLDBCQUEwQix1QkFBdUIsc0JBQXNCLHNCQUFzQix3QkFBd0IsMENBQTBDLCtCQUErQixxREFBcUQsR0FBRyxxQkFBcUIsdUJBQXVCLHNCQUFzQiwwQkFBMEIsd0JBQXdCLDBCQUEwQixzQkFBc0IsR0FBRyxxQkFBcUIsZ0NBQWdDLGVBQWUsaUJBQWlCLHVCQUF1Qix5Q0FBeUMsa0JBQWtCLDRCQUE0Qix3QkFBd0IsMEJBQTBCLDZCQUE2QixHQUFHLGtCQUFrQix1QkFBdUIsMEJBQTBCLHdCQUF3Qix1QkFBdUIseUNBQXlDLG9CQUFvQixHQUFHLDJCQUEyQiw4Q0FBOEMsNEVBQTRFLDhCQUE4Qix1QkFBdUIsOEJBQThCLDBCQUEwQixvQkFBb0IsbUJBQW1CLHVCQUF1QixvQkFBb0Isc0JBQXNCLHNCQUFzQiwwQkFBMEIscUNBQXFDLDBDQUEwQywrQkFBK0IscURBQXFELEdBQUcsZ0JBQWdCLHFFQUFxRSw4QkFBOEIsR0FBRyxlQUFlLHVCQUF1QixhQUFhLEdBQUcsNkJBQTZCLGtCQUFrQiwyQkFBMkIsd0JBQXdCLDRCQUE0QixpQkFBaUIsaUJBQWlCLGNBQWMsR0FBRyxXQUFXLHNCQUFzQiwwQkFBMEIsMENBQTBDLCtCQUErQixxREFBcUQsNkJBQTZCLEdBQUcsV0FBVyxnQkFBZ0IsZ0JBQWdCLHNCQUFzQixrQ0FBa0Msa0JBQWtCLGlEQUFpRCx1QkFBdUIsMEJBQTBCLHdDQUF3QywwQ0FBMEMsK0JBQStCLHFEQUFxRCxHQUFHLGlCQUFpQix5Q0FBeUMsR0FBRyx3QkFBd0IsdUJBQXVCLHNCQUFzQixHQUFHLDhDQUE4QyxpQkFBaUIsaUJBQWlCLGtCQUFrQiwwQkFBMEIsd0JBQXdCLGtCQUFrQixxQkFBcUIsR0FBRyxtQkFBbUIsa0JBQWtCLDRDQUE0Qyx5Q0FBeUMsYUFBYSxnQkFBZ0IsaUJBQWlCLDBCQUEwQix3QkFBd0IsOENBQThDLGtDQUFrQywwQ0FBMEMsc0NBQXNDLCtCQUErQixxREFBcUQseUJBQXlCLEdBQUcsYUFBYSxnQkFBZ0IsaUJBQWlCLCtDQUErQyx1QkFBdUIsNEJBQTRCLGlDQUFpQyxHQUFHLFVBQVUsc0JBQXNCLDJCQUEyQiwwQkFBMEIsR0FBRyxrQkFBa0Isd0JBQXdCLEdBQUcsY0FBYyxvQkFBb0IsOENBQThDLEdBQUcsVUFBVSwyQ0FBMkMsR0FBRyxXQUFXLCtDQUErQyxvQkFBb0IsNkRBQTZELEdBQUcsdUJBQXVCLGtCQUFrQiwyQkFBMkIsNEJBQTRCLHdCQUF3Qix5QkFBeUIsR0FBRyxrQkFBa0IsMkJBQTJCLDBCQUEwQix3QkFBd0Isb0JBQW9CLDBCQUEwQixHQUFHLGFBQWEsc0JBQXNCLEdBQUcsbUJBQW1CLHFDQUFxQyxHQUFHLFVBQVUsMEJBQTBCLHdCQUF3QixHQUFHLFdBQVcsMkJBQTJCLEdBQUcsNkJBQTZCLHNCQUFzQix1QkFBdUIsZ0NBQWdDLGdCQUFnQixnQkFBZ0Isa0JBQWtCLDRCQUE0Qix3QkFBd0IsMEJBQTBCLDZCQUE2QiwwQkFBMEIsd0JBQXdCLDhDQUE4QyxrQ0FBa0MsMENBQTBDLEdBQUcsT0FBTywwQkFBMEIsb0JBQW9CLDBCQUEwQixHQUFHLGFBQWEsMEJBQTBCLEdBQUcsZ0JBQWdCLDBCQUEwQixHQUFHLHlCQUF5QixVQUFVLGtDQUFrQyxLQUFLLFFBQVEsK0JBQStCLEtBQUssR0FBRyx3QkFBd0IsUUFBUSxpQkFBaUIsS0FBSyxVQUFVLGlCQUFpQixLQUFLLEdBQUcsNkJBQTZCLFVBQVUsbUNBQW1DLEtBQUssUUFBUSwrQkFBK0IsS0FBSyxHQUFHLGdDQUFnQyxVQUFVLCtCQUErQixLQUFLLFFBQVEsbUNBQW1DLEtBQUssR0FBRyxvREFBb0QsY0FBYyw2Q0FBNkMsS0FBSyxHQUFHLCtCQUErQixjQUFjLG9CQUFvQixLQUFLLFlBQVksd0JBQXdCLEtBQUssR0FBRywrQkFBK0IsbUJBQW1CLG9CQUFvQiw4Q0FBOEMsMkNBQTJDLEtBQUssZUFBZSxrQkFBa0IsbUJBQW1CLEtBQUssbUJBQW1CLHdCQUF3QixLQUFLLHVCQUF1QixzQkFBc0IsS0FBSyxhQUFhLHNCQUFzQix5QkFBeUIsS0FBSyxHQUFHLCtCQUErQixtQkFBbUIsb0JBQW9CLDhDQUE4QywyQ0FBMkMsS0FBSyxlQUFlLGtCQUFrQixtQkFBbUIsS0FBSyxtQkFBbUIsd0JBQXdCLEtBQUssR0FBRywrQkFBK0IsbUJBQW1CLG9CQUFvQiw4Q0FBOEMsMkNBQTJDLHlCQUF5QixLQUFLLHNCQUFzQixrQkFBa0Isb0JBQW9CLDhCQUE4QiwwQkFBMEIseUJBQXlCLEtBQUssZUFBZSxrQkFBa0IsbUJBQW1CLEtBQUsseUJBQXlCLG9CQUFvQixxQ0FBcUMsS0FBSyx1QkFBdUIsOEJBQThCLEtBQUsscUJBQXFCLDhCQUE4QixLQUFLLFlBQVksK0JBQStCLEtBQUssYUFBYSxpQkFBaUIsS0FBSyxHQUFHLGdDQUFnQyxtQkFBbUIsb0JBQW9CLDhDQUE4QywyQ0FBMkMseUJBQXlCLEtBQUssZUFBZSxrQkFBa0IsbUJBQW1CLEtBQUsseUJBQXlCLGdCQUFnQixLQUFLLGFBQWEsaUJBQWlCLEtBQUssZUFBZSx3QkFBd0IsS0FBSyxHQUFHLGdDQUFnQyxtQkFBbUIsb0JBQW9CLDhDQUE4QywyQ0FBMkMseUJBQXlCLEtBQUssZUFBZSxrQkFBa0IsbUJBQW1CLEtBQUssdUJBQXVCLHdCQUF3QixLQUFLLG9CQUFvQix3QkFBd0IsS0FBSyxZQUFZLHdCQUF3QixLQUFLLG9CQUFvQix3QkFBd0IsS0FBSyxHQUFHLGdDQUFnQyxpQkFBaUIsc0JBQXNCLEtBQUssa0VBQWtFLHNCQUFzQixLQUFLLFlBQVksc0JBQXNCLG9CQUFvQixLQUFLLGVBQWUsd0JBQXdCLEtBQUssbUJBQW1CLG9CQUFvQiw4Q0FBOEMsMkNBQTJDLHlCQUF5QixlQUFlLEtBQUssZUFBZSxrQkFBa0IsbUJBQW1CLEtBQUssb0JBQW9CLHdCQUF3QixLQUFLLFlBQVksd0JBQXdCLEtBQUssb0JBQW9CLHdCQUF3QixLQUFLLEdBQUcsU0FBUyx1RkFBdUYsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLGFBQWEsTUFBTSxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sV0FBVyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLE9BQU8sV0FBVyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLFdBQVcsTUFBTSxXQUFXLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxhQUFhLE1BQU0sVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLFdBQVcsS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFVBQVUsS0FBSyxNQUFNLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sYUFBYSxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtB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d2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9ET00vYm9hcmRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9ET00vY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvRE9NL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvRE9NL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL0RPTS9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9ET00vaGVhZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvb2JqZWN0cy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL29iamVjdHMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9vYmplY3RzL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvb2JqZWN0cy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz9mZjk0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQm9hcmRzIHtcbiAgY29uc3RydWN0b3IoYmFja2dyb3VuZCwgY29tcG9uZW50cykge1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5fYm9hcmRzKGJhY2tncm91bmQpO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gIH1cblxuICBfYm9hcmRzKGJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmQpIHtcbiAgICAvLyBDcmVhdGUgYm9hcmRzIHdyYXBwZXIgZWxlbWVudFxuICAgIGNvbnN0IGJvYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYm9hcmRzLmNsYXNzTGlzdC5hZGQoXCJib2FyZHMtY29udGFpbmVyXCIpO1xuICAgIGJvYXJkcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgYmFja2dyb3VuZC5hcHBlbmQoYm9hcmRzKTtcbiAgICByZXR1cm4gYm9hcmRzO1xuICB9XG5cbiAgX2NsZWFyKGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gY29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb250YWluZXIuZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBfcmVuZGVyKHBsYXllciwgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIpIHtcbiAgICBjb25zdCBib2FyZFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJvYXJkV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtd3JhcHBlclwiKTtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGxheWVyQm9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllci1ib2FyZFwiKTtcbiAgICBib2FyZFdyYXBwZXIuYXBwZW5kKHBsYXllckJvYXJkKTtcbiAgICBjb250YWluZXIuYXBwZW5kKGJvYXJkV3JhcHBlcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXIuYm9hcmQuc2l6ZTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBsYXllci5ib2FyZC5zaXplOyBqKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHgke2p9eSR7aX1gKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJzcXVhcmVcIik7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKFwibm90LWFsbG93ZWRcIik7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIChlKSA9PiB0aGlzLiNzcXVhcmVIb292ZXIoZSkpO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIChlKSA9PiB0aGlzLiNzcXVhcmVNb3VzZU91dChlKSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHRoaXMuI3NxdWFyZUNsaWNrKGUpKTtcbiAgICAgICAgcGxheWVyQm9hcmQuYXBwZW5kKHNxdWFyZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwbGF5ZXJCb2FyZDtcbiAgfVxuXG4gIF9zaGlwUGxhY2VkKGluZGV4LCBheGlzLCBsZW5ndGgsIGNvbXBvbmVudHMgPSB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gY29tcG9uZW50cy5fZmluZFNxdWFyZXMoaW5kZXgsIGxlbmd0aCwgYXhpcyk7XG4gICAgc3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gICNzcXVhcmVIb292ZXIoZSwgY29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cykge1xuICAgIGNvbnN0IGxlbmd0aCA9IGNvbXBvbmVudHMuX3JldHJpZXZlTGVuZ3RoKCk7XG4gICAgY29uc3QgYXhpcyA9IGNvbXBvbmVudHMuX3JldHJpZXZlQXhpcygpO1xuICAgIGxldCBpbmRleCA9IGNvbXBvbmVudHMuX2luZGV4KGUudGFyZ2V0LmNsYXNzTGlzdFswXSk7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGNvbXBvbmVudHMuX2ZpbmRTcXVhcmVzKGluZGV4LCBsZW5ndGgsIGF4aXMpO1xuICAgIGlmIChzcXVhcmVzID09PSBmYWxzZSkge1xuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcInJlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoXCJub3QtYWxsb3dlZFwiKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJhbGxvd2VkXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgI3NxdWFyZU1vdXNlT3V0KGUsIGNvbXBvbmVudHMgPSB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICBjb25zdCBsZW5ndGggPSBjb21wb25lbnRzLl9yZXRyaWV2ZUxlbmd0aCgpO1xuICAgIGNvbnN0IGF4aXMgPSBjb21wb25lbnRzLl9yZXRyaWV2ZUF4aXMoKTtcbiAgICBsZXQgaW5kZXggPSBjb21wb25lbnRzLl9pbmRleChlLnRhcmdldC5jbGFzc0xpc3RbMF0pO1xuICAgIGNvbnN0IHNxdWFyZXMgPSBjb21wb25lbnRzLl9maW5kU3F1YXJlcyhpbmRleCwgbGVuZ3RoLCBheGlzKTtcbiAgICBpZiAoc3F1YXJlcyA9PT0gZmFsc2UpIHtcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWxsb3dlZFwiKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJub3QtYWxsb3dlZFwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gICNzcXVhcmVDbGljayhlLCBjb21wb25lbnRzID0gdGhpcy5jb21wb25lbnRzKSB7XG4gICAgaWYgKFxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSB8fFxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibm90LWFsbG93ZWRcIilcbiAgICApXG4gICAgICByZXR1cm47XG4gICAgY29uc3Qgc2hpcHMgPSBjb21wb25lbnRzLmdhbWUucGxheWVyMS5zaGlwcztcbiAgICBjb25zdCBpbmRleCA9IGNvbXBvbmVudHMuX2luZGV4KGUudGFyZ2V0LmNsYXNzTGlzdFswXSk7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBzLnNoaWZ0KCk7XG4gICAgY29uc3QgYXhpcyA9IGNvbXBvbmVudHMuX3JldHJpZXZlQXhpcygpO1xuICAgIGNvbXBvbmVudHMuZ2FtZS5wbGF5ZXIxLmJvYXJkLnBsYWNlU2hpcChzaGlwLCBpbmRleC54LCBpbmRleC55LCBheGlzKTtcbiAgICB0aGlzLl9zaGlwUGxhY2VkKGluZGV4LCBheGlzLCBzaGlwLmxlbmd0aCk7XG4gICAgLy8gaWYgc2hpcHMgYXJlIGVtcHR5IC0gdHVybiBzaG91bGQgc3RhcnRcbiAgICBpZiAoc2hpcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgLy8gaW5pdGlhdGUgcmVuZGVyaW5nIG9mIGJvdGggcGxheWVyIGJvYXJkc1xuICAgICAgY29tcG9uZW50cy5nYW1lLnN0YXJ0KCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkcztcbiIsImltcG9ydCBIZWFkZXIgZnJvbSBcIi4vaGVhZGVyXCI7XG5pbXBvcnQgQm9hcmRzIGZyb20gXCIuL2JvYXJkc1wiO1xuaW1wb3J0IEZvb3RlciBmcm9tIFwiLi9mb290ZXJcIjtcbmltcG9ydCBGb3JtIGZyb20gXCIuL2Zvcm1cIjtcblxuY2xhc3MgQ29tcG9uZW50cyB7XG4gIGNvbnN0cnVjdG9yKGJvZHkpIHtcbiAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuX2JhY2tncm91bmQoYm9keSk7XG4gICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKHRoaXMuYmFja2dyb3VuZCwgdGhpcyk7XG4gICAgdGhpcy5ib2FyZHMgPSBuZXcgQm9hcmRzKHRoaXMuYmFja2dyb3VuZCwgdGhpcyk7XG4gICAgdGhpcy5mb3JtID0gbmV3IEZvcm0odGhpcy5iYWNrZ3JvdW5kLCB0aGlzKTtcbiAgICB0aGlzLmZvb3RlciA9IG5ldyBGb290ZXIodGhpcy5iYWNrZ3JvdW5kKTtcbiAgICB0aGlzLmdhbWU7XG4gICAgdGhpcy5heGlzO1xuICAgIHRoaXMucGxheTtcbiAgfVxuXG4gIF9iYWNrZ3JvdW5kKGJvZHkpIHtcbiAgICAvLyBDcmVhdGUgdGhlIGdhbWUgd3JhcHBlciBlbGVtZW50XG4gICAgY29uc3QgYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKFwid3JhcHBlclwiKTtcbiAgICBib2R5LmFwcGVuZChiYWNrZ3JvdW5kKTtcbiAgICByZXR1cm4gYmFja2dyb3VuZDtcbiAgfVxuXG4gIF9heGlzQnV0dG9uKGJvYXJkcyA9IHRoaXMuYm9hcmRzKSB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidG4udGV4dENvbnRlbnQgPSBcIkF4aXM6IFhcIjtcbiAgICBidG4uY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLiNheGlzQnRuKGUsIGJ0bikpO1xuICAgIGJvYXJkcy5jb250YWluZXIuYXBwZW5kKGJ0bik7XG4gICAgdGhpcy5heGlzID0gYnRuO1xuICAgIHJldHVybiBidG47XG4gIH1cblxuICBfZmluZFNxdWFyZXMoaW5kZXgsIGxlbmd0aCwgYXhpcykge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYXhpcyA9PSBcIlhcIikge1xuICAgICAgICBjb25zdCB4ID0gTnVtYmVyKGluZGV4LngpICsgaTtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLngke3h9eSR7aW5kZXgueX1gKTtcbiAgICAgICAgaWYgKHNxdWFyZSkge1xuICAgICAgICAgIHNxdWFyZXMucHVzaChzcXVhcmUpO1xuICAgICAgICB9IGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09IFwiWVwiKSB7XG4gICAgICAgIGNvbnN0IHkgPSBOdW1iZXIoaW5kZXgueSkgKyBpO1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAueCR7aW5kZXgueH15JHt5fWApO1xuICAgICAgICBpZiAoc3F1YXJlKSB7XG4gICAgICAgICAgc3F1YXJlcy5wdXNoKHNxdWFyZSk7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzcXVhcmVzO1xuICB9XG5cbiAgX3JldHJpZXZlQXhpcygpIHtcbiAgICBjb25zdCBidG4gPSB0aGlzLmF4aXM7XG4gICAgbGV0IGF4aXMgPSBidG4udGV4dENvbnRlbnRbNl07XG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBfcmV0cmlldmVMZW5ndGgoZ2FtZSA9IHRoaXMuZ2FtZSkge1xuICAgIGNvbnN0IHNoaXAgPSBnYW1lLnBsYXllcjEuc2hpcHNbMF07XG4gICAgcmV0dXJuIHNoaXAubGVuZ3RoO1xuICB9XG5cbiAgX2luZGV4KHN0cmluZykge1xuICAgIHN0cmluZyA9IHsgeDogc3RyaW5nWzFdLCB5OiBzdHJpbmdbM10gfTtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG5cbiAgdXBkYXRlU2hpcENvdW50KGdhbWUgPSB0aGlzLmdhbWUpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItc2hpcHNcIik7XG4gICAgY29uc3QgcGxheWVyMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItc2hpcHNcIik7XG4gICAgcGxheWVyMS50ZXh0Q29udGVudCA9IGBTaGlwcyBsZWZ0OiAke3RoaXMuY2hlY2tTaGlwcyhnYW1lLmJvYXJkMSl9YDtcbiAgICBwbGF5ZXIyLnRleHRDb250ZW50ID0gYFNoaXBzIGxlZnQ6ICR7dGhpcy5jaGVja1NoaXBzKGdhbWUuYm9hcmQyKX1gO1xuICB9XG5cbiAgY2hlY2tTaGlwcyhib2FyZCkge1xuICAgIGNvbnN0IHNoaXBzID0gYm9hcmQuc2hpcHM7XG4gICAgY29uc3QgYXJyID0gc2hpcHMuZmlsdGVyKChzaGlwKSA9PiB7XG4gICAgICByZXR1cm4gc2hpcC5zdW5rID09PSBmYWxzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gYXJyLmxlbmd0aDtcbiAgfVxuXG4gIHVwZGF0ZVNoaXBDb250ZW50KGdhbWUgPSB0aGlzLmdhbWUpIHtcbiAgICBjb25zdCBzaGlwcyA9IGdhbWUucGxheWVyMi5ib2FyZC5zaGlwcztcbiAgICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcC5zdW5rID09PSB0cnVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5pbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBpbmRleCA9IHNoaXAuaW5kZXhbaV07XG4gICAgICAgICAgaW5kZXggPSB7IHg6IGluZGV4WzBdLCB5OiBpbmRleFsxXSB9O1xuICAgICAgICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAueCR7aW5kZXgueH15JHtpbmRleC55fWApO1xuICAgICAgICAgIGlmICghc3F1YXJlc1sxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgc3F1YXJlc1sxXS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfYW5pbWF0ZShlbGVtZW50LCB0ZXh0KSB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBjb25zdCBkZWxheSA9IDEwMDtcbiAgICBjb25zdCBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKGluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCArPSB0ZXh0W2luZGV4XTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgICB9XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLy8gTGlzdGVuZXJzXG5cbiAgI2F4aXNCdG4oZSwgYnRuKSB7XG4gICAgY29uc3QgdGV4dCA9IGJ0bi50ZXh0Q29udGVudDtcbiAgICBpZiAodGV4dCA9PSBcIkF4aXM6IFhcIikge1xuICAgICAgYnRuLnRleHRDb250ZW50ID0gXCJBeGlzOiBZXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwiQXhpczogWFwiO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRzO1xuIiwiY2xhc3MgRm9vdGVyIHtcbiAgY29uc3RydWN0b3IoYmFja2dyb3VuZCwgY29tcG9uZW50cykge1xuICAgIHRoaXMuZm9vdGVyID0gdGhpcy5fZm9vdGVyKGJhY2tncm91bmQpO1xuICB9XG4gIF9mb290ZXIoYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZCkge1xuICAgIC8vIENyZWF0ZSBmb290ZXIgZWxlbWVudFxuICAgIGNvbnN0IGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29uc3QgcGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgY29uc3QgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoXCJmb290ZXJcIik7XG4gICAgcGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJDcmVhdGVkIGJ5IFwiO1xuICAgIHBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKFwiZm9vdGVyLXRleHRcIik7XG4gICAgYW5jaG9yLnRleHRDb250ZW50ID0gXCJDSnNraVwiO1xuICAgIGFuY2hvci50YXJnZXQgPSBcIl9ibGFua1wiO1xuICAgIGFuY2hvci5ocmVmID0gXCJodHRwczovL2dpdGh1Yi5jb20vQ0pza2lpL0JhdHRsZXNoaXAtZ2FtZVwiO1xuICAgIHBhcmFncmFwaC5hcHBlbmQoYW5jaG9yKTtcbiAgICBmb290ZXIuYXBwZW5kKHBhcmFncmFwaCk7XG4gICAgYmFja2dyb3VuZC5hcHBlbmQoZm9vdGVyKTtcbiAgICByZXR1cm4gZm9vdGVyO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvb3RlcjtcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuLi9pbmRleFwiO1xuXG5jbGFzcyBGb3JtIHtcbiAgY29uc3RydWN0b3IoYmFja2dyb3VuZCwgY29tcG9uZW50cykge1xuICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgdGhpcy5mb3JtID0gdGhpcy5fbmFtZUZvcm0oYmFja2dyb3VuZCk7XG4gIH1cblxuICBfbmFtZUZvcm0oYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZCkge1xuICAgIC8vIENyZWF0ZSBmb3JtICsgbGFiZWwgKyBpbnB1dCArIHN1Ym1pdCBlbGVtZW50c1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBjb25zdCBzdWJtaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGNvbnN0IHRleHQgPSBcIkVudGVyIHBsYXllciBuYW1lOlwiO1xuICAgIGlucHV0LmlkID0gXCJuYW1lXCI7XG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcIkNhcHRhaW4gbmFtZS4uLlwiO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB0aGlzLiNpbnB1dFZhbGlkYXRpb24oZSwgaW5wdXQpKTtcbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgaW5wdXQpO1xuICAgIHRoaXMuY29tcG9uZW50cy5fYW5pbWF0ZShsYWJlbCwgdGV4dCk7XG4gICAgc3VibWl0LnRleHRDb250ZW50ID0gXCJTdWJtaXRcIjtcbiAgICBzdWJtaXQuY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLiNzdWJtaXRCdG4oZSwgaW5wdXQpKTtcbiAgICBmb3JtLmFwcGVuZChsYWJlbCk7XG4gICAgZm9ybS5hcHBlbmQoaW5wdXQpO1xuICAgIGZvcm0uYXBwZW5kKHN1Ym1pdCk7XG4gICAgYmFja2dyb3VuZC5hcHBlbmQoZm9ybSk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgcmV0dXJuIGZvcm07XG4gIH1cblxuICAjaW5wdXRWYWxpZGF0aW9uKGUsIGlucHV0KSB7XG4gICAgY29uc3Qga2V5ID0gZS5rZXlDb2RlO1xuICAgIGlmIChrZXkgPT09IDEzKSB7XG4gICAgICB0aGlzLiNzdWJtaXRCdG4oZSwgaW5wdXQpO1xuICAgIH1cbiAgICAvLyBvbmx5IGxldHRlcnMsIGJhY2tzcGFjZSwgYW5kIGRlbGV0ZVxuICAgIGlmIChcbiAgICAgIGtleSA9PT0gOCB8fFxuICAgICAga2V5ID09PSA0NiB8fFxuICAgICAgKGtleSA+PSA2NSAmJiBrZXkgPD0gOTApIHx8XG4gICAgICAoa2V5ID49IDk3ICYmIGtleSA8PSAxMjIpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gICNzdWJtaXRCdG4oZSwgaW5wdXQsIGZvcm0gPSB0aGlzLmZvcm0sIGNvbXBvbmVudHMgPSB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICBpZiAoaW5wdXQudmFsdWUgPT0gXCJcIikge1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcIllvdSBtdXN0IGVudGVyIG5hbWVcIjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKGlucHV0LnZhbHVlLmxlbmd0aCA+PSAxMikge1xuICAgICAgaW5wdXQudmFsdWUgPSBcIlwiO1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcIlRvbyBsb25nIC0gMTIgY2hhcmFjdGVycyBhbGxvd2VkXCI7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNhbGwgdG8gaW5kZXguanNcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBuYW1lID0gaW5wdXQudmFsdWU7XG4gICAgICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICAgICAgY29tcG9uZW50cy5nYW1lID0gbmV3IEdhbWUobmFtZSwgdGhpcy5jb21wb25lbnRzKTtcbiAgICAgIGZvcm0ucmVtb3ZlKCk7XG4gICAgICBjb21wb25lbnRzLmJvYXJkcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dC52YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtO1xuIiwiY2xhc3MgVHVybiB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIGJhY2tncm91bmQpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuYm9hcmRzID0gYmFja2dyb3VuZDtcbiAgICB0aGlzLmhlYWRlciA9IHRoaXMuX3JlbmRlckhlYWRlcigpO1xuICAgIHRoaXMuYm9hcmQxID0gdGhpcy5fcmVuZGVyQm9hcmQoZ2FtZS5wbGF5ZXIxKTtcbiAgICB0aGlzLmJvYXJkMiA9IHRoaXMuX3JlbmRlckJvYXJkKGdhbWUucGxheWVyMik7XG4gICAgdGhpcy5zdG9wID0gZmFsc2U7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KGdhbWUgPSB0aGlzLmdhbWUsIGJvYXJkMSA9IHRoaXMuYm9hcmQxLCBib2FyZDIgPSB0aGlzLmJvYXJkMikge1xuICAgIGNvbnN0IHBsYXllcjEgPSBnYW1lLmJvYXJkMS5zaGlwcztcbiAgICBjb25zdCBwbGF5ZXIyID0gZ2FtZS5ib2FyZDIuc2hpcHM7XG4gICAgdGhpcy5fcmVuZGVyU2hpcHMoYm9hcmQxLCBwbGF5ZXIxKTtcbiAgICAvL3RoaXMuX3JlbmRlclNoaXBzKGJvYXJkMiwgcGxheWVyMik7XG4gIH1cblxuICBfcmVuZGVySGVhZGVyKGJhY2tncm91bmQgPSB0aGlzLmJvYXJkcy5jb250YWluZXIpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyLXdyYXBwZXJcIik7XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg1XCIpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyLXR1cm5cIik7XG4gICAgY29uc3QgdGV4dCA9IFwiTWFrZSBhIG1vdmUgY2FwdGFpbi4uLlwiO1xuICAgIHRoaXMuZ2FtZS5jb21wb25lbnRzLl9hbmltYXRlKGhlYWRlciwgdGV4dCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYWRlcik7XG4gICAgYmFja2dyb3VuZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuICBfcmVuZGVyQm9hcmQocGxheWVyLCBiYWNrZ3JvdW5kID0gdGhpcy5ib2FyZHMuY29udGFpbmVyKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYXllci1jb250YWluZXJcIik7XG4gICAgdGhpcy5fYWRkUGxheWVyTmFtZShwbGF5ZXIsIGNvbnRhaW5lcik7XG4gICAgdGhpcy5fYWRkU2hpcENvdW50KHBsYXllciwgY29udGFpbmVyKTtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGxheWVyQm9hcmQuY2xhc3NMaXN0LmFkZChcInBsYXllci1ib2FyZFwiKTtcbiAgICBwbGF5ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKGAke3BsYXllci5uYW1lfWApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyLmJvYXJkLnNpemU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwbGF5ZXIuYm9hcmQuc2l6ZTsgaisrKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGB4JHtqfXkke2l9YCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKFwic3F1YXJlXCIpO1xuICAgICAgICBpZiAocGxheWVyLm5hbWUgPT0gXCJDb21wdXRlclwiKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdGhpcy4jc3F1YXJlQ2xpY2soZSkpO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllckJvYXJkLmFwcGVuZChzcXVhcmUpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kKHBsYXllckJvYXJkKTtcbiAgICBiYWNrZ3JvdW5kLmFwcGVuZChjb250YWluZXIpO1xuICAgIHJldHVybiBwbGF5ZXJCb2FyZDtcbiAgfVxuXG4gIF9hZGRQbGF5ZXJOYW1lKHBsYXllciwgY29udGFpbmVyKSB7XG4gICAgY29uc3QgcGxheWVyTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNVwiKTtcbiAgICBwbGF5ZXJOYW1lLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXItbmFtZVwiKTtcbiAgICBwbGF5ZXJOYW1lLnRleHRDb250ZW50ID0gYCR7cGxheWVyLm5hbWV9J3MgYm9hcmRgO1xuICAgIGNvbnRhaW5lci5hcHBlbmQocGxheWVyTmFtZSk7XG4gICAgcmV0dXJuIHBsYXllck5hbWU7XG4gIH1cblxuICBfYWRkU2hpcENvdW50KHBsYXllciwgY29udGFpbmVyKSB7XG4gICAgY29uc3Qgc2hpcFN0YXR1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHNoaXBTdGF0dXMudGV4dENvbnRlbnQgPSBcIlNoaXBzIGxlZnQ6IDVcIjtcbiAgICBzaGlwU3RhdHVzLmNsYXNzTGlzdCA9IFwic2hpcC1zdGF0dXNcIjtcbiAgICBpZiAocGxheWVyLm5hbWUgPT0gXCJDb21wdXRlclwiKSB7XG4gICAgICBzaGlwU3RhdHVzLmNsYXNzTGlzdCA9IFwiY29tcHV0ZXItc2hpcHNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hpcFN0YXR1cy5jbGFzc0xpc3QgPSBcInBsYXllci1zaGlwc1wiO1xuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kKHNoaXBTdGF0dXMpO1xuICAgIHJldHVybiBzaGlwU3RhdHVzO1xuICB9XG5cbiAgX3JlbmRlclNoaXBzKGJvYXJkLCBzaGlwcykge1xuICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IGF4aXMgPSBzaGlwLmF4aXM7XG4gICAgICBjb25zdCBsZW5ndGggPSBzaGlwLmxlbmd0aDtcbiAgICAgIGxldCBpbmRleCA9IHNoaXAuaW5kZXhbMF07XG4gICAgICBpbmRleCA9IHsgeDogaW5kZXhbMF0sIHk6IGluZGV4WzFdIH07XG4gICAgICBjb25zdCBzcXVhcmVzID0gdGhpcy5fZmluZFNxdWFyZXMoaW5kZXgsIGxlbmd0aCwgYXhpcywgYm9hcmQpO1xuICAgICAgc3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfZmluZFNxdWFyZXMoaW5kZXgsIGxlbmd0aCwgYXhpcywgYm9hcmQpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGF4aXMgPT0gXCJYXCIpIHtcbiAgICAgICAgY29uc3QgeCA9IE51bWJlcihpbmRleC54KSArIGk7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYC54JHt4fXkke2luZGV4Lnl9YCk7XG4gICAgICAgIGlmIChzcXVhcmUpIHtcbiAgICAgICAgICBzcXVhcmVzLnB1c2goc3F1YXJlKTtcbiAgICAgICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoYXhpcyA9PSBcIllcIikge1xuICAgICAgICBjb25zdCB5ID0gTnVtYmVyKGluZGV4LnkpICsgaTtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gYm9hcmQucXVlcnlTZWxlY3RvcihgLngke2luZGV4Lnh9eSR7eX1gKTtcbiAgICAgICAgaWYgKHNxdWFyZSkge1xuICAgICAgICAgIHNxdWFyZXMucHVzaChzcXVhcmUpO1xuICAgICAgICB9IGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3F1YXJlcztcbiAgfVxuXG4gIF9oaXRPUm1pc3MoaW5kZXgsIHRhcmdldCwgYm9hcmQpIHtcbiAgICBpZiAodGFyZ2V0ID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIGVsc2UgaWYgKHRhcmdldCA9PSBcIm1pc3NcIikge1xuICAgICAgYm9hcmQgPSB0aGlzLl9maW5kU3F1YXJlKGluZGV4LCBib2FyZCk7XG4gICAgICB0aGlzLl9taXNzQ29sb3IoYm9hcmQpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09IFwiaGl0XCIpIHtcbiAgICAgIGJvYXJkID0gdGhpcy5fZmluZFNxdWFyZShpbmRleCwgYm9hcmQpO1xuICAgICAgdGhpcy5faGl0Q29sb3IoYm9hcmQpO1xuICAgIH1cbiAgICBib2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwidGFyZ2V0XCIpO1xuICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJub3QtYWxsb3dlZFwiKTtcbiAgfVxuXG4gIF9maW5kU3F1YXJlKGluZGV4LCBib2FyZCkge1xuICAgIGlmIChib2FyZCA9PSBcIlBsYXllclwiKSB7XG4gICAgICBib2FyZCA9IHRoaXMuYm9hcmQxO1xuICAgIH0gZWxzZSBpZiAoYm9hcmQgPT0gXCJDb21wdXRlclwiKSB7XG4gICAgICBib2FyZCA9IHRoaXMuYm9hcmQyO1xuICAgIH1cbiAgICBjb25zdCBzcXVhcmUgPSBib2FyZC5xdWVyeVNlbGVjdG9yKGAueCR7aW5kZXgueH15JHtpbmRleC55fWApO1xuICAgIHJldHVybiBzcXVhcmU7XG4gIH1cblxuICBfbWlzc0NvbG9yKHNxdWFyZSkge1xuICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgfVxuXG4gIF9oaXRDb2xvcihzcXVhcmUpIHtcbiAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgfVxuXG4gIHN0b3BHYW1lKCkge1xuICAgIHRoaXMuc3RvcCA9IHRydWU7XG4gIH1cblxuICAjc3F1YXJlQ2xpY2soZSwgZ2FtZSA9IHRoaXMuZ2FtZSwgc3RvcCA9IHRoaXMuc3RvcCkge1xuICAgIGlmIChzdG9wID09PSB0cnVlKSByZXR1cm47XG4gICAgY29uc3QgYm9hcmQgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0IHN0cmluZyA9IGUudGFyZ2V0LmNsYXNzTGlzdFswXTtcbiAgICBjb25zdCBpbmRleCA9IGdhbWUuY29tcG9uZW50cy5faW5kZXgoc3RyaW5nKTtcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibm90LWFsbG93ZWRcIikpIHJldHVybjtcbiAgICBlbHNlIGlmIChib2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJDb21wdXRlclwiKSkge1xuICAgICAgZ2FtZS50dXJuKFwiQ29tcHV0ZXJcIiwgaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUdXJuO1xuIiwiY2xhc3MgSGVhZGVyIHtcbiAgY29uc3RydWN0b3IoYmFja2dyb3VuZCwgY29tcG9uZW50cykge1xuICAgIHRoaXMuaGVhZGVyID0gdGhpcy5faGVhZGVyKGJhY2tncm91bmQpO1xuICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gIH1cbiAgX2hlYWRlcihiYWNrZ3JvdW5kKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSB0aXRsZSBlbGVtZW50XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IFwiQmF0dGxlc2hpcFwiO1xuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKFwiZ2FtZS10aXRsZVwiKTtcbiAgICBiYWNrZ3JvdW5kLmFwcGVuZChoZWFkZXIpO1xuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuICBfcmVuZGVyKHBsYXllciwgY29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cykge1xuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNlwiKTtcbiAgICBjb25zdCB0ZXh0ID0gYENhcHRhaW4gJHtwbGF5ZXIubmFtZX0sPGJyPiBwbGVhc2UgcGxhY2UgeW91ciBzaGlwc2A7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJjYXB0YWluLWhlYWRlclwiKTtcbiAgICAvL3RoaXMuX2FuaW1hdGUoaGVhZGVyLCB0ZXh0KTtcbiAgICBoZWFkZXIuaW5uZXJIVE1MID0gYENhcHRhaW4gJHtwbGF5ZXIubmFtZX0sPGJyPiBwbGVhc2UgcGxhY2UgeW91ciBzaGlwc2A7XG4gICAgY29tcG9uZW50cy5ib2FyZHMuY29udGFpbmVyLmFwcGVuZChoZWFkZXIpO1xuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuICBfYW5pbWF0ZShoZWFkZXIsIHRleHQpIHtcbiAgICAvL2NvbnN0IHRleHQgPSBcIk1ha2UgYSBtb3ZlIGNhcHRhaW4uLi5cIjtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGNvbnN0IGRlbGF5ID0gMTAwO1xuICAgIGNvbnN0IGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoaW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICBoZWFkZXIuaW5uZXJIVE1MICs9IHRleHRbaW5kZXhdO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcbiAgICAgIH1cbiAgICB9LCBkZWxheSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyO1xuIiwiaW1wb3J0IFwiLi9zdHlsZXMvc3R5bGUuY3NzXCI7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwiLi9ET00vY29tcG9uZW50cy5qc1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9vYmplY3RzL3BsYXllclwiO1xuaW1wb3J0IFJhbmRvbSBmcm9tIFwiLi9vYmplY3RzL3JhbmRvbVwiO1xuaW1wb3J0IFR1cm4gZnJvbSBcIi4vRE9NL2dhbWVcIjtcblxuKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IGdhbWUgPSBuZXcgQ29tcG9uZW50cyhib2R5KTtcbn0pKCk7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihwbGF5ZXIxLCBjb21wb25lbnRzKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gbmV3IFBsYXllcihwbGF5ZXIxKTtcbiAgICB0aGlzLnBsYXllcjIgPSBuZXcgUGxheWVyKFwiQ29tcHV0ZXJcIik7XG4gICAgdGhpcy5ib2FyZDEgPSB0aGlzLnBsYXllcjEuYm9hcmQ7XG4gICAgdGhpcy5ib2FyZDIgPSB0aGlzLnBsYXllcjIuYm9hcmQ7XG4gICAgdGhpcy5jb21wdXRlciA9IG5ldyBSYW5kb20odGhpcy5wbGF5ZXIyKTtcbiAgICB0aGlzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuICAgIHRoaXMubG9hZGVkID0gdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgX2luaXQoY29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cykge1xuICAgIGNvbXBvbmVudHMuaGVhZGVyLl9yZW5kZXIodGhpcy5wbGF5ZXIxKTtcbiAgICBjb21wb25lbnRzLl9heGlzQnV0dG9uKCk7XG4gICAgY29tcG9uZW50cy5ib2FyZHMuX3JlbmRlcih0aGlzLnBsYXllcjEpO1xuICB9XG5cbiAgc3RhcnQoYmFja2dyb3VuZCA9IHRoaXMuY29tcG9uZW50cy5ib2FyZHMpIHtcbiAgICB0aGlzLmNvbXBvbmVudHMucGxheSA9IG5ldyBUdXJuKHRoaXMsIGJhY2tncm91bmQpO1xuICB9XG5cbiAgdHVybihib2FyZCwgaW5kZXgsIGdhbWUgPSB0aGlzLmNvbXBvbmVudHMucGxheSwgY29tcHV0ZXIgPSB0aGlzLmNvbXB1dGVyKSB7XG4gICAgaWYgKGJvYXJkID09PSBcIlBsYXllclwiKSB7XG4gICAgICAvLyBsb2dpYyBmb3IgY29tcHV0ZXJcbiAgICAgIHRoaXMuY29tcHV0ZXJUdXJuKGJvYXJkLCBpbmRleCwgZ2FtZSwgY29tcHV0ZXIpO1xuICAgICAgY29uc3QgYWxsU2hpcHNTdW5rID0gdGhpcy5ib2FyZDEuX2FyZVNoaXBzU3VuaygpO1xuICAgICAgaWYgKGFsbFNoaXBzU3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBwcmludCB3aW5uZXIgYW5kIHN0b3AgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5wcmludFdpbm5lcihib2FyZCk7XG4gICAgICAgIGdhbWUuc3RvcEdhbWUoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGJvYXJkID09PSBcIkNvbXB1dGVyXCIpIHtcbiAgICAgIC8vIGxvZ2ljIGZvciBwbGF5ZXJcbiAgICAgIGNvbnN0IGhpdCA9IHRoaXMucGxheWVyMi5tb3ZlKGluZGV4LngsIGluZGV4LnkpO1xuICAgICAgZ2FtZS5faGl0T1JtaXNzKGluZGV4LCBoaXQsIGJvYXJkKTtcbiAgICAgIGNvbnN0IGFsbFNoaXBzU3VuayA9IHRoaXMuYm9hcmQyLl9hcmVTaGlwc1N1bmsoKTtcbiAgICAgIHRoaXMuY29tcG9uZW50cy51cGRhdGVTaGlwQ29udGVudCgpO1xuICAgICAgaWYgKGFsbFNoaXBzU3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBwcmludCB3aW5uZXIgYW5kIHN0b3AgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5wcmludFdpbm5lcihib2FyZCk7XG4gICAgICAgIGdhbWUuc3RvcEdhbWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGFsbCBzaGlwcyBhcmUgbm90IHN1bmsgLSBjb21wdXRlciB3aWxsIG1ha2UgcmFuZG9tIG1vdmVcbiAgICAgICAgdGhpcy50dXJuKFwiUGxheWVyXCIsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnRzLnVwZGF0ZVNoaXBDb3VudCgpO1xuICB9XG5cbiAgY29tcHV0ZXJUdXJuKGJvYXJkLCBpbmRleCwgZ2FtZSwgY29tcHV0ZXIpIHtcbiAgICAvLyBnZXQgcmFuZG9tIGluZGV4IGFuZCBjaGVjayBpZiBpdCBpcyB2YWxpZFxuICAgIGxldCBsYXN0SGl0ID0gY29tcHV0ZXIubGFzdEhpdDtcbiAgICBpbmRleCA9IGNvbXB1dGVyLnJhbmRvbUNvb3JkcygpO1xuICAgIGxldCB2YWxpZE1vdmUgPSBjb21wdXRlci5pc1ZhbGlkTW92ZShpbmRleCwgdGhpcy5ib2FyZDEpO1xuICAgIC8vIGlmIGxhc3QgaGl0IHdhc24ndCBtaXNzIC0gYXR0ZW1wdCB0byBoaXQgYWRqYWNlbnQgc3F1YXJlc1xuICAgIGlmIChsYXN0SGl0ICE9IDApIHtcbiAgICAgIC8vIEhpdCBhZGphY2VudCBzcXVhcmVcbiAgICAgIGNvbnN0IG5leHRNb3ZlID0gY29tcHV0ZXIuYWRqYWNlbnRNb3ZlcyhsYXN0SGl0LCB0aGlzLmJvYXJkMSk7XG4gICAgICBpZiAobmV4dE1vdmUgIT0gZmFsc2UpIHtcbiAgICAgICAgLy8gaWYgbmV4dCBhZGphY2VudCBtb3ZlIGlzIHZhbGlkXG4gICAgICAgIHRoaXMuY29tcHV0ZXJIaXQobmV4dE1vdmUsIGJvYXJkLCBnYW1lLCBjb21wdXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiB0aGVyZSdzIG5vIHZhbGlkIGFkamFjZW50IG1vdmVzIGNhbGwgaXRzZWxmXG4gICAgICAgIHRoaXMuY29tcHV0ZXJUdXJuKGJvYXJkLCBpbmRleCwgZ2FtZSwgY29tcHV0ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsaWRNb3ZlID09PSB0cnVlKSB7XG4gICAgICAvLyBIaXQgcmFuZG9tIGNvb3Jkc1xuICAgICAgdGhpcy5jb21wdXRlckhpdChpbmRleCwgYm9hcmQsIGdhbWUsIGNvbXB1dGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgaW5kZXggaXMgaW52YWxpZCBjYWxsIGl0c2VsZiB0byBnZW5lcmF0ZSBuZXcgcmFuZG9tIGNvb3Jkc1xuICAgICAgdGhpcy5jb21wdXRlclR1cm4oYm9hcmQsIGluZGV4LCBnYW1lLCBjb21wdXRlcik7XG4gICAgfVxuICB9XG5cbiAgY29tcHV0ZXJIaXQoaW5kZXgsIGJvYXJkLCBnYW1lLCBjb21wdXRlcikge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGhpdCA9IHRoaXMucGxheWVyMS5tb3ZlKGluZGV4LngsIGluZGV4LnkpO1xuICAgICAgZ2FtZS5faGl0T1JtaXNzKGluZGV4LCBoaXQsIGJvYXJkKTtcbiAgICAgIGlmIChoaXQgPT0gXCJoaXRcIikge1xuICAgICAgICBjb21wdXRlci5sYXN0SGl0ID0gaW5kZXg7XG4gICAgICAgIGNvbXB1dGVyLm1pc3NlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcHV0ZXIubWlzc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9XG5cbiAgcHJpbnRXaW5uZXIoc3RyaW5nLCBnYW1lID0gdGhpcy5jb21wb25lbnRzLnBsYXkpIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5ldmFsdWF0ZVdpbm5lcihzdHJpbmcpO1xuICAgIGdhbWUuaGVhZGVyLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB0aGlzLmNvbXBvbmVudHMuX2FuaW1hdGUoZ2FtZS5oZWFkZXIsIHRleHQpO1xuICB9XG5cbiAgZXZhbHVhdGVXaW5uZXIoc3RyaW5nKSB7XG4gICAgaWYgKHN0cmluZyA9PSBcIlBsYXllclwiKSB7XG4gICAgICByZXR1cm4gXCJZb3UgaGF2ZSBsb3N0LCB0cnkgYWdhaW4hXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnBsYXllcjEubmFtZX0gaGFzIHdvbiFgO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zaXplID0gMTA7XG4gICAgdGhpcy5ib2FyZCA9IHRoaXMuX2NyZWF0ZUJvYXJkKHRoaXMuc2l6ZSk7XG4gICAgdGhpcy5taXNzZWQgPSBbXTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gIH1cblxuICBfY3JlYXRlQm9hcmQoc2l6ZSkge1xuICAgIGNvbnN0IGdyaWQgPSBBcnJheShzaXplKVxuICAgICAgLmZpbGwoKVxuICAgICAgLm1hcCgoKSA9PiBBcnJheShzaXplKS5maWxsKDApKTtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gIF9hcmVTaGlwc1N1bmsoc2hpcHMgPSB0aGlzLnNoaXBzKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSBmYWxzZSkge1xuICAgICAgICBhcnIucHVzaChmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF9pc01pc3NlZEF0dGFjayh4LCB5KSB7XG4gICAgaWYgKHRoaXMuYm9hcmRbeF1beV0gPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGxhY2VTaGlwKHNoaXAsIHgsIHksIGF4aXMpIHtcbiAgICAvLyBjaGVjayBmb3IgYXhpcyBmcm9tIERPTVxuICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcbiAgICB4ID0gTnVtYmVyKHgpO1xuICAgIHkgPSBOdW1iZXIoeSk7XG4gICAgaWYgKGF4aXMgPT0gXCJYXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzaGlwLmluZGV4LnB1c2goW3ggKyBpLCB5XSk7XG4gICAgICAgIHRoaXMuYm9hcmRbeCArIGldW3ldID0gc2hpcDtcbiAgICAgICAgc2hpcC5heGlzID0gYXhpcztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGF4aXMgPT0gXCJZXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzaGlwLmluZGV4LnB1c2goW3gsIHkgKyBpXSk7XG4gICAgICAgIHRoaXMuYm9hcmRbeF1beSArIGldID0gc2hpcDtcbiAgICAgICAgc2hpcC5heGlzID0gYXhpcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5ib2FyZFt4XVt5XTtcbiAgICBjb25zdCBtaXNzZWRBdHRhY2sgPSB0aGlzLl9pc01pc3NlZEF0dGFjayh4LCB5KTtcbiAgICBpZiAoc2hpcCAhPSAwICYmIG1pc3NlZEF0dGFjayA9PT0gZmFsc2UpIHtcbiAgICAgIHNoaXAuaGl0KFt4LCB5XSk7XG4gICAgICByZXR1cm4gXCJoaXRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2hlY2sgZm9yIGR1cGxpY2F0ZXNcbiAgICAgIGNvbnN0IGFyckxvb2t1cCA9IHRoaXMubWlzc2VkLmZpbHRlcigoY29vcmRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjb29yZHNbMF0gPT0geCAmJiBjb29yZHNbMV0gPT0geTtcbiAgICAgIH0pO1xuICAgICAgLy8gaWYgZHVwbGljYXRlIGZvdW5kIGRvIG5vdGhpbmdcbiAgICAgIGlmIChhcnJMb29rdXAubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBpZiBubyBkdXBsaWNhdGVzIHB1c2ggdG8gbWlzc2VkIGFycmF5XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5taXNzZWQucHVzaChbeCwgeV0pOyAvLyBwdXNoIG1pc3NlZCBjb3JkcyB0byBtaXNzIGFycmF5XG4gICAgICAgIHJldHVybiBcIm1pc3NcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXG4gICAgICBuZXcgU2hpcCg1KSxcbiAgICAgIG5ldyBTaGlwKDQpLFxuICAgICAgbmV3IFNoaXAoMyksXG4gICAgICBuZXcgU2hpcCgzKSxcbiAgICAgIG5ldyBTaGlwKDIpLFxuICAgIF07XG4gIH1cblxuICBtb3ZlKHgsIHkpIHtcbiAgICByZXR1cm4gdGhpcy5ib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICB9XG5cbiAgaW5pdChzdHJpbmcpIHtcbiAgICBpZiAoIXN0cmluZykge1xuICAgICAgY29uc29sZS5sb2coXCJyZW5kZXIgcGxheWVyIDFcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyIHBsYXllciAyXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBSYW5kb20ge1xuICBjb25zdHJ1Y3RvcihwbGF5ZXIpIHtcbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmxhc3RIaXQgPSAwO1xuICAgIHRoaXMubWlzc2VkO1xuICB9XG5cbiAgaW5pdChwbGF5ZXIgPSB0aGlzLnBsYXllcikge1xuICAgIGNvbnN0IHNoaXAgPSBwbGF5ZXIuc2hpcHMuc2hpZnQoKTtcbiAgICBjb25zdCBheGlzID0gdGhpcy5yYW5kb21BeGlzKCk7XG4gICAgaWYgKCFzaGlwKSByZXR1cm47XG4gICAgdGhpcy5wbGFjZVNoaXBSYW5kb20oc2hpcCwgYXhpcyk7XG4gIH1cblxuICBwbGFjZVNoaXBSYW5kb20oc2hpcCwgYXhpcykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yYW5kb21Db29yZHMoKTtcbiAgICBjb25zdCBpc1ZhbGlkTW92ZSA9IHRoaXMuX2lzVmFsaWRNb3ZlKHNoaXAsIGF4aXMsIGluZGV4KTtcbiAgICBpZiAoaXNWYWxpZE1vdmUgPT09IGZhbHNlKSB7XG4gICAgICAvLyBnZW5lcmF0ZSBuZXcgY29vcmRzXG4gICAgICB0aGlzLnBsYWNlU2hpcFJhbmRvbShzaGlwLCBheGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2Ugc2hpcHMgaGVyZVxuICAgICAgdGhpcy5wbGF5ZXIuYm9hcmQucGxhY2VTaGlwKHNoaXAsIGluZGV4LngsIGluZGV4LnksIGF4aXMpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICB9XG5cbiAgX2lzVmFsaWRNb3ZlKHNoaXAsIGF4aXMsIGluZGV4LCBwbGF5ZXIgPSB0aGlzLnBsYXllcikge1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXAubGVuZ3RoO1xuICAgIGNvbnN0IGJvYXJkID0gcGxheWVyLmJvYXJkLmJvYXJkO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBjb25zdCB4ID0gTnVtYmVyKGluZGV4LngpO1xuICAgIGNvbnN0IHkgPSBOdW1iZXIoaW5kZXgueSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGF4aXMgPT0gXCJYXCIpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gdGhpcy5fc3F1YXJlKFt4ICsgaV0sIFt5XSwgYm9hcmQpO1xuICAgICAgICBpZiAoc3F1YXJlICE9IDAgfHwgc3F1YXJlID09PSBmYWxzZSkge1xuICAgICAgICAgIGFyci5wdXNoKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChheGlzID09IFwiWVwiKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IHRoaXMuX3NxdWFyZShbeF0sIFt5ICsgaV0sIGJvYXJkKTtcbiAgICAgICAgaWYgKHNxdWFyZSAhPSAwIHx8IHNxdWFyZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBhcnIucHVzaChmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFyci5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBfc3F1YXJlKHgsIHksIGJvYXJkKSB7XG4gICAgaWYgKHggPj0gMCAmJiB4IDwgMTAgJiYgeSA8IDEwICYmIHkgPj0gMCkge1xuICAgICAgbGV0IHNxdWFyZSA9IGJvYXJkW3hdW3ldO1xuICAgICAgcmV0dXJuIHNxdWFyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJhbmRvbUNvb3JkcygpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgcmV0dXJuIHsgeCwgeSB9O1xuICB9XG5cbiAgcmFuZG9tQXhpcygpIHtcbiAgICBjb25zdCBheGlzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGlmIChheGlzID4gNSkge1xuICAgICAgcmV0dXJuIFwiWFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJZXCI7XG4gICAgfVxuICB9XG5cbiAgYWRqYWNlbnRNb3ZlcyhsYXN0SGl0LCBib2FyZCkge1xuICAgIGxldCBtb3ZlcyA9IFtcbiAgICAgIFsxLCAwXSxcbiAgICAgIFswLCAxXSxcbiAgICAgIFstMSwgMF0sXG4gICAgICBbMCwgLTFdLFxuICAgIF07XG4gICAgY29uc3QgeCA9IE51bWJlcihsYXN0SGl0LngpO1xuICAgIGNvbnN0IHkgPSBOdW1iZXIobGFzdEhpdC55KTtcbiAgICBsZXQgdmFsaWRNb3ZlO1xuICAgIGxldCBuZXh0TW92ZTtcbiAgICBjb25zdCBvYmplY3QgPSBib2FyZC5ib2FyZFt4XVt5XTtcbiAgICBjb25zdCBoaXRzID0gdGhpcy5jb21wYXJlSGl0cyhvYmplY3QpO1xuICAgIGlmIChvYmplY3Quc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5sYXN0SGl0ID0gMDtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGhpdHMpIHtcbiAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgbmV4dCBtb3ZlIGhlcmVcbiAgICAgIG5leHRNb3ZlID0gdGhpcy5lc3RpbWF0ZU5leHRNb3ZlKGhpdHMsIGJvYXJkKTtcbiAgICAgIGlmIChuZXh0TW92ZSkgcmV0dXJuIG5leHRNb3ZlO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChoaXRzLmZpcnN0SGl0LnggPCBoaXRzLmxhc3RIaXQueCkge1xuICAgICAgICAgIG5leHRNb3ZlID0geyB4OiBoaXRzLmZpcnN0SGl0LnggLSAxLCB5OiBoaXRzLmZpcnN0SGl0LnkgfTtcbiAgICAgICAgfSBlbHNlIGlmIChoaXRzLmZpcnN0SGl0LnggPiBoaXRzLmxhc3RIaXQueCkge1xuICAgICAgICAgIG5leHRNb3ZlID0geyB4OiBoaXRzLmZpcnN0SGl0LnggKyAxLCB5OiBoaXRzLmZpcnN0SGl0LnkgfTtcbiAgICAgICAgfSBlbHNlIGlmIChoaXRzLmZpcnN0SGl0LnkgPCBoaXRzLmxhc3RIaXQueSkge1xuICAgICAgICAgIG5leHRNb3ZlID0geyB4OiBoaXRzLmZpcnN0SGl0LngsIHk6IGhpdHMuZmlyc3RIaXQueSAtIDEgfTtcbiAgICAgICAgfSBlbHNlIGlmIChoaXRzLmZpcnN0SGl0LnggPiBoaXRzLmxhc3RIaXQueCkge1xuICAgICAgICAgIG5leHRNb3ZlID0geyB4OiBoaXRzLmZpcnN0SGl0LngsIHk6IGhpdHMuZmlyc3RIaXQueSArIDEgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpKSByZXR1cm4gbmV4dE1vdmU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIGVzdGltYXRlTmV4dE1vdmUgaXMgbnVsbFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGNhbGN1bGF0ZSBuZXh0IG1vdmUgY29vcmRzXG4gICAgICBsZXQgbmV4dFggPSB4ICsgTnVtYmVyKG1vdmVzW2ldWzBdKTtcbiAgICAgIGxldCBuZXh0WSA9IHkgKyBOdW1iZXIobW92ZXNbaV1bMV0pO1xuICAgICAgbmV4dE1vdmUgPSB7IHg6IG5leHRYLCB5OiBuZXh0WSB9O1xuICAgICAgLy8gY2hlY2sgaWYgbmV4dCBtb3ZlIHdpbGwgaGl0IGEgc2hpcFxuICAgICAgdmFsaWRNb3ZlID0gdGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpO1xuICAgICAgaWYgKHZhbGlkTW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gbmV4dE1vdmU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gdmFsaWQgYWRqYWNlbnQgbW92ZVxuICAgIGlmICh2YWxpZE1vdmUgPT09IGZhbHNlKSB7XG4gICAgICAvLyByZXNldCBsYXN0SGl0XG4gICAgICB0aGlzLmxhc3RIaXQgPSAwO1xuICAgICAgLy8gcmV0dXJuIGZhbHNlIHNvIGNvbXB1dGVyIGNhbiBtYWtlIGNhbGxiYWNrIG9uIGl0c2VsZlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGVzdGltYXRlTmV4dE1vdmUoaGl0cywgYm9hcmQpIHtcbiAgICBsZXQgbmV4dE1vdmU7XG4gICAgaWYgKGhpdHMucHJldmlvdXNIaXQueCAhPSBoaXRzLmxhc3RIaXQueCkge1xuICAgICAgbmV4dE1vdmUgPSB0aGlzLmVzdGltYXRlTmV4dFhNb3ZlKGhpdHMsIGJvYXJkKTtcbiAgICB9IGVsc2UgaWYgKGhpdHMucHJldmlvdXNIaXQueSAhPSBoaXRzLmxhc3RIaXQueSkge1xuICAgICAgbmV4dE1vdmUgPSB0aGlzLmVzdGltYXRlTmV4dFlNb3ZlKGhpdHMsIGJvYXJkKTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHRNb3ZlO1xuICB9XG5cbiAgZXN0aW1hdGVOZXh0WE1vdmUoaGl0cywgYm9hcmQpIHtcbiAgICBsZXQgbmV4dE1vdmU7XG4gICAgbGV0IHg7XG4gICAgaWYgKGhpdHMucHJldmlvdXNIaXQueCA8IGhpdHMubGFzdEhpdC54KSB7XG4gICAgICAvLyBjb21wdXRlciBpcyBtb3ZpbmcgcmlnaHRcbiAgICAgIHggPSBoaXRzLmxhc3RIaXQueCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXB1dGVyIGlzIG1vdmluZyBsZWZ0XG4gICAgICB4ID0gaGl0cy5sYXN0SGl0LnggLSAxO1xuICAgIH1cbiAgICBuZXh0TW92ZSA9IHsgeCwgeTogaGl0cy5sYXN0SGl0LnkgfTtcbiAgICBpZiAodGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpKSB7XG4gICAgICByZXR1cm4gbmV4dE1vdmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5leHQgbW92ZSBpbiB0aGUgc2FtZSBkaXJlY3Rpb25cbiAgICAgIHggPSB4ICsgKHggLSBoaXRzLmxhc3RIaXQueCk7XG4gICAgICBuZXh0TW92ZSA9IHsgeCwgeTogaGl0cy5sYXN0SGl0LnkgfTtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWRNb3ZlKG5leHRNb3ZlLCBib2FyZCkpIHtcbiAgICAgICAgcmV0dXJuIG5leHRNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmV4dCBtb3ZlIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICAgICAgeCA9IHggLSAyICogKHggLSBoaXRzLmxhc3RIaXQueCk7XG4gICAgICAgIG5leHRNb3ZlID0geyB4LCB5OiBoaXRzLmxhc3RIaXQueSB9O1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHRNb3ZlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBubyBtb3ZlIGlzIGZvdW5kLCByZXR1cm4gbnVsbFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZXN0aW1hdGVOZXh0WU1vdmUoaGl0cywgYm9hcmQpIHtcbiAgICBsZXQgbmV4dE1vdmU7XG4gICAgbGV0IHk7XG4gICAgaWYgKGhpdHMucHJldmlvdXNIaXQueSA8IGhpdHMubGFzdEhpdC55KSB7XG4gICAgICAvLyBjb21wdXRlciBpcyBtb3ZpbmcgZG93blxuICAgICAgeSA9IGhpdHMubGFzdEhpdC55ICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29tcHV0ZXIgaXMgbW92aW5nIHVwXG4gICAgICB5ID0gaGl0cy5sYXN0SGl0LnkgLSAxO1xuICAgIH1cbiAgICBuZXh0TW92ZSA9IHsgeDogaGl0cy5sYXN0SGl0LngsIHkgfTtcbiAgICBpZiAodGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpKSB7XG4gICAgICByZXR1cm4gbmV4dE1vdmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5leHQgbW92ZSBpbiB0aGUgc2FtZSBkaXJlY3Rpb25cbiAgICAgIHkgPSB5ICsgKHkgLSBoaXRzLmxhc3RIaXQueSk7XG4gICAgICBuZXh0TW92ZSA9IHsgeDogaGl0cy5sYXN0SGl0LngsIHkgfTtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWRNb3ZlKG5leHRNb3ZlLCBib2FyZCkpIHtcbiAgICAgICAgcmV0dXJuIG5leHRNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmV4dCBtb3ZlIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICAgICAgeSA9IHkgLSAyICogKHkgLSBoaXRzLmxhc3RIaXQueSk7XG4gICAgICAgIG5leHRNb3ZlID0geyB4OiBoaXRzLmxhc3RIaXQueCwgeSB9O1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkTW92ZShuZXh0TW92ZSwgYm9hcmQpKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHRNb3ZlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIG5vIG1vdmUgaXMgZm91bmQsIHJldHVybiBudWxsXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb21wYXJlSGl0cyhvYmplY3QpIHtcbiAgICBjb25zdCBsZW5ndGggPSBvYmplY3QuaGl0cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA+PSAyKSB7XG4gICAgICBsZXQgZmlyc3RIaXQgPSBvYmplY3QuaGl0c1swXTtcbiAgICAgIGZpcnN0SGl0ID0geyB4OiBmaXJzdEhpdFswXSwgeTogZmlyc3RIaXRbMV0gfTtcbiAgICAgIGxldCBwcmV2aW91c0hpdCA9IG9iamVjdC5oaXRzW2xlbmd0aCAtIDJdO1xuICAgICAgcHJldmlvdXNIaXQgPSB7IHg6IHByZXZpb3VzSGl0WzBdLCB5OiBwcmV2aW91c0hpdFsxXSB9O1xuICAgICAgY29uc3QgbGFzdEhpdCA9IHRoaXMubGFzdEhpdDtcbiAgICAgIGNvbnN0IGhpdHMgPSB7IGZpcnN0SGl0LCBsYXN0SGl0LCBwcmV2aW91c0hpdCB9O1xuICAgICAgcmV0dXJuIGhpdHM7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZE1vdmUoaW5kZXgsIGJvYXJkKSB7XG4gICAgaWYgKGluZGV4LnggPj0gMCAmJiBpbmRleC54IDwgMTAgJiYgaW5kZXgueSA+PSAwICYmIGluZGV4LnkgPCAxMCkge1xuICAgICAgY29uc3QgbW92ZSA9IGJvYXJkLmJvYXJkW2luZGV4LnhdW2luZGV4LnldO1xuICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICBsZXQgbWlzc2VkID0gdGhpcy5jaGVja01pc3NlZEFycmF5KGluZGV4LCBib2FyZCk7XG4gICAgICBpZiAobWlzc2VkID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAobW92ZSA9PSBcIjBcIiAmJiBtaXNzZWQgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBtb3ZlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vdmUuaGl0cy5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgICAgICBpZiAoaGl0WzBdID09IGluZGV4LnggJiYgaGl0WzFdID09IGluZGV4LnkpIHtcbiAgICAgICAgICAgIGFyci5wdXNoKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNoZWNrTWlzc2VkQXJyYXkoaW5kZXgsIGJvYXJkKSB7XG4gICAgY29uc3QgbWlzc2VkQXJyYXkgPSBib2FyZC5taXNzZWQ7XG4gICAgY29uc3QgaXNNaXNzZWQgPSBtaXNzZWRBcnJheS5maWx0ZXIoKGNvb3JkcykgPT4ge1xuICAgICAgcmV0dXJuIGNvb3Jkc1swXSA9PSBpbmRleC54ICYmIGNvb3Jkc1sxXSA9PSBpbmRleC55O1xuICAgIH0pO1xuICAgIGlmIChpc01pc3NlZC5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFuZG9tO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IFtdO1xuICAgIHRoaXMuc3VuayA9IHRoaXMuX2lzU3VuaygpO1xuICAgIHRoaXMuaW5kZXggPSBbXTtcbiAgICAvLyBheGlzIGZyb20gRE9NXG4gIH1cblxuICBfaXNTdW5rKGxlbmd0aCA9IHRoaXMubGVuZ3RoLCBoaXRzID0gdGhpcy5oaXRzKSB7XG4gICAgaWYgKGxlbmd0aCA9PT0gaGl0cy5sZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGl0KGluZGV4KSB7XG4gICAgY29uc3QgYXJyTG9va3VwID0gdGhpcy5oaXRzLmZpbHRlcigoY29vcmRzKSA9PiB7XG4gICAgICByZXR1cm4gY29vcmRzWzBdID09IGluZGV4WzBdICYmIGNvb3Jkc1sxXSA9PSBpbmRleFsxXTtcbiAgICB9KTtcbiAgICBpZiAoYXJyTG9va3VwLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmhpdHMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHRoaXMuc3VuayA9IHRoaXMuX2lzU3VuaygpO1xuICAgIHJldHVybiB0aGlzLmhpdHM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4vZm9udHMvUHJlc3NTdGFydDJQLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi9mb250cy9BdWRpb3dpZGUtUmVndWxhci50dGZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMl9fXyA9IG5ldyBVUkwoXCIuL2ltZy9iYWNrZ3JvdW5kLmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8zX19fID0gbmV3IFVSTChcIi4vaW1nL3BhdHJvbC5zdmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzJfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8yX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8zX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfM19fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCI6cm9vdCB7XFxuICAtLWNvbG9yLTE6ICMxZjc1ZmU7XFxuICAtLWNvbG9yLTEtZGFyazogIzAwNDQ4ODtcXG4gIC0tY29sb3ItMjogI2EyYmZmMjtcXG4gIC0tY29sb3ItMzogI2U2ZTZlNjtcXG4gIC0tY29sb3ItNDogI2Y5NzMwNjtcXG4gIC0tY29sb3ItNTogI2M2YjFkNjtcXG4gIC0tY29sb3ItNjogI2M2ZDhhZjtcXG4gIC0tYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgZm9udC1mYW1pbHk6IEF1ZGlvd2lkZSwgc2Fucy1zZXJpZjtcXG59XFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogUHJlc3Mtc3RhcnQ7XFxuICBzcmM6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gKyBcIik7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IEF1ZGlvd2lkZTtcXG4gIHNyYzogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyArIFwiKTtcXG59XFxuXFxuKiB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCB7XFxuICBtYXgtd2lkdGg6IDEwMHZ3O1xcbiAgbWF4LWhlaWdodDogMTAwdmg7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci0xLWRhcmspO1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBtYXgtd2lkdGg6IDEwMHZ3O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzJfX18gKyBcIik7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG5cXG4vKiBHQU1FIFdSQVBQRVIgKi9cXG5cXG4ud3JhcHBlciB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42MSk7XFxufVxcblxcbi8qIEhFQURFUiAqL1xcblxcbi5nYW1lLXRpdGxlIHtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci00KTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgcGFkZGluZy10b3A6IDFyZW07XFxuICBsZXR0ZXItc3BhY2luZzogNXB4O1xcbiAgYW5pbWF0aW9uLW5hbWU6IHNsaWRlLWluLXRvcCwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXMsIDJzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbn1cXG5cXG4uY2FwdGFpbi1oZWFkZXIge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBjb2xvcjogdmFyKC0tY29sb3ItMik7XFxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xcbiAgYW5pbWF0aW9uOiBmYWRlLWluIDRzO1xcbiAgcGFkZGluZzogMCAwLjJyZW07XFxufVxcblxcbi5oZWFkZXItd3JhcHBlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA0NDg4MzM7XFxuICB3aWR0aDogOTAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci0yKTtcXG4gIGZvbnQtZmFtaWx5OiBQcmVzcy1zdGFydDtcXG59XFxuXFxuLmhlYWRlci10dXJuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci0yKTtcXG4gIGxldHRlci1zcGFjaW5nOiAycHg7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBhbmltYXRpb246IHR5cGluZyAxcyBsaW5lYXIgaW5maW5pdGU7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxufVxcblxcbi8qIEJVVFRPTlMgKi9cXG5cXG4uYnRuIHtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDBweCAxcHggMHB4IDBweCAjZmNlMmMxO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI2ZmYzQ3NyA1JSwgdmFyKC0tY29sb3ItNCkgMTAwJSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNDc3O1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2VlYjQ0ZjtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsO1xcbiAgZm9udC1zaXplOiAxNXB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBwYWRkaW5nOiA2cHggMjRweDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIHRleHQtc2hhZG93OiAwcHggMXB4IDBweCAjY2M5ZjUyO1xcbiAgYW5pbWF0aW9uLW5hbWU6IHNsaWRlLWluLXRvcCwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogM3MsIDNzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbn1cXG5cXG4uYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICNmYjllMjUgNSUsICNmZmM0NzcgMTAwJSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmI5ZTI1O1xcbn1cXG4uYnRuOmFjdGl2ZSB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0b3A6IDFweDtcXG59XFxuXFxuLyogTkFNRSBGT1JNICovXFxuXFxuZm9ybSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGhlaWdodDogNjB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGdhcDogMjVweDtcXG59XFxuXFxubGFiZWwge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBjb2xvcjogdmFyKC0tY29sb3ItMyk7XFxuICBhbmltYXRpb24tbmFtZTogc2xpZGUtaW4tdG9wLCBmYWRlLWluO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcywgMXM7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluLW91dCwgZWFzZS1vdXQ7XFxuICBmb250LWZhbWlseTogUHJlc3Mtc3RhcnQ7XFxufVxcblxcbmlucHV0IHtcXG4gIHdpZHRoOiA5MHZ3O1xcbiAgaGVpZ2h0OiA4dmg7XFxuICBmb250LXNpemU6IDEuMnJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMzcpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTMpO1xcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cyk7XFxuICBhbmltYXRpb24tbmFtZTogc2xpZGUtaW4tdG9wLCBmYWRlLWluO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcywgMnM7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluLW91dCwgZWFzZS1vdXQ7XFxufVxcblxcbmlucHV0OmZvY3VzIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcXG59XFxuXFxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbn1cXG5cXG4vKiBQTEFZRVIgQk9BUkRTICovXFxuXFxuLmJvYXJkcy1jb250YWluZXIge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICByb3ctZ2FwOiAxMHB4O1xcbiAgbWFyZ2luOiAxcmVtIDBweDtcXG59XFxuXFxuLnBsYXllci1ib2FyZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgZ2FwOiAzcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQ6ICMwMDQ0ODg0ODtcXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuICBib3gtc2hhZG93OiAwIDRweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMC4xcHgpO1xcbiAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTAuMXB4KTtcXG4gIGFuaW1hdGlvbi1uYW1lOiBzbGlkZS1pbiwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXMsIDJzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5zcXVhcmUge1xcbiAgd2lkdGg6IDI1cHg7XFxuICBoZWlnaHQ6IDI1cHg7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XFxuICBib3JkZXItcmFkaXVzOiAycHg7XFxuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAxcztcXG4gIHRyYW5zaXRpb246IGVhc2UtaW4tb3V0IDAuM3M7XFxufVxcblxcbnNwYW4ge1xcbiAgZm9udC1zaXplOiAwLjhyZW07XFxuICBwYWRkaW5nLWJvdHRvbTogMC4ycmVtO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTIpO1xcbn1cXG5cXG4ubm90LWFsbG93ZWQge1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLmFsbG93ZWQge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNTMsIDIwNSwgNTAsIDAuNSk7XFxufVxcblxcbi5yZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuNyk7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTgzLCAyNTUsIDAuNTIxKTtcXG4gIGN1cnNvcjogbm8tZHJvcDtcXG4gIGNvbnRlbnQ6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzNfX18gKyBcIik7XFxufVxcblxcbi5wbGF5ZXItY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5wbGF5ZXItbmFtZSB7XFxuICBwYWRkaW5nLWJvdHRvbTogMC4zcmVtO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTMpO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDJweDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIGFuaW1hdGlvbjogZmFkZS1pbiA0cztcXG59XFxuXFxuLnRhcmdldCB7XFxuICBjdXJzb3I6IGNyb3NzaGFpcjtcXG59XFxuXFxuLnRhcmdldDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci0xKTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxuICBib3JkZXItcmFkaXVzOiA1MHB4O1xcbn1cXG5cXG4ubWlzcyB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xcbn1cXG5cXG4vKiBGT09URVIgKi9cXG5cXG4uZm9vdGVyIHtcXG4gIGZvbnQtc2l6ZTogMC42cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M2YjFkNjdlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDV2aDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBhbmltYXRpb246IGZhZGUtaW4gMnM7XFxuICBmb250LWZhbWlseTogUHJlc3Mtc3RhcnQ7XFxuICBiYWNrZ3JvdW5kOiAjMDA0NDg4MTY7XFxuICBib3JkZXItcmFkaXVzOiAxNnB4O1xcbiAgYm94LXNoYWRvdzogMCA0cHggMzBweCByZ2JhKDAsIDAsIDAsIDAuMSk7XFxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTAuMXB4KTtcXG4gIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwLjFweCk7XFxufVxcblxcbmEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTYpO1xcbn1cXG5cXG5hOmhvdmVyIHtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci00KTtcXG59XFxuLmZvb3Rlci10ZXh0IHtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci01KTtcXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbiB7XFxuICBmcm9tIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xcbiAgfVxcbiAgdG8ge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZmFkZS1pbiB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbi10b3Age1xcbiAgZnJvbSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XFxuICB9XFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbi1ib3R0b20ge1xcbiAgZnJvbSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIHRvIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMDAlKTtcXG4gIH1cXG59XFxuXFxuLyogTUVESUEgUVVFUlkgKi9cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDI2cHgpIHtcXG4gIC53cmFwcGVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgwNCk7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAzMTlweCkge1xcbiAgLndyYXBwZXIge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcblxcbiAgYm9keSB7XFxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDI2cHgpIHtcXG4gIC5wbGF5ZXItYm9hcmQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMzVweCk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAzNXB4KTtcXG4gIH1cXG5cXG4gIC5zcXVhcmUge1xcbiAgICB3aWR0aDogMzVweDtcXG4gICAgaGVpZ2h0OiAzNXB4O1xcbiAgfVxcblxcbiAgLmdhbWUtdGl0bGUge1xcbiAgICBmb250LXNpemU6IDEuNnJlbTtcXG4gIH1cXG5cXG4gIC5jYXB0YWluLWhlYWRlciB7XFxuICAgIGZvbnQtc2l6ZTogMXJlbTtcXG4gIH1cXG5cXG4gIGxhYmVsIHtcXG4gICAgZm9udC1zaXplOiAxcmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAzNzZweCkge1xcbiAgLnBsYXllci1ib2FyZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAyNXB4KTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgfVxcblxcbiAgLnNxdWFyZSB7XFxuICAgIHdpZHRoOiAyNXB4O1xcbiAgICBoZWlnaHQ6IDI1cHg7XFxuICB9XFxuXFxuICAuZ2FtZS10aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpIHtcXG4gIC5wbGF5ZXItYm9hcmQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMjVweCk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAyNXB4KTtcXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgfVxcblxcbiAgLmJvYXJkLXdyYXBwZXIge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGdyaWQtY29sdW1uOiAxLyAtMTtcXG4gIH1cXG5cXG4gIC5zcXVhcmUge1xcbiAgICB3aWR0aDogMjVweDtcXG4gICAgaGVpZ2h0OiAyNXB4O1xcbiAgfVxcblxcbiAgLmJvYXJkcy1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICB9XFxuXFxuICAuaGVhZGVyLXdyYXBwZXIge1xcbiAgICBncmlkLWFyZWE6IDEgLyAxIC8gMi8gMztcXG4gIH1cXG4gIC5jYXB0YWluLWhlYWRlciB7XFxuICAgIGdyaWQtYXJlYTogMS8gMSAvIDIgLyAzO1xcbiAgfVxcblxcbiAgLmJ0biB7XFxuICAgIGdyaWQtYXJlYTogMiAvIDEgLyAzIC8gMztcXG4gIH1cXG5cXG4gIGlucHV0IHtcXG4gICAgd2lkdGg6IDcwJTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xcbiAgLnBsYXllci1ib2FyZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAyNXB4KTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICB9XFxuXFxuICAuc3F1YXJlIHtcXG4gICAgd2lkdGg6IDI1cHg7XFxuICAgIGhlaWdodDogMjVweDtcXG4gIH1cXG5cXG4gIC5ib2FyZHMtY29udGFpbmVyIHtcXG4gICAgZ2FwOiAyNXB4O1xcbiAgfVxcblxcbiAgaW5wdXQge1xcbiAgICB3aWR0aDogNTAlO1xcbiAgfVxcblxcbiAgLmZvb3RlciB7XFxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogMTQ0MHB4KSB7XFxuICAucGxheWVyLWJvYXJkIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDQ1cHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgNDVweCk7XFxuICAgIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIH1cXG5cXG4gIC5zcXVhcmUge1xcbiAgICB3aWR0aDogNDVweDtcXG4gICAgaGVpZ2h0OiA0NXB4O1xcbiAgfVxcblxcbiAgLmNhcHRhaW4taGVhZGVyIHtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICB9XFxuXFxuICAucGxheWVyLW5hbWUge1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gIH1cXG5cXG4gIHNwYW4ge1xcbiAgICBmb250LXNpemU6IDEuM3JlbTtcXG4gIH1cXG5cXG4gIC5oZWFkZXItdHVybiB7XFxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogMjU2MHB4KSB7XFxuICAuZ2FtZS10aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG5cXG4gIGxhYmVsLFxcbiAgaW5wdXQsXFxuICBpbnB1dDo6cGxhY2Vob2xkZXIsXFxuICAuY2FwdGFpbi1oZWFkZXIge1xcbiAgICBmb250LXNpemU6IDNyZW07XFxuICB9XFxuXFxuICAuYnRuIHtcXG4gICAgZm9udC1zaXplOiAycmVtO1xcbiAgICBwYWRkaW5nOiAxcmVtO1xcbiAgfVxcblxcbiAgLmZvb3RlciB7XFxuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgfVxcbiAgLnBsYXllci1ib2FyZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCA3MHB4KTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDcwcHgpO1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICAgIGdhcDogN3B4O1xcbiAgfVxcblxcbiAgLnNxdWFyZSB7XFxuICAgIHdpZHRoOiA3MHB4O1xcbiAgICBoZWlnaHQ6IDcwcHg7XFxuICB9XFxuXFxuICAucGxheWVyLW5hbWUge1xcbiAgICBmb250LXNpemU6IDIuOHJlbTtcXG4gIH1cXG5cXG4gIHNwYW4ge1xcbiAgICBmb250LXNpemU6IDIuMnJlbTtcXG4gIH1cXG5cXG4gIC5oZWFkZXItdHVybiB7XFxuICAgIGZvbnQtc2l6ZTogMi42cmVtO1xcbiAgfVxcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQix1QkFBdUI7RUFDdkIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixvQkFBb0I7RUFDcEIsZUFBZTtFQUNmLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLHdCQUF3QjtFQUN4Qiw0Q0FBMEM7QUFDNUM7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsNENBQXVDO0FBQ3pDOztBQUVBO0VBQ0UsVUFBVTtFQUNWLFNBQVM7RUFDVCxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLFlBQVk7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QUFhO0lBQ2IsdUNBQXVDO0lBQ3ZDLG9DQUFvQztJQUNwQyxrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsWUFBWTtFQUNkOztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25CO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7Ozs7SUFJRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsZUFBZTtJQUNmLGFBQWE7RUFDZjs7RUFFQTtJQUNFLGlCQUFpQjtFQUNuQjtFQUNBO0lBQ0UsYUFBYTtJQUNiLHVDQUF1QztJQUN2QyxvQ0FBb0M7SUFDcEMsa0JBQWtCO0lBQ2xCLFFBQVE7RUFDVjs7RUFFQTtJQUNFLFdBQVc7SUFDWCxZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxuICAtLWNvbG9yLTE6ICMxZjc1ZmU7XFxuICAtLWNvbG9yLTEtZGFyazogIzAwNDQ4ODtcXG4gIC0tY29sb3ItMjogI2EyYmZmMjtcXG4gIC0tY29sb3ItMzogI2U2ZTZlNjtcXG4gIC0tY29sb3ItNDogI2Y5NzMwNjtcXG4gIC0tY29sb3ItNTogI2M2YjFkNjtcXG4gIC0tY29sb3ItNjogI2M2ZDhhZjtcXG4gIC0tYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgZm9udC1mYW1pbHk6IEF1ZGlvd2lkZSwgc2Fucy1zZXJpZjtcXG59XFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogUHJlc3Mtc3RhcnQ7XFxuICBzcmM6IHVybCguL2ZvbnRzL1ByZXNzU3RhcnQyUC1SZWd1bGFyLnR0Zik7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IEF1ZGlvd2lkZTtcXG4gIHNyYzogdXJsKC4vZm9udHMvQXVkaW93aWRlLVJlZ3VsYXIudHRmKTtcXG59XFxuXFxuKiB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCB7XFxuICBtYXgtd2lkdGg6IDEwMHZ3O1xcbiAgbWF4LWhlaWdodDogMTAwdmg7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci0xLWRhcmspO1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBtYXgtd2lkdGg6IDEwMHZ3O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6IHVybCguL2ltZy9iYWNrZ3JvdW5kLmpwZyk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG5cXG4vKiBHQU1FIFdSQVBQRVIgKi9cXG5cXG4ud3JhcHBlciB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42MSk7XFxufVxcblxcbi8qIEhFQURFUiAqL1xcblxcbi5nYW1lLXRpdGxlIHtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci00KTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgcGFkZGluZy10b3A6IDFyZW07XFxuICBsZXR0ZXItc3BhY2luZzogNXB4O1xcbiAgYW5pbWF0aW9uLW5hbWU6IHNsaWRlLWluLXRvcCwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXMsIDJzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbn1cXG5cXG4uY2FwdGFpbi1oZWFkZXIge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBjb2xvcjogdmFyKC0tY29sb3ItMik7XFxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xcbiAgYW5pbWF0aW9uOiBmYWRlLWluIDRzO1xcbiAgcGFkZGluZzogMCAwLjJyZW07XFxufVxcblxcbi5oZWFkZXItd3JhcHBlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA0NDg4MzM7XFxuICB3aWR0aDogOTAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci0yKTtcXG4gIGZvbnQtZmFtaWx5OiBQcmVzcy1zdGFydDtcXG59XFxuXFxuLmhlYWRlci10dXJuIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvci0yKTtcXG4gIGxldHRlci1zcGFjaW5nOiAycHg7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBhbmltYXRpb246IHR5cGluZyAxcyBsaW5lYXIgaW5maW5pdGU7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxufVxcblxcbi8qIEJVVFRPTlMgKi9cXG5cXG4uYnRuIHtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDBweCAxcHggMHB4IDBweCAjZmNlMmMxO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgI2ZmYzQ3NyA1JSwgdmFyKC0tY29sb3ItNCkgMTAwJSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjNDc3O1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2VlYjQ0ZjtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsO1xcbiAgZm9udC1zaXplOiAxNXB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBwYWRkaW5nOiA2cHggMjRweDtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIHRleHQtc2hhZG93OiAwcHggMXB4IDBweCAjY2M5ZjUyO1xcbiAgYW5pbWF0aW9uLW5hbWU6IHNsaWRlLWluLXRvcCwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogM3MsIDNzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbn1cXG5cXG4uYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICNmYjllMjUgNSUsICNmZmM0NzcgMTAwJSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmI5ZTI1O1xcbn1cXG4uYnRuOmFjdGl2ZSB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0b3A6IDFweDtcXG59XFxuXFxuLyogTkFNRSBGT1JNICovXFxuXFxuZm9ybSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGhlaWdodDogNjB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGdhcDogMjVweDtcXG59XFxuXFxubGFiZWwge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICBjb2xvcjogdmFyKC0tY29sb3ItMyk7XFxuICBhbmltYXRpb24tbmFtZTogc2xpZGUtaW4tdG9wLCBmYWRlLWluO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcywgMXM7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluLW91dCwgZWFzZS1vdXQ7XFxuICBmb250LWZhbWlseTogUHJlc3Mtc3RhcnQ7XFxufVxcblxcbmlucHV0IHtcXG4gIHdpZHRoOiA5MHZ3O1xcbiAgaGVpZ2h0OiA4dmg7XFxuICBmb250LXNpemU6IDEuMnJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMzcpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTMpO1xcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tYm9yZGVyLXJhZGl1cyk7XFxuICBhbmltYXRpb24tbmFtZTogc2xpZGUtaW4tdG9wLCBmYWRlLWluO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcywgMnM7XFxuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluLW91dCwgZWFzZS1vdXQ7XFxufVxcblxcbmlucHV0OmZvY3VzIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyNTUsIDI1NSwgMjU1KTtcXG59XFxuXFxuaW5wdXQ6OnBsYWNlaG9sZGVyIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbn1cXG5cXG4vKiBQTEFZRVIgQk9BUkRTICovXFxuXFxuLmJvYXJkcy1jb250YWluZXIge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICByb3ctZ2FwOiAxMHB4O1xcbiAgbWFyZ2luOiAxcmVtIDBweDtcXG59XFxuXFxuLnBsYXllci1ib2FyZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgZ2FwOiAzcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQ6ICMwMDQ0ODg0ODtcXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuICBib3gtc2hhZG93OiAwIDRweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMC4xcHgpO1xcbiAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTAuMXB4KTtcXG4gIGFuaW1hdGlvbi1uYW1lOiBzbGlkZS1pbiwgZmFkZS1pbjtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXMsIDJzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQsIGVhc2Utb3V0O1xcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5zcXVhcmUge1xcbiAgd2lkdGg6IDI1cHg7XFxuICBoZWlnaHQ6IDI1cHg7XFxuICBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XFxuICBib3JkZXItcmFkaXVzOiAycHg7XFxuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAxcztcXG4gIHRyYW5zaXRpb246IGVhc2UtaW4tb3V0IDAuM3M7XFxufVxcblxcbnNwYW4ge1xcbiAgZm9udC1zaXplOiAwLjhyZW07XFxuICBwYWRkaW5nLWJvdHRvbTogMC4ycmVtO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTIpO1xcbn1cXG5cXG4ubm90LWFsbG93ZWQge1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLmFsbG93ZWQge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNTMsIDIwNSwgNTAsIDAuNSk7XFxufVxcblxcbi5yZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuNyk7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTgzLCAyNTUsIDAuNTIxKTtcXG4gIGN1cnNvcjogbm8tZHJvcDtcXG4gIGNvbnRlbnQ6IHVybCguL2ltZy9wYXRyb2wuc3ZnKTtcXG59XFxuXFxuLnBsYXllci1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLnBsYXllci1uYW1lIHtcXG4gIHBhZGRpbmctYm90dG9tOiAwLjNyZW07XFxuICBjb2xvcjogdmFyKC0tY29sb3ItMyk7XFxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgYW5pbWF0aW9uOiBmYWRlLWluIDRzO1xcbn1cXG5cXG4udGFyZ2V0IHtcXG4gIGN1cnNvcjogY3Jvc3NoYWlyO1xcbn1cXG5cXG4udGFyZ2V0OmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yLTEpO1xcbn1cXG5cXG4uaGl0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwcHg7XFxufVxcblxcbi5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XFxufVxcblxcbi8qIEZPT1RFUiAqL1xcblxcbi5mb290ZXIge1xcbiAgZm9udC1zaXplOiAwLjZyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzZiMWQ2N2U7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogNXZoO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFuaW1hdGlvbjogZmFkZS1pbiAycztcXG4gIGZvbnQtZmFtaWx5OiBQcmVzcy1zdGFydDtcXG4gIGJhY2tncm91bmQ6ICMwMDQ0ODgxNjtcXG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuICBib3gtc2hhZG93OiAwIDRweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMC4xcHgpO1xcbiAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTAuMXB4KTtcXG59XFxuXFxuYSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBjb2xvcjogdmFyKC0tY29sb3ItNik7XFxufVxcblxcbmE6aG92ZXIge1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTQpO1xcbn1cXG4uZm9vdGVyLXRleHQge1xcbiAgY29sb3I6IHZhcigtLWNvbG9yLTUpO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNsaWRlLWluIHtcXG4gIGZyb20ge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICB9XFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBmYWRlLWluIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNsaWRlLWluLXRvcCB7XFxuICBmcm9tIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMDAlKTtcXG4gIH1cXG4gIHRvIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNsaWRlLWluLWJvdHRvbSB7XFxuICBmcm9tIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgdG8ge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwMCUpO1xcbiAgfVxcbn1cXG5cXG4vKiBNRURJQSBRVUVSWSAqL1xcblxcbkBtZWRpYSAobWF4LXdpZHRoOiA0MjZweCkge1xcbiAgLndyYXBwZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuODA0KTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDMxOXB4KSB7XFxuICAud3JhcHBlciB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICBib2R5IHtcXG4gICAgYmFja2dyb3VuZDogYmxhY2s7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiA0MjZweCkge1xcbiAgLnBsYXllci1ib2FyZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAzNXB4KTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDM1cHgpO1xcbiAgfVxcblxcbiAgLnNxdWFyZSB7XFxuICAgIHdpZHRoOiAzNXB4O1xcbiAgICBoZWlnaHQ6IDM1cHg7XFxuICB9XFxuXFxuICAuZ2FtZS10aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMS42cmVtO1xcbiAgfVxcblxcbiAgLmNhcHRhaW4taGVhZGVyIHtcXG4gICAgZm9udC1zaXplOiAxcmVtO1xcbiAgfVxcblxcbiAgbGFiZWwge1xcbiAgICBmb250LXNpemU6IDFyZW07XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDM3NnB4KSB7XFxuICAucGxheWVyLWJvYXJkIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMjVweCk7XFxuICB9XFxuXFxuICAuc3F1YXJlIHtcXG4gICAgd2lkdGg6IDI1cHg7XFxuICAgIGhlaWdodDogMjVweDtcXG4gIH1cXG5cXG4gIC5nYW1lLXRpdGxlIHtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xcbiAgLnBsYXllci1ib2FyZCB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAyNXB4KTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICB9XFxuXFxuICAuYm9hcmQtd3JhcHBlciB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZ3JpZC1jb2x1bW46IDEvIC0xO1xcbiAgfVxcblxcbiAgLnNxdWFyZSB7XFxuICAgIHdpZHRoOiAyNXB4O1xcbiAgICBoZWlnaHQ6IDI1cHg7XFxuICB9XFxuXFxuICAuYm9hcmRzLWNvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIH1cXG5cXG4gIC5oZWFkZXItd3JhcHBlciB7XFxuICAgIGdyaWQtYXJlYTogMSAvIDEgLyAyLyAzO1xcbiAgfVxcbiAgLmNhcHRhaW4taGVhZGVyIHtcXG4gICAgZ3JpZC1hcmVhOiAxLyAxIC8gMiAvIDM7XFxuICB9XFxuXFxuICAuYnRuIHtcXG4gICAgZ3JpZC1hcmVhOiAyIC8gMSAvIDMgLyAzO1xcbiAgfVxcblxcbiAgaW5wdXQge1xcbiAgICB3aWR0aDogNzAlO1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XFxuICAucGxheWVyLWJvYXJkIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDI1cHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMjVweCk7XFxuICAgIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIH1cXG5cXG4gIC5zcXVhcmUge1xcbiAgICB3aWR0aDogMjVweDtcXG4gICAgaGVpZ2h0OiAyNXB4O1xcbiAgfVxcblxcbiAgLmJvYXJkcy1jb250YWluZXIge1xcbiAgICBnYXA6IDI1cHg7XFxuICB9XFxuXFxuICBpbnB1dCB7XFxuICAgIHdpZHRoOiA1MCU7XFxuICB9XFxuXFxuICAuZm9vdGVyIHtcXG4gICAgZm9udC1zaXplOiAxLjFyZW07XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcXG4gIC5wbGF5ZXItYm9hcmQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgNDVweCk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCA0NXB4KTtcXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgfVxcblxcbiAgLnNxdWFyZSB7XFxuICAgIHdpZHRoOiA0NXB4O1xcbiAgICBoZWlnaHQ6IDQ1cHg7XFxuICB9XFxuXFxuICAuY2FwdGFpbi1oZWFkZXIge1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gIH1cXG5cXG4gIC5wbGF5ZXItbmFtZSB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgfVxcblxcbiAgc3BhbiB7XFxuICAgIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgfVxcblxcbiAgLmhlYWRlci10dXJuIHtcXG4gICAgZm9udC1zaXplOiAxLjNyZW07XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiAyNTYwcHgpIHtcXG4gIC5nYW1lLXRpdGxlIHtcXG4gICAgZm9udC1zaXplOiA1cmVtO1xcbiAgfVxcblxcbiAgbGFiZWwsXFxuICBpbnB1dCxcXG4gIGlucHV0OjpwbGFjZWhvbGRlcixcXG4gIC5jYXB0YWluLWhlYWRlciB7XFxuICAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gIH1cXG5cXG4gIC5idG4ge1xcbiAgICBmb250LXNpemU6IDJyZW07XFxuICAgIHBhZGRpbmc6IDFyZW07XFxuICB9XFxuXFxuICAuZm9vdGVyIHtcXG4gICAgZm9udC1zaXplOiAyLjVyZW07XFxuICB9XFxuICAucGxheWVyLWJvYXJkIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDcwcHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgNzBweCk7XFxuICAgIHdpZHRoOiBmaXQtY29udGVudDtcXG4gICAgZ2FwOiA3cHg7XFxuICB9XFxuXFxuICAuc3F1YXJlIHtcXG4gICAgd2lkdGg6IDcwcHg7XFxuICAgIGhlaWdodDogNzBweDtcXG4gIH1cXG5cXG4gIC5wbGF5ZXItbmFtZSB7XFxuICAgIGZvbnQtc2l6ZTogMi44cmVtO1xcbiAgfVxcblxcbiAgc3BhbiB7XFxuICAgIGZvbnQtc2l6ZTogMi4ycmVtO1xcbiAgfVxcblxcbiAgLmhlYWRlci10dXJuIHtcXG4gICAgZm9udC1zaXplOiAyLjZyZW07XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOlsiQm9hcmRzIiwiY29uc3RydWN0b3IiLCJiYWNrZ3JvdW5kIiwiY29tcG9uZW50cyIsImNvbnRhaW5lciIsIl9ib2FyZHMiLCJib2FyZHMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzdHlsZSIsImRpc3BsYXkiLCJhcHBlbmQiLCJfY2xlYXIiLCJsZW5ndGgiLCJjaGlsZHJlbiIsImkiLCJmaXJzdENoaWxkIiwicmVtb3ZlIiwiX3JlbmRlciIsInBsYXllciIsImJvYXJkV3JhcHBlciIsInBsYXllckJvYXJkIiwiYm9hcmQiLCJzaXplIiwiaiIsInNxdWFyZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwic3F1YXJlSG9vdmVyIiwic3F1YXJlTW91c2VPdXQiLCJzcXVhcmVDbGljayIsIl9zaGlwUGxhY2VkIiwiaW5kZXgiLCJheGlzIiwic3F1YXJlcyIsIl9maW5kU3F1YXJlcyIsImZvckVhY2giLCJfcmV0cmlldmVMZW5ndGgiLCJfcmV0cmlldmVBeGlzIiwiX2luZGV4IiwidGFyZ2V0IiwiY29udGFpbnMiLCJzaGlwcyIsImdhbWUiLCJwbGF5ZXIxIiwic2hpcCIsInNoaWZ0IiwicGxhY2VTaGlwIiwieCIsInkiLCJzdGFydCIsIkhlYWRlciIsIkZvb3RlciIsIkZvcm0iLCJDb21wb25lbnRzIiwiYm9keSIsIl9iYWNrZ3JvdW5kIiwiaGVhZGVyIiwiZm9ybSIsImZvb3RlciIsInBsYXkiLCJfYXhpc0J1dHRvbiIsImJ0biIsInRleHRDb250ZW50IiwiYXhpc0J0biIsIk51bWJlciIsInF1ZXJ5U2VsZWN0b3IiLCJwdXNoIiwic3RyaW5nIiwidXBkYXRlU2hpcENvdW50IiwicGxheWVyMiIsImNoZWNrU2hpcHMiLCJib2FyZDEiLCJib2FyZDIiLCJhcnIiLCJmaWx0ZXIiLCJzdW5rIiwidXBkYXRlU2hpcENvbnRlbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2V0VGltZW91dCIsIl9hbmltYXRlIiwiZWxlbWVudCIsInRleHQiLCJkZWxheSIsImludGVydmFsSWQiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJfZm9vdGVyIiwicGFyYWdyYXBoIiwiYW5jaG9yIiwiaHJlZiIsIkdhbWUiLCJfbmFtZUZvcm0iLCJsYWJlbCIsImlucHV0Iiwic3VibWl0IiwiaWQiLCJwbGFjZWhvbGRlciIsImlucHV0VmFsaWRhdGlvbiIsInNldEF0dHJpYnV0ZSIsInN1Ym1pdEJ0biIsImZvY3VzIiwia2V5Iiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidmFsdWUiLCJuYW1lIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHJpbmciLCJUdXJuIiwiX3JlbmRlckhlYWRlciIsIl9yZW5kZXJCb2FyZCIsInN0b3AiLCJpbml0IiwiX3JlbmRlclNoaXBzIiwiYXBwZW5kQ2hpbGQiLCJfYWRkUGxheWVyTmFtZSIsIl9hZGRTaGlwQ291bnQiLCJwbGF5ZXJOYW1lIiwic2hpcFN0YXR1cyIsIl9oaXRPUm1pc3MiLCJ1bmRlZmluZWQiLCJfZmluZFNxdWFyZSIsIl9taXNzQ29sb3IiLCJfaGl0Q29sb3IiLCJzdG9wR2FtZSIsInBhcmVudEVsZW1lbnQiLCJ0dXJuIiwiX2hlYWRlciIsImlubmVySFRNTCIsIlBsYXllciIsIlJhbmRvbSIsImNvbXB1dGVyIiwibG9hZGVkIiwiX2luaXQiLCJjb21wdXRlclR1cm4iLCJhbGxTaGlwc1N1bmsiLCJfYXJlU2hpcHNTdW5rIiwicHJpbnRXaW5uZXIiLCJoaXQiLCJtb3ZlIiwibGFzdEhpdCIsInJhbmRvbUNvb3JkcyIsInZhbGlkTW92ZSIsImlzVmFsaWRNb3ZlIiwibmV4dE1vdmUiLCJhZGphY2VudE1vdmVzIiwiY29tcHV0ZXJIaXQiLCJtaXNzZWQiLCJldmFsdWF0ZVdpbm5lciIsIkdhbWVib2FyZCIsIl9jcmVhdGVCb2FyZCIsImdyaWQiLCJBcnJheSIsImZpbGwiLCJtYXAiLCJfaXNNaXNzZWRBdHRhY2siLCJyZWNlaXZlQXR0YWNrIiwibWlzc2VkQXR0YWNrIiwiYXJyTG9va3VwIiwiY29vcmRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIlNoaXAiLCJjb25zb2xlIiwibG9nIiwicmFuZG9tQXhpcyIsInBsYWNlU2hpcFJhbmRvbSIsIl9pc1ZhbGlkTW92ZSIsIl9zcXVhcmUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJtb3ZlcyIsIm9iamVjdCIsImhpdHMiLCJjb21wYXJlSGl0cyIsImVzdGltYXRlTmV4dE1vdmUiLCJmaXJzdEhpdCIsIm5leHRYIiwibmV4dFkiLCJwcmV2aW91c0hpdCIsImVzdGltYXRlTmV4dFhNb3ZlIiwiZXN0aW1hdGVOZXh0WU1vdmUiLCJjaGVja01pc3NlZEFycmF5IiwibWlzc2VkQXJyYXkiLCJpc01pc3NlZCIsIl9pc1N1bmsiXSwic291cmNlUm9vdCI6IiJ9