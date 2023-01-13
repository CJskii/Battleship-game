class Header {
  constructor(background, components) {
    this.header = this._header(background);
    this.components = components;
  }
  _header(background) {
    // Create the title element
    const header = document.createElement("h1");
    header.textContent = "Battleship";
    header.classList.add("game-title");
    background.append(header);
    return header;
  }

  _render(player, components = this.components) {
    const header = document.createElement("h6");
    const text = `Captain ${player.name},<br> please place your ships`;
    header.classList.add("captain-header");
    //this._animate(header, text);
    header.innerHTML = `Captain ${player.name},<br> please place your ships`;
    components.boards.container.append(header);
    return header;
  }

  _animate(header, text) {
    //const text = "Make a move captain...";
    let index = 0;
    const delay = 100;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        header.innerHTML += text[index];
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);
  }
}

export default Header;
