import "./styles/style.css";
import Components from "./DOM/components.js";
import Player from "./objects/player";

(function () {
  const body = document.body;
  const game = new Components(body);
})();

class Game {
  constructor(player1, components) {
    this.player1 = new Player(player1);
    this.player2 = new Player("Computer");
    this.components = components;
    this.loaded = this._init();
  }

  _init(components = this.components) {
    console.log({
      Player1: this.player1,
      Player2: this.player2,
      components: this.components,
    });
    components.header._render(this.player1);
    components._axisButton();
    components.boards._render(this.player1);
  }

  start(player1 = this.player1, player2 = this.player2) {
    console.log({
      Player1: this.player1,
      Player2: this.player2,
      components: this.components,
    });
    player1.init();
    player2.init(player2);
  }
}

export default Game;
