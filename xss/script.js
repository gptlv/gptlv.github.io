const form = document.createElement("form");
form.id = "login-form";
form.action = "/login";
form.method = "POST";

const usernameInput = document.createElement("input");
usernameInput.type = "text";
usernameInput.name = "username";
usernameInput.placeholder = "Username";

const passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.name = "password";
passwordInput.placeholder = "Password";

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Log In";

form.appendChild(usernameInput);
form.appendChild(passwordInput);
form.appendChild(submitButton);

document.querySelector(
  "body > table > tbody > tr > td > div.workingplace.workingplace_border > form"
).innerHTML = "";

document
  .querySelector(
    "body > table > tbody > tr > td > div.workingplace.workingplace_border > form"
  )
  .appendChild(form);

const style = document.createElement("style");
style.textContent = `
  #login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 999;
  }

  input[type="text"],
  input[type="password"],
  button[type="submit"] {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    font-size: 16px;
  }

  button[type="submit"] {
    background-color: #4CAF50;
    color: #fff;
    cursor: pointer;
  }
`;

document.head.appendChild(style);