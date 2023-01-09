class Turn {
  constructor(game, background) {
    this.game = game;
    this.boards = background;
    this.header = this._renderHeader();
    this.board1 = this._renderBoard(game.player1);
    this.board2 = this._renderBoard(game.player2);
    this.init = this.init();
  }

  init(game = this.game, background = this.boards) {
    console.log(game.board1.ships);
    console.log(game.board2.ships);
    console.log(background);
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
    for (let i = 0; i < player.board.size; i++) {
      for (let j = 0; j < player.board.size; j++) {
        const square = document.createElement("div");
        // square.classList.add(`x${j}y${i}`);
        square.classList.add("square");
        // square.classList.add("not-allowed");
        // square.addEventListener("mouseover", (e) => this.#squareHoover(e));
        // square.addEventListener("mouseout", (e) => this.#squareMouseOut(e));
        // square.addEventListener("click", (e) => this.#squareClick(e));
        playerBoard.append(square);
      }
    }
    container.append(playerBoard);
    background.append(container);
    return container;
  }
}

export default Turn;
