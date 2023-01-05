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

  #squareClick(e, components = this.components) {
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

export default Boards;
