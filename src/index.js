class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = this.isSunk();
  }

  isSunk(length = this.length, hits = this.hits) {
    if (length == hits) return true;
    else if (length > hits) return false;
  }

  hit() {}
}

const ship = new Ship(5);

console.log(ship);
