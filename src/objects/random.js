class Random {
  constructor(player) {
    this.player = player;
    this.init = this.init();
    this.lastHit = 0;
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
    if (arr.length == 0) return true;
    else return false;
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
    return { x, y };
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
    let moves = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const x = Number(lastHit.x);
    const y = Number(lastHit.y);
    let validMove;
    // check if those moves can be randomized instead of selecting in the same pattern
    for (let i = 0; i < moves.length; i++) {
      // calculate next move coords
      let nextX = x + Number(moves[i][0]);
      let nextY = y + Number(moves[i][1]);
      let nextMove = { x: nextX, y: nextY };
      // check if move is within board
      if (nextX >= 0 && nextX < 10 && nextY >= 0 && nextY < 10) {
        // check if next move will hit a ship
        validMove = this.isValidMove(nextMove, board);
        if (validMove === true) {
          return nextMove; // not false
        }
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

  isValidMove(index, board) {
    const move = board.board[index.x][index.y];
    const arr = [];
    let missed = this.checkMissedArray(index, board);
    if (missed === true) return false;
    if (move == "0" && missed === false) return true;
    else if (typeof move === "object") {
      move.hits.forEach((hit) => {
        if (hit[0] == index.x && hit[1] == index.y) {
          arr.push(false);
        }
      });
      if (arr.length == 0) {
        return true;
      } else return false;
    }
  }

  checkMissedArray(index, board) {
    const missedArray = board.missed;
    const isMissed = missedArray.filter((coords) => {
      return coords[0] == index.x && coords[1] == index.y;
    });
    if (isMissed.length == 0) return false;
    else return true;
  }
}

export default Random;
