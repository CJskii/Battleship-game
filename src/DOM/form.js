import Game from "../index";

class Form {
  constructor(background, components) {
    this.components = components;
    this.form = this._nameForm(background);
  }

  _nameForm(background = this.background) {
    // Create form + label + input + submit elements
    const form = document.createElement("form");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const submit = document.createElement("button");
    const text = "Enter player name:";
    input.id = "name";
    input.placeholder = "Captain name...";
    label.setAttribute("for", input);
    this.components._animate(label, text);
    submit.textContent = "Submit";
    submit.classList.add("btn");
    submit.addEventListener("click", (e) => this.#submitBtn(e, input));
    form.append(label);
    form.append(input);
    form.append(submit);
    background.append(form);
    return form;
  }

  #submitBtn(e, input, form = this.form, components = this.components) {
    if (input.value == "") {
      input.placeholder = "You must enter name";
      e.preventDefault();
    } else {
      // call to index.js
      e.preventDefault();
      components.game = new Game(input.value, this.components);
      form.remove();
      components.boards.container.style.display = "";
    }
    return input.value;
  }
}

export default Form;
