class Components {
  constructor(body) {
    this.body = body;
    this.background = this._background(body);
    this.header = this._header(this.background);
    this.button = this._button(this.background);
    this.boards = this._boards(this.background);
  }

  _background(body) {
    // Create the game wrapper element
    const background = document.createElement("div");
    background.classList.add("wrapper");
    body.append(background);
    return background;
  }

  _header(background) {
    // Create the title element
    const header = document.createElement("h1");
    header.textContent = "Battleship Game";
    header.classList.add("game-title");
    background.append(header);
    return header;
  }

  _button(background) {
    // Create the button element
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.textContent = "New Game";
    background.append(btn);
  }

  _boards(background) {
    // Create boards wrapper element
    const container = document.createElement("div");
    container.classList.add("boards-container");
    background.append(container);
  }
}

export default Components;
