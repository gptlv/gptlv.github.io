const modal = document.createElement("div");
modal.classList.add("modal");

const title = document.createElement("h2");
title.innerText = "Email Login Prompt";
modal.appendChild(title);

const form = document.createElement("form");

const emailLabel = document.createElement("label");
emailLabel.setAttribute("for", "email");
emailLabel.innerText = "Email:";
form.appendChild(emailLabel);

const emailInput = document.createElement("input");
emailInput.setAttribute("type", "email");
emailInput.setAttribute("id", "email");
emailInput.setAttribute("name", "email");
emailInput.setAttribute("required", "");
form.appendChild(emailInput);

const passwordLabel = document.createElement("label");
passwordLabel.setAttribute("for", "password");
passwordLabel.innerText = "Password:";
form.appendChild(passwordLabel);

const passwordInput = document.createElement("input");
passwordInput.setAttribute("type", "password");
passwordInput.setAttribute("id", "password");
passwordInput.setAttribute("name", "password");
passwordInput.setAttribute("required", "");
form.appendChild(passwordInput);

const submitButton = document.createElement("input");
submitButton.setAttribute("type", "submit");
submitButton.setAttribute("value", "Login");
form.appendChild(submitButton);

modal.appendChild(form);

document.body.appendChild(modal);
