import Game from "../index.js";

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
    header.classList.add("captain-header");
    header.textContent = `Captain ${player.name}, please place your ships`;
    components.boards.container.append(header);
    return header;
  }
}

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
    container.append(playerBoard);
    return playerBoard;
  }

  _shipPlaced(index, axis, length, components = this.components) {
    const squares = components._findSquares(index, length, axis);
    squares.forEach((square) => {
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
      squares.forEach((square) => {
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
      squares.forEach((square) => {
        square.classList.remove("allowed");
        square.classList.add("not-allowed");
      });
    }
  }

  #squareClick(e, components = this.components, boards = this.boards) {
    const ships = components.game.player1.ships;
    const index = components._index(e.target.classList[0]);
    const ship = ships.shift();
    components.game.player1.board.placeShip(ship, index.x, index.y);
    this._shipPlaced(index, components._retrieveAxis(), ship.length);
    // check if ships is empty
    // if ships are empty - turn should start
    if (ships.length === 0) {
      console.log("restart UI and start the turn");
      this._clear();
      // initiate rendering of both player boards
    }
  }
}

class Footer {
  constructor(background) {
    this.footer = this._footer(background);
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
}

class Form {
  constructor(background, components) {
    this.form = this._nameForm(background);
    this.components = components;
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

  #submitBtn(e, input, form = this.form, components = this.components) {
    if (input.value == "") {
      input.placeholder = "You must enter name";
      e.preventDefault();
    } else {
      // call to index.js
      e.preventDefault();
      components.game = new Game(input.value, this.components);
      form.remove();
      components.boards.container.style.display = "";
    }
    return input.value;
  }
}

class Components {
  constructor(body) {
    this.body = body;
    this.background = this._background(body);
    this.header = new Header(this.background, this);
    this.boards = new Boards(this.background, this);
    this.form = new Form(this.background, this);
    this.footer = new Footer(this.background);
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

  _axisButton(boards = this.boards) {
    const btn = document.createElement("button");
    btn.textContent = "Axis: X";
    btn.classList.add("btn");
    btn.addEventListener("click", (e) => this.#axisBtn(e, btn));
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
    string = { x: string[1], y: string[3] };
    return string;
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

export default Components;
