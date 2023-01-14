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
      // logic for computer
      this.computerTurn(board, index, game, computer);
      const allShipsSunk = this.board1._areShipsSunk();
      if (allShipsSunk === true) {
        // print winner and stop the game
        this.printWinner(board);
        game.stopGame();
      }
    } else if (board === "Computer") {
      // logic for player
      const hit = this.player2.move(index.x, index.y);
      game._hitORmiss(index, hit, board);
      const allShipsSunk = this.board2._areShipsSunk();
      if (allShipsSunk === true) {
        // print winner and stop the game
        this.printWinner(board);
        game.stopGame();
      } else {
        // if all ships are not sunk - computer will make random move
        this.turn("Player", index);
      }
    }
    this.updateShipCount();
  }

  computerTurn(board, index, game, computer) {
    // get random index and check if it is valid
    let lastHit = computer.lastHit;
    index = computer.randomCoords();
    let validMove = computer.isValidMove(index, this.board1);
    // if last hit wasn't miss - attempt to hit adjacent squares
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
    } else {
      // if index is invalid call itself to generate new random coords
      this.computerTurn(board, index, game, computer);
    }
  }

  computerHit(index, board, game, computer) {
    // called when computer makes hit
    let hit = this.player1.move(index.x, index.y);
    game._hitORmiss(index, hit, board);
    if (hit == "hit") {
      computer.lastHit = index;
    }
  }

  updateShipCount() {
    const player1 = document.querySelector(".player-ships");
    const player2 = document.querySelector(".computer-ships");
    player1.textContent = `Ships left: ${this.checkShips(this.board1)}`;
    player2.textContent = `Ships left: ${this.checkShips(this.board2)}`;
  }

  checkShips(board) {
    const ships = board.ships;
    const arr = ships.filter((ship) => {
      return ship.sunk === false;
    });
    return arr.length;
  }

  printWinner(string, game = this.components.play) {
    const text = this.evaluateWinner(string);
    game.header.textContent = "";
    this.components._animate(game.header, text);
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
