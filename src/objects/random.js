class Random {
  constructor(player) {
    this.player = player;
    this.init = this.init();
    this.nextHit = 0;
  }

  init(player = this.player) {
    const ship = player.ships.shift();
    const axis = this.randomAxis();
    if (!ship) return console.log("Computer ships placed");
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

  adjacentMove(lastHit, board) {
    console.log(lastHit);
    let moves = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const x = Number(lastHit.x);
    const y = Number(lastHit.y);

    for (let i = 0; i < moves.length; i++) {
      // check if move is valid
      let nextX = x + Number(moves[i][0]);
      let nextY = y + Number(moves[i][1]);
      let nextMove = { x: nextX, y: nextY };
      console.log(nextMove);

      // check if next move will hit a ship
      let validMove = this.isValidMove(nextMove, board);
      if (validMove === true) {
        // HARD MODE - might need to edit it
        let checkBoard = board[nextMove.x][nextMove.y];
        if (typeof checkBoard === "object") {
          return (this.nextHit = nextMove);
        }
      }
    }
  }

  isValidMove(index, board) {
    const move = board[index.x][index.y];
    const arr = [];
    if (move == "0") return true;
    if (move == "x") return false;
    else if (typeof move === "object") {
      move.hits.forEach((hit) => {
        if (hit[0] == index.x && hit[1] == index.y) {
          arr.push(false);
        }
        // look at board missed array and filter for index coords
      });
      if (arr.length == 0) {
        return true;
      }
    }
  }
}

export default Random;
