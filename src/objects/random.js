class Random {
  constructor(player) {
    this.player = player;
    this.init = this.init();
    this.lastHit = 0;
    this.missed;
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
    let nextMove;
    const object = board.board[x][y];
    const hits = this.compareHits(object);
    if (object.sunk === true) {
      this.lastHit = 0;
      return false;
    } else if (hits) {
      // calculate the next move here
      nextMove = this.estimateNextMove(hits, board);
      if (nextMove) return nextMove;
      else {
        if (hits.firstHit.x < hits.lastHit.x) {
          nextMove = { x: hits.firstHit.x - 1, y: hits.firstHit.y };
        } else if (hits.firstHit.x > hits.lastHit.x) {
          nextMove = { x: hits.firstHit.x + 1, y: hits.firstHit.y };
        } else if (hits.firstHit.y < hits.lastHit.y) {
          nextMove = { x: hits.firstHit.x, y: hits.firstHit.y - 1 };
        } else if (hits.firstHit.x > hits.lastHit.x) {
          nextMove = { x: hits.firstHit.x, y: hits.firstHit.y + 1 };
        }
        if (this.isValidMove(nextMove, board)) return nextMove;
      }
    }
    // if estimateNextMove is null
    for (let i = 0; i < moves.length; i++) {
      // calculate next move coords
      let nextX = x + Number(moves[i][0]);
      let nextY = y + Number(moves[i][1]);
      nextMove = { x: nextX, y: nextY };
      // check if next move will hit a ship
      validMove = this.isValidMove(nextMove, board);
      if (validMove === true) {
        return nextMove;
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

  estimateNextMove(hits, board) {
    let nextMove;
    if (hits.previousHit.x != hits.lastHit.x) {
      nextMove = this.estimateNextXMove(hits, board);
    } else if (hits.previousHit.y != hits.lastHit.y) {
      nextMove = this.estimateNextYMove(hits, board);
    }
    return nextMove;
  }

  estimateNextXMove(hits, board) {
    let nextMove;
    let x;
    if (hits.previousHit.x < hits.lastHit.x) {
      // computer is moving right
      x = hits.lastHit.x + 1;
    } else {
      // computer is moving left
      x = hits.lastHit.x - 1;
    }
    nextMove = { x, y: hits.lastHit.y };
    if (this.isValidMove(nextMove, board)) {
      return nextMove;
    } else {
      // next move in the same direction
      x = x + (x - hits.lastHit.x);
      nextMove = { x, y: hits.lastHit.y };
      if (this.isValidMove(nextMove, board)) {
        return nextMove;
      } else {
        // next move in the opposite direction
        x = x - 2 * (x - hits.lastHit.x);
        nextMove = { x, y: hits.lastHit.y };
        if (this.isValidMove(nextMove, board)) {
          return nextMove;
        }
      }
      // no move is found, return null
      return null;
    }
  }

  estimateNextYMove(hits, board) {
    let nextMove;
    let y;
    if (hits.previousHit.y < hits.lastHit.y) {
      // computer is moving down
      y = hits.lastHit.y + 1;
    } else {
      // computer is moving up
      y = hits.lastHit.y - 1;
    }
    nextMove = { x: hits.lastHit.x, y };
    if (this.isValidMove(nextMove, board)) {
      return nextMove;
    } else {
      // next move in the same direction
      y = y + (y - hits.lastHit.y);
      nextMove = { x: hits.lastHit.x, y };
      if (this.isValidMove(nextMove, board)) {
        return nextMove;
      } else {
        // next move in the opposite direction
        y = y - 2 * (y - hits.lastHit.y);
        nextMove = { x: hits.lastHit.x, y };
        if (this.isValidMove(nextMove, board)) {
          return nextMove;
        }
      }
    }
    // if no move is found, return null
    return null;
  }

  compareHits(object) {
    const length = object.hits.length;
    if (length >= 2) {
      let firstHit = object.hits[0];
      firstHit = { x: firstHit[0], y: firstHit[1] };
      let previousHit = object.hits[length - 2];
      previousHit = { x: previousHit[0], y: previousHit[1] };
      const lastHit = this.lastHit;
      const hits = { firstHit, lastHit, previousHit };
      return hits;
    }
  }

  isValidMove(index, board) {
    if (index.x >= 0 && index.x < 10 && index.y >= 0 && index.y < 10) {
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
    } else return false;
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
