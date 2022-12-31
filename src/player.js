import Gameboard from "./gameboard";

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
  }

  move(x, y) {
    this.board.receiveAttack(x, y);
  }
}

module.exports = Player;
