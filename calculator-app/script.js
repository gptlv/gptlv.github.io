class Calculator {
  constructor() {
    this.currentValue = 0;
    this.previousValue = 0;
    this.result = 0;
    this.operator = "";
    this.isWaitingForNextValue = false;
    this.isResultCalculated = false;
    this.isOperatorButtonPressed = false;
  }

  calculate() {
    let result = 0;
    switch (this.operator) {
      case "add": {
        result = this.currentValue + this.previousValue;
        break;
      }
      case "subtract": {
        result = this.currentValue - this.previousValue;
        break;
      }
      case "multiply": {
        result = this.currentValue * this.previousValue;
        break;
      }
      case "divide": {
        result = this.currentValue / this.previousValue;
        break;
      }
      //   default: {
      //     return this.value;
      //   }
    }
    this.result = result;
    this.isResultCalculated = true;
  }
  resetStates() {
    this.currentValue = 0;
    this.previousValue = 0;
    this.result = 0;
    this.operator = "";
    this.isWaitingForNextValue = false;
    this.isResultCalculated = false;
    this.isOperatorButtonPressed = false;
  }
}

const calculator = new Calculator();

const display = document.querySelector(".display");
const displayContent = document.querySelector(".display-content");

function showNumberOnDisplay() {
  displayContent.textContent = calculator.result;
}

function handleDigitButtonClick(event) {
  const digit = event.target.textContent;
  if (calculator.isResultCalculated) {
    calculator.resetStates();
    displayContent.textContent = "";
  }
  if (calculator.isOperatorButtonPressed) {
    displayContent.textContent = "";
    calculator.isOperatorButtonPressed = false;
  }
  if (digit === "0" && displayContent.textContent === "0") {
    return;
  }
  if (digit !== "0" && displayContent.textContent === "0") {
    displayContent.textContent = digit;
    return;
  }
  displayContent.textContent += digit;
}

// function handleAllClearButtonClick() {
//   displayContent.textContent = "";
//   calculator.operator = "";
// }

const digitButtons = document.querySelectorAll(".digit");

digitButtons.forEach((digitButton) => {
  digitButton.addEventListener("click", handleDigitButtonClick);
});

// const allClearButton = document.querySelector("#clear");
// allClearButton.addEventListener("click", handleAllClearButtonClick);

function handleDecimalButtonClick() {
  if (displayContent.textContent.includes(".")) return;
  if (displayContent.textContent === "") {
    displayContent.textContent = "0.";
    return;
  }
  displayContent.textContent += ".";
}

const decimalButton = document.querySelector(".decimal");
decimalButton.addEventListener("click", handleDecimalButtonClick);

function handleOperatorButtonClick(event) {
  const operator = event.currentTarget.id;
  const currentValue = parseFloat(displayContent.textContent);
  if (isNaN(currentValue)) return;
  console.log(operator);
  switch (operator) {
    case "clear": {
      calculator.resetStates();
      showNumberOnDisplay();
      break;
    }
    case "positive-negative": {
      calculator.result = currentValue * -1;
      showNumberOnDisplay();
      break;
    }
    case "percent": {
      calculator.result = currentValue / 100;
      showNumberOnDisplay();
      break;
    }
    case "add": {
      calculator.currentValue = currentValue;
      calculator.operator = "add";
      calculator.isWaitingForNextValue = true;
      break;
    }
    case "subtract": {
      calculator.currentValue = currentValue;
      calculator.operator = "subtract";
      calculator.isWaitingForNextValue = true;
      break;
    }
    case "multiply": {
      calculator.currentValue = currentValue;
      calculator.operator = "multiply";
      calculator.isWaitingForNextValue = true;
      break;
    }
    case "divide": {
      calculator.currentValue = currentValue;
      calculator.operator = "divide";
      calculator.isWaitingForNextValue = true;
      break;
    }

    case "equals": {
      if (calculator.isWaitingForNextValue) {
        calculator.previousValue = currentValue;
      } else {
        calculator.currentValue = calculator.result;
      }
      calculator.isWaitingForNextValue = false;
      calculator.calculate();
      showNumberOnDisplay();
      break;
    }
  }
  calculator.isOperatorButtonPressed = true;
  console.log(
    calculator.currentValue,
    calculator.previousValue,
    calculator.result,
    calculator.isWaitingForNextValue
  );
}

const operatorButtons = document.querySelectorAll(".operator.portrait");
operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", handleOperatorButtonClick);
});
