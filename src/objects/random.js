class Random {
  constructor(player) {
    this.player = player;
  }

  init(player = this.player) {
    const ship = player.ships.shift();
    const axis = this.randomAxis();

    console.log(ship);
    if (!ship) return console.log("All ships placed");
    this.placeShipRandom(ship, axis);
    //console.log({ ship, index, axis, valid });
  }

  placeShipRandom(ship, axis) {
    const index = this.randomCoords();
    const isValidMove = this.isValidMove(ship, axis, index);

    if (isValidMove === false) {
      console.log(isValidMove);
      this.placeShipRandom(ship, axis);
    } else {
      console.log({ isValidMove, index, axis, ship });
      // place ships here
      this.player.board.placeShip(ship, x, y, axis);
      this.init();
    }
  }

  isValidMove(ship, axis, index, player = this.player) {
    const length = ship.length;
    const board = player.board.board;
    let arr = [];

    for (let i = 0; i < length; i++) {
      console.log(index);
      if (axis == "X") {
        const square = board[Number(index.x) + i][Number(index.y)];
        if (square != 0) {
          arr.push(false);
        }
      } else if (axis == "Y") {
        const square = board[Number(index.x)][Number(index.y) + i];
        if (square != 0) {
          arr.push(false);
        }
      }
    }

    if (arr.length == 0) return true;
    else return false;
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
}

export default Random;
