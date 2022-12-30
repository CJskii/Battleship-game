class Gameboard {
  constructor(size) {
    this.size = size;
    this.board = this._createBoard(this.size);
    this.missed = [];
    this.ships = [];
  }

  _createBoard(size) {
    const grid = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
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

  placeShip(ship, x, y) {
    // check for axis from DOM
    this.ships.push(ship);
    for (let i = 0; i < ship.length; i++) {
      if (x + ship.length < this.size) {
        ship.index.push([x + i, y]);
        this.board[x + i][y] = ship;
      } else return;
    }
  }

  receiveAttack(x, y) {
    const ship = this.board[x][y];
    if (ship != 0) {
      ship.hit([x, y]);
    } else {
      // check for duplicates
      const arrLookup = this.missed.filter((coords) => {
        return coords[0] == x && coords[1] == y;
      });
      // if duplicate found do nothing
      if (arrLookup.length > 0) {
        return;
      }
      // if no duplicates push to missed array
      else {
        return this.missed.push([x, y]); // push missed cords to miss array
      }
    }
  }
}

module.exports = Gameboard;
