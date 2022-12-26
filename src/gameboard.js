class Gameboard {
  constructor(size) {
    this.size = size;
    this.board = this._createBoard(this.size);
  }

  _createBoard(size) {
    const grid = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    return grid;
  }

  placeShip(ship, x, y) {
    // check for axis from DOM
    for (let i = 0; i < ship.length; i++) {
      if (x + ship.length < this.size) {
        ship.index.push([x + i, y]);
        this.board[x + i][y] = ship;
      } else return console.log("I can't place it here");
    }
  }

  receiveAttack(x, y) {
    const ship = this.board[x][y];
    if (ship != 0) {
      ship.hit([x, y]);
    } else {
      return; // push missed cords to miss array
    }

    // check whether attack hit the ship
    // record missed or call hit on the ship
  }
}

const board = new Gameboard(8);

module.exports = Gameboard;
