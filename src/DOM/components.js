import Header from "./header";
import Boards from "./boards";
import Footer from "./footer";
import Form from "./form";

class Components {
  constructor(body) {
    this.body = body;
    this.background = this._background(body);
    this.header = new Header(this.background, this);
    this.boards = new Boards(this.background, this);
    this.form = new Form(this.background, this);
    this.footer = new Footer(this.background);
    this.game;
    this.axis;
    this.play;
  }

  _background(body) {
    // Create the game wrapper element
    const background = document.createElement("div");
    background.classList.add("wrapper");
    body.append(background);
    return background;
  }

  _axisButton(boards = this.boards) {
    const btn = document.createElement("button");
    btn.textContent = "Axis: X";
    btn.classList.add("btn");
    btn.addEventListener("click", (e) => this.#axisBtn(e, btn));
    boards.container.append(btn);
    this.axis = btn;
    return btn;
  }

  _findSquares(index, length, axis) {
    const squares = [];
    for (let i = 0; i < length; i++) {
      if (axis == "X") {
        const x = Number(index.x) + i;
        const square = document.querySelector(`.x${x}y${index.y}`);
        if (square) {
          squares.push(square);
        } else return false;
      } else if (axis == "Y") {
        const y = Number(index.y) + i;
        const square = document.querySelector(`.x${index.x}y${y}`);
        if (square) {
          squares.push(square);
        } else return false;
      }
    }
    return squares;
  }

  _retrieveAxis() {
    const btn = this.axis;
    let axis = btn.textContent[6];
    return axis;
  }

  _retrieveLength(game = this.game) {
    const ship = game.player1.ships[0];
    return ship.length;
  }

  _index(string) {
    string = { x: string[1], y: string[3] };
    return string;
  }

  // Listeners

  #axisBtn(e, btn) {
    const text = btn.textContent;
    if (text == "Axis: X") {
      btn.textContent = "Axis: Y";
    } else {
      btn.textContent = "Axis: X";
    }
  }
}

export default Components;
