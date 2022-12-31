import Gameboard from "../src/gameboard.js";
import Ship from "../src/ship.js";

test("Board  X", () => {
  const board = new Gameboard();
  expect(board.board.length).toBe(10);
});

test("Board  Y", () => {
  const board = new Gameboard();
  for (let i = 0; i < board.board.length; i++) {
    expect(board.board[i].length).toBe(10);
  }
});

test("Place ship 1", () => {
  const ship = new Ship(1);
  const board = new Gameboard();
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
  const board = new Gameboard();
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
  const board = new Gameboard();
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
  const board = new Gameboard();
  board.placeShip(ship, 5, 5);
  expect(board.board[5][5]).toEqual(0);
});

test("Receive attack 1", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  expect(ship.hits).toEqual([[2, 2]]);
});

test("Receive attack 2", () => {
  const ship = new Ship(4);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  board.receiveAttack(3, 2);
  board.receiveAttack(4, 2);
  board.receiveAttack(5, 2);
  expect(ship.hits).toEqual([
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
  ]);
});

test("Receive attack 3", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  board.receiveAttack(2, 2);
  expect(ship.hits).toEqual([[2, 2]]);
});

test("Is sunk?", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  board.receiveAttack(3, 2);
  expect(ship.sunk).toBe(true);
});

test("Missed attack 1", () => {
  const board = new Gameboard();
  board.receiveAttack(2, 2);
  expect(board.missed).toEqual([[2, 2]]);
});

test("Missed attack 2", () => {
  const board = new Gameboard();
  board.receiveAttack(2, 2);
  board.receiveAttack(2, 2);
  expect(board.missed).toEqual([[2, 2]]);
});

test("Missed attack 3", () => {
  const board = new Gameboard();
  const ship = new Ship(2);
  board.placeShip(ship, 2, 2);
  board.receiveAttack(3, 3);
  expect(board._isMissedAttack(3, 3)).toBe(true);
});

test("All ships sunk? 1", () => {
  const ship = new Ship(2);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.receiveAttack(2, 2);
  board.receiveAttack(3, 2);
  expect(board._areShipsSunk()).toBe(true);
});

test("All ships sunk? 1", () => {
  const ship = new Ship(2);
  const ship2 = new Ship(4);
  const board = new Gameboard();
  board.placeShip(ship, 2, 2);
  board.placeShip(ship2, 2, 4);
  board.receiveAttack(2, 2);
  board.receiveAttack(3, 2);
  expect(board._areShipsSunk()).toBe(false);
});
