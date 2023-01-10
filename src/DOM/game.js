class Turn {
  constructor(game, background) {
    this.game = game;
    this.boards = background;
    this.header = this._renderHeader();
    this.board1 = this._renderBoard(game.player1);
    this.board2 = this._renderBoard(game.player2);
    this.init = this.init();
  }

  init(game = this.game, board1 = this.board1, board2 = this.board2) {
    const player1 = game.board1.ships;
    const player2 = game.board2.ships;
    this._renderShips(board1, player1);
    this._renderShips(board2, player2);
  }

  _renderHeader(background = this.boards.container) {
    const container = document.createElement("div");
    container.classList.add("header-wrapper");
    const header = document.createElement("h5");
    header.classList.add("header-turn");
    header.textContent = "Make a move captain";
    container.appendChild(header);
    background.appendChild(container);
    return container;
  }

  _renderBoard(player, background = this.boards.container) {
    const container = document.createElement("div");
    container.classList.add("player-container");
    const playerName = document.createElement("h5");
    playerName.classList.add("player-name");
    playerName.textContent = `${player.name}'s board`;
    container.append(playerName);
    const playerBoard = document.createElement("div");
    playerBoard.classList.add("player-board");
    playerBoard.classList.add(`${player.name}`);
    for (let i = 0; i < player.board.size; i++) {
      for (let j = 0; j < player.board.size; j++) {
        const square = document.createElement("div");
        square.classList.add(`x${j}y${i}`);
        square.classList.add("square");
        square.classList.add("target");
        square.addEventListener("click", (e) => this.#squareClick(e));
        playerBoard.append(square);
      }
    }
    container.append(playerBoard);
    background.append(container);
    return playerBoard;
  }

  _renderShips(board, ships) {
    ships.forEach((ship) => {
      const axis = ship.axis;
      const length = ship.length;
      let index = ship.index[0];
      index = { x: index[0], y: index[1] };
      const squares = this._findSquares(index, length, axis, board);
      squares.forEach((square) => {
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
    if (target == undefined) return;
    else if (target == "miss") {
      board = this._findSquare(index, board);
      this._missColor(board);
      // color
    } else if (target == "hit") {
      board = this._findSquare(index, board);
      this._hitColor(board);
      // color
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

  #squareClick(e, game = this.game) {
    const board = e.path[1];
    const string = e.target.classList[0];
    const index = game.components._index(string);
    if (board.classList.contains("not-allowed")) return;
    else if (board.classList.contains("Computer")) {
      game.turn("Computer", index);
    } else {
      game.turn("Player", index);
    }
  }
}

export default Turn;
