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

  turn(board, index, game = this.components.play, computer = this.computer) {
    if (board === "Player") {
      console.log("Do computer stuff");
      this.computerTurn(board, index, game, computer);
      const allShipsSunk = this.board1._areShipsSunk();
      if (allShipsSunk === true) {
        this.printWinner(board);
      }
    } else if (board === "Computer") {
      console.log("Do player stuff");
      const hit = this.player2.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      const allShipsSunk = this.board2._areShipsSunk();
      if (allShipsSunk === true) {
        this.printWinner(board);
      } else {
        this.turn("Player", index);
      }
    }
  }

  computerTurn(board, index, game, computer) {
    let lastHit = computer.lastHit;
    index = computer.randomCoords();
    let validMove = computer.isValidMove(index, this.board1);
    if (lastHit != 0) {
      // Hit adjacent square
      const nextMove = computer.adjacentMoves(lastHit, this.board1);
      if (nextMove != false) {
        // if next adjacent move is valid
        this.computerHit(nextMove, board, game, computer);
      } else {
        // if there's no valid adjacent moves call itself
        this.computerTurn(board, index, game, computer);
      }
    } else if (validMove === true) {
      // Hit random coords
      this.computerHit(index, board, game, computer);
      console.log("Hit in random coords");
    } else {
      // Call itself to generate new random coords
      this.computerTurn(board, index, game, computer);
      console.log("Generating new random coords");
    }
  }

  computerHit(index, board, game, computer) {
    let hit = this.player1.move(index.x, index.y);
    game._hitORmiss(index, hit, board);
    if (hit == "hit") {
      computer.lastHit = index;
    }
  }

  printWinner(string, game = this.components.play) {
    game.header.textContent = this.evaluateWinner(string);
  }

  evaluateWinner(string) {
    if (string == "Player") {
      return "You have lost, try again!";
    } else {
      return `${this.player1.name} has won!`;
    }
  }
}

export default Game;
