const Ship = require("../src/ship.js");

require("../src/ship.js");

test("Ship object", () => {
  const ship = new Ship(3);
  expect(ship).toEqual({ length: 3, hits: [], sunk: false, index: [] });
});

test("Ship length", () => {
  const ship = new Ship(5);
  expect(ship.length).toBe(5);
});

test("Ship hit 1", () => {
  const ship = new Ship(5);
  expect(ship.hit(2)).toStrictEqual((ship.hits = [2]));
});

//skipped
test.skip("Ship hit 2", () => {
  const ship = new Ship(5);
  ship.hit(2);
  expect(ship.hit(2)).toStrictEqual((ship.hits = [2]));
});

test("Is sunk = false", () => {
  const ship = new Ship(5);
  expect(ship.sunk).toBe(false);
});

test("Is sunk = true", () => {
  const ship = new Ship(2);
  ship.hit(1);
  ship.hit(2);
  expect(ship.sunk).toBe(true);
});
