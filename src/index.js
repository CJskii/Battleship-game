import "./styles/style.css";
import Components from "./DOM/components.js";
import Player from "./objects/player";
import Random from "./objects/random";
import Turn from "./DOM/game";

(function () {
  const body = document.body;
  const game = new Components(body);
})();

class Game {
  constructor(player1, components) {
    this.player1 = new Player(player1);
    this.player2 = new Player("Computer");
    this.board1 = this.player1.board;
    this.board2 = this.player2.board;
    this.computer = new Random(this.player2);
    this.components = components;
    this.loaded = this._init();
  }

  _init(components = this.components) {
    components.header._render(this.player1);
    components._axisButton();
    components.boards._render(this.player1);
  }

  start(background = this.components.boards) {
    console.log({
      Player1: this.player1,
      Player2: this.player2,
      components: this.components,
    });
    this.components.play = new Turn(this, background);
  }

  turn(board, index, game = this.components.play) {
    if (board === "Player") {
      console.log("Do computer stuff");
      const hit = this.player1.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      const allShipsSunk = this.board1._areShipsSunk();
      console.log(this.player1);
      if (allShipsSunk === true) {
        // print winner
        // you lost
        console.log("You lost");
      }
    } else if (board === "Computer") {
      console.log("Do player stuff");
      const hit = this.player2.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      const allShipsSunk = this.board2._areShipsSunk();
      console.log(this.board2);
      if (allShipsSunk === true) {
        // print winner
        // player
        console.log("Player has won");
      }
    }
    // check for the winner
  }
}

export default Game;
