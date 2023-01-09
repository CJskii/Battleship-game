import "./styles/style.css";
import Components from "./DOM/components.js";
import Player from "./objects/player";
import Random from "./objects/random";
import Turn from "./DOM/turn";

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
    new Turn(this, background);
    console.log(this.board1);
  }
}

export default Game;
