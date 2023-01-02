import "./styles/style.css";
import Components from "./DOM/components.js";
import Player from "./player";

(function () {
  const body = document.body;
  const game = new Components(body);
})();

function gameController(name) {
  const player = new Player(name);
  const board = player.board.board;
  console.log("I can start the game now");
}

export default gameController;
