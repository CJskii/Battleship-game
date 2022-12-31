import Player from "../src/player";
import Ship from "../src/ship";

test("Player name", () => {
  const player = new Player("human");
  expect(player.name).toBe("human");
});

test("Player move", () => {
  const player = new Player("human");
  const ship = new Ship(2);
  player.board.placeShip(ship, 1, 1);
  player.move(1, 1);
  expect(ship.hits).toEqual([[1, 1]]);
});

test("Player move miss", () => {
  const player = new Player("human");
  const ship = new Ship(2);
  player.board.placeShip(ship, 1, 1);
  player.move(5, 5);
  expect(player.board.missed).toEqual([[5, 5]]);
});
