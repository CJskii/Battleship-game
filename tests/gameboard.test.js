const Gameboard = require("../src/gameboard.js");
const Ship = require("../src/ship.js");
require("../src/ship.js");

require("../src/gameboard.js");

test("Board size X", () => {
  const size = 8;
  const board = new Gameboard(size);
  expect(board.board.length).toBe(size);
});

test("Board size Y", () => {
  const size = 8;
  const board = new Gameboard(size);
  for (let i = 0; i < board.board.length; i++) {
    expect(board.board[i].length).toBe(size);
  }
});

test("Place ship 1", () => {
  const ship = new Ship(1);
  const size = 8;
  const board = new Gameboard(size);
  board.placeShip(ship, 2, 2);
  expect(board.board[2][2]).toEqual({
    hits: [],
    length: 1,
    sunk: false,
    index: [[2, 2]],
  });
});

test("Place ship 2", () => {
  const ship = new Ship(2);
  const size = 8;
  const board = new Gameboard(size);
  board.placeShip(ship, 1, 1);
  expect(board.board[1][1]).toEqual({
    hits: [],
    length: 2,
    sunk: false,
    index: [
      [1, 1],
      [2, 1],
    ],
  });
});

test("Place ship 3", () => {
  const ship = new Ship(4);
  const size = 8;
  const board = new Gameboard(size);
  board.placeShip(ship, 3, 3);
  expect(board.board[3][3]).toEqual({
    hits: [],
    length: 4,
    sunk: false,
    index: [
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
  });
});

test("Place ship exceeding board", () => {
  const ship = new Ship(5);
  const size = 8;
  const board = new Gameboard(size);
  board.placeShip(ship, 5, 5);
  expect(board.board[5][5]).toEqual(0);
});

test("Receive attack 1", () => {
  const ship = new Ship(2);
  const size = 8;
  const board = new Gameboard(size);
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  expect(ship.hits).toEqual([[2, 2]]);
});
