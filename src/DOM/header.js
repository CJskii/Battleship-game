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
    header.classList.add("captain-header");
    header.textContent = `Captain ${player.name}, please place your ships`;
    components.boards.container.append(header);
    return header;
  }
}

export default Header;
