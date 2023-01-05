import Gameboard from "./gameboard";
import Ship from "./ship";

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.ships = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
  }

  move(x, y) {
    this.board.receiveAttack(x, y);
  }

  init(string) {
    if (!string) {
      console.log("render player 1");
    } else {
      console.log("render player 2");
    }
  }
}

export default Player;
