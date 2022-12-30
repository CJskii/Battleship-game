class Ship {
  constructor(length) {
    this.length = length;
    this.hits = [];
    this.sunk = this._isSunk();
    this.index = [];
    // axis from DOM
  }

  _isSunk(length = this.length, hits = this.hits) {
    if (length === hits.length) return true;
    else return false;
  }

  hit(index) {
    const arrLookup = this.hits.filter((coords) => {
      return coords[0] == index[0] && coords[1] == index[1];
    });
    if (arrLookup.length == 0) {
      this.hits.push(index);
    }
    this.sunk = this._isSunk();
    return this.hits;
  }
}

module.exports = Ship;
