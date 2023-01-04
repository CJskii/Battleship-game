import Game from "../index.js";

class Components {
  constructor(body) {
    this.body = body;
    this.background = this._background(body);
    this.header = this._header();
    this.boards = this._boards();
    this.form = this._nameForm();
    this.footer = this._footer();
    this.game;
    this.axis;
  }

  _background(body) {
    // Create the game wrapper element
    const background = document.createElement("div");
    background.classList.add("wrapper");
    body.append(background);
    return background;
  }

  _header(background = this.background) {
    // Create the title element
    const header = document.createElement("h1");
    header.textContent = "Battleship";
    header.classList.add("game-title");
    background.append(header);
    return header;
  }

  _boards(background = this.background) {
    // Create boards wrapper element
    const boards = document.createElement("div");
    boards.classList.add("boards-container");
    boards.style.display = "none";
    background.append(boards);
    return boards;
  }

  _nameForm(background = this.background) {
    // Create form + label + input + submit elements
    const form = document.createElement("form");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const submit = document.createElement("button");
    input.id = "name";
    input.placeholder = "Captain name...";
    label.setAttribute("for", input);
    label.textContent = "Enter player name:";
    submit.textContent = "Submit";
    submit.classList.add("btn");
    submit.addEventListener("click", (e) => this.#submitBtn(e, input));
    form.append(label);
    form.append(input);
    form.append(submit);
    background.append(form);
    return form;
  }

  _footer(background = this.background) {
    // Create footer element
    const footer = document.createElement("div");
    const paragraph = document.createElement("p");
    const anchor = document.createElement("a");
    footer.classList.add("footer");
    paragraph.textContent = "Created by ";
    anchor.textContent = "CJski";
    anchor.target = "_blank";
    anchor.href = "https://github.com/CJskii/Battleship-game";
    paragraph.append(anchor);
    footer.append(paragraph);
    background.append(footer);
    return footer;
  }

  _renderHeader(player) {
    const header = document.createElement("h6");
    header.classList.add("captain-header");
    header.textContent = `Captain ${player.name}, please place your ships`;
    this.boards.append(header);
    return header;
  }

  _axisButton() {
    const btn = document.createElement("button");
    btn.textContent = "Axis: X";
    btn.classList.add("btn");
    btn.addEventListener("click", (e) => this.#axisBtn(e, btn));
    this.boards.append(btn);
    this.axis = btn;
    return btn;
  }

  _renderBoard(player) {
    const playerBoard = document.createElement("div");
    playerBoard.classList.add("player-board");
    for (let i = 0; i < player.board.size; i++) {
      for (let j = 0; j < player.board.size; j++) {
        const square = document.createElement("div");
        square.classList.add(`x${j}y${i}`);
        square.classList.add("square");
        square.classList.add("not-allowed");
        square.addEventListener("mouseover", (e) => this.#squareHoover(e));
        square.addEventListener("mouseout", (e) => this.#squareMouseOut(e));
        square.addEventListener("click", (e) => this.#squareClick(e));
        playerBoard.append(square);
      }
    }
    this.boards.append(playerBoard);
    return playerBoard;
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

  _retrieveLength() {
    const ship = this.game.player1.ships[0];
    return ship.length;
  }

  _index(string) {
    string = { x: string[1], y: string[3] };
    return string;
  }

  _shipPlaced(index, axis, length) {
    const squares = this._findSquares(index, length, axis);
    squares.forEach((square) => {
      square.classList.add("ship");
    });
  }

  // Listeners

  #submitBtn(e, input, form = this.form, boards = this.boards) {
    if (input.value == "") {
      input.placeholder = "You must enter name";
      e.preventDefault();
      console.log(e);
    } else {
      // call to index.js
      this.game = new Game(input.value, this);
      form.remove();
      boards.style.display = "";
    }
    return input.value;
  }

  #axisBtn(e, btn) {
    const text = btn.textContent;
    if (text == "Axis: X") {
      btn.textContent = "Axis: Y";
    } else {
      btn.textContent = "Axis: X";
    }
  }

  #squareHoover(e) {
    const length = this._retrieveLength();
    const axis = this._retrieveAxis();
    let index = this._index(e.target.classList[0]);
    const squares = this._findSquares(index, length, axis);
    if (squares === false) {
      e.target.classList.add("red");
    } else {
      squares.forEach((square) => {
        square.classList.remove("not-allowed");
        square.classList.add("allowed");
      });
    }
  }

  #squareMouseOut(e) {
    const length = this._retrieveLength();
    const axis = this._retrieveAxis();
    let index = this._index(e.target.classList[0]);
    const squares = this._findSquares(index, length, axis);
    if (squares === false) {
      e.target.classList.remove("red");
    } else {
      squares.forEach((square) => {
        square.classList.remove("allowed");
        square.classList.add("not-allowed");
      });
    }
  }

  #squareClick(e) {
    const ships = this.game.player1.ships;
    const index = this._index(e.target.classList[0]);
    const ship = ships.shift();
    this.game.player1.board.placeShip(ship, index.x, index.y);
    this._shipPlaced(index, this._retrieveAxis(), ship.length);
    console.log(this.game.player1.board);
    // check if ships is empty
    // if ships are empty - turn should start
  }
}

export default Components;
