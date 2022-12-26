class Ship {
  constructor(length) {
    this.length = length;
    this.hits = [];
    this.sunk = this._isSunk();
    this.index = [];
  }

  _isSunk(length = this.length, hits = this.hits) {
    if (length === hits.length) return true;
    else return false;
  }

  hit(index) {
    this.hits.push(index);
    this.sunk = this._isSunk();
    return this.hits;
  }
}

module.exports = Ship;
