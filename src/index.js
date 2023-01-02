import "./styles/style.css";
import Components from "./DOM/components.js";
import Player from "./player";

(function () {
  const body = document.body;
  const game = new Components(body);
})();

function gameController(name, components) {
  const player = new Player(name);
  const playerBoard = player.board.board;
  components.playerHeader$(components.boards, player.name);
  // button for X/Y axis
  components.renderBoard$(playerBoard, components.boards);
  console.log("I can start the game now");
}

export default gameController;
