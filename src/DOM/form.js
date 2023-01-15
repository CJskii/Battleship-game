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
    input.addEventListener("keydown", (e) => this.#inputValidation(e, input));
    label.setAttribute("for", input);
    this.components._animate(label, text);
    submit.textContent = "Submit";
    submit.classList.add("btn");
    submit.addEventListener("click", (e) => this.#submitBtn(e, input));
    form.append(label);
    form.append(input);
    form.append(submit);
    background.append(form);
    input.setAttribute("autocomplete", "off");
    input.focus();
    return form;
  }

  #inputValidation(e, input) {
    const key = e.keyCode;
    if (key === 13) {
      this.#submitBtn(e, input);
    }
    // only letters, backspace, and delete
    if (
      key === 8 ||
      key === 46 ||
      (key >= 65 && key <= 90) ||
      (key >= 97 && key <= 122)
    ) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }

  #submitBtn(e, input, form = this.form, components = this.components) {
    if (input.value == "") {
      input.placeholder = "You must enter name";
      e.preventDefault();
    } else if (input.value.length >= 12) {
      input.value = "";
      input.placeholder = "Too long - 12 characters allowed";
      e.preventDefault();
    } else {
      // call to index.js
      e.preventDefault();
      let name = input.value;
      name = name.charAt(0).toUpperCase() + name.substring(1);
      components.game = new Game(name, this.components);
      form.remove();
      components.boards.container.style.display = "";
    }
    return input.value;
  }
}

export default Form;
