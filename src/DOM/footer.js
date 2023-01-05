class Footer {
  constructor(background) {
    this.footer = this._footer(background);
  }
  _footer(background = this.background) {
    // Create footer element
    const footer = document.createElement("div");
    const paragraph = document.createElement("p");
    const anchor = document.createElement("a");
    footer.classList.add("footer");
    paragraph.textContent = "Created by ";
    anchor.textContent = "CJski";
    anchor.target = "_blank";
    anchor.href = "https://github.com/CJskii/Battleship-game";
    paragraph.append(anchor);
    footer.append(paragraph);
    background.append(footer);
    return footer;
  }
}

export default Footer;
