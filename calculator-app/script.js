class Display {
  constructor(displayHtmlElement) {
    this.displayHtmlElement = displayHtmlElement;
  }

  updateValueOnScreen(value) {
    this.displayHtmlElement.innerText = value;
  }

  //   getValueOnScreen() {
  //     return parseFloat(this.displayHtmlElement.innerText);
  //   }
}

class Calculator {
  constructor(displayHtmlElement) {
    this.leftHandSide = null;
    this.rightHandSide = null;
    this.operator = null;
    this.result = null;
    this.display = new Display(displayHtmlElement);
  }

  resetParameters() {
    this.leftHandSide = null;
    this.rightHandSide = null;
    this.operator = null;
    this.result = null;
  }

  addDigitToLeftHandSide(digit) {
    if (this.leftHandSide === null) {
      this.leftHandSide = "";
    }
    this.leftHandSide += digit;
  }

  addDigitToRightHandSide(digit) {
    if (this.rightHandSide === null) {
      this.rightHandSide = "";
    }
    this.rightHandSide += digit;
  }

  handleDigit(digit) {
    //!prevent typing 0 more than once (00000) -> 0
    // if (this.leftHandSide === null || this.operator === null) {
    if (this.operator === null) {
      this.addDigitToLeftHandSide(digit);
      this.display.updateValueOnScreen(this.leftHandSide);
    } else {
      this.addDigitToRightHandSide(digit);
      this.display.updateValueOnScreen(this.rightHandSide);
    }
  }

  handleBinaryOperation(operator) {
    if (this.operator !== null && this.operator !== operator) {
      //calculate the result when operator is changed (2+2*2) -> (4*2) -> 8

      this.leftHandSide = parseFloat(this.leftHandSide);
      this.rightHandSide = parseFloat(this.rightHandSide);

      this.calculate("binary");
      this.leftHandSide = this.result;
      this.display.updateValueOnScreen(this.leftHandSide);

      this.rightHandSide = null;

      this.operator = operator;

      return;
    }

    this.operator = operator; // "add", "subtract", "multiply", "divide"

    if (this.rightHandSide === null) {
      //this.setHiglight(operation.htmlElement);
      return;
    }

    this.leftHandSide = parseFloat(this.leftHandSide);
    this.rightHandSide = parseFloat(this.rightHandSide);

    this.calculate("binary");
    this.leftHandSide = this.result;
    this.display.updateValueOnScreen(this.leftHandSide);

    this.rightHandSide = null;
  }

  handleEqual() {
    if (!this.operator) {
      return;
    }

    if (!this.rightHandSide) {
      this.rightHandSide = this.leftHandSide; //! key difference
    }

    this.leftHandSide = parseFloat(this.leftHandSide);
    this.rightHandSide = parseFloat(this.rightHandSide);

    this.calculate("binary");
    this.leftHandSide = this.result;
    this.display.updateValueOnScreen(this.leftHandSide);
    // this.rightHandSide = null; //?
  }

  calculate(type) {
    if (type === "unary") {
      this.result = unaryOperations[this.operator](this.leftHandSide);
      return;
    }
    if (type === "binary") {
      this.result = binaryOperations[this.operator](
        this.leftHandSide,
        this.rightHandSide
      );
      return;
    }
  }

  //   setResult(result) {
  //     this.result = result;
  //     render result
  //   }

  handleUnaryOperation(operator) {
    if (this.rightHandSide !== null) {
      this.rightHandSide = parseFloat(this.rightHandSide);
      this.rightHandSide = unaryOperations[operator](this.rightHandSide); //? calculate("unary") but with rightHandSide
      this.display.updateValueOnScreen(this.rightHandSide);
      return;
    }

    this.operator = operator;

    this.calculate("unary");
    this.leftHandSide = this.result;
    this.display.updateValueOnScreen(this.leftHandSide);

    this.rightHandSide = null;
  }

  handleAllClear() {
    this.resetParameters();
    this.display.updateValueOnScreen(0);
  }

  handleDecimal() {
    if (this.leftHandSide !== null && this.rightHandSide === null) {
      this.leftHandSide += ".";
      this.display.updateValueOnScreen(this.leftHandSide);
      return;
    }

    if (this.leftHandSide !== null && this.rightHandSide !== null) {
      this.rightHandSide += ".";
      this.display.updateValueOnScreen(this.rightHandSide);
      return;
    }

    if (this.result !== null) {
      this.resetParameters();
      this.display.updateValueOnScreen("0.");
      return;
    }

    if (this.leftHandSide === null) {
      this.leftHandSide = "0.";
      this.display.updateValueOnScreen(this.leftHandSide);
      return;
    }
    if (
      (this.leftHandSide !== null && this.leftHandSide.includes(".")) ||
      (this.rightHandSide !== null && this.rightHandSide.includes("."))
    ) {
      return;
    }
  }
}

const binaryOperations = {
  add: (lhs, rhs) => lhs + rhs,
  subtract: (lhs, rhs) => lhs - rhs,
  multiply: (lhs, rhs) => lhs * rhs,
  divide: (lhs, rhs) => lhs / rhs,
};

const unaryOperations = {
  negate: (lhs) => -lhs,
  percentage: (lhs) => lhs / 100,
  // square:  (lhs) => lhs * lhs,
  // cube:    (lhs) => lhs * lhs * lhs,
  // squareRoot: (lhs) => Math.sqrt(lhs),
  // cubeRoot: (lhs) => Math.cbrt(lhs),
  // inverse: (lhs) => 1 / lhs,
};

const getKeyType = (key) => {
  const type = key.dataset.type;
  if (!type) return;
  return type;
};

const getKeyAction = (key) => {
  const action = key.dataset.action;
  if (!action) return;
  return action;
};

const digitButtons = document.querySelectorAll("[data-type='digit']");
const binaryOperationButtons = document.querySelectorAll(
  "[data-type='binary']"
);
const unaryOperationButtons = document.querySelectorAll("[data-type='unary']");
const equalButton = document.querySelector("[data-action='equals']");
const allClearButton = document.querySelector("[data-type='clear']");
const decimalButton = document.querySelector("[data-type='decimal']");
const display = document.querySelector(".display-content");

const calculator = new Calculator(display);

digitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const digit = button.innerText;
    calculator.handleDigit(digit);
    console.debug(JSON.stringify(calculator));
  });
});

binaryOperationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const operator = getKeyAction(button);
    calculator.handleBinaryOperation(operator);
    console.debug(JSON.stringify(calculator));
  });
});

allClearButton.addEventListener("click", () => {
  calculator.handleAllClear();
  console.debug(JSON.stringify(calculator));
});

equalButton.addEventListener("click", () => {
  calculator.handleEqual();
  console.debug(JSON.stringify(calculator));
});

unaryOperationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const operator = getKeyAction(button);
    calculator.handleUnaryOperation(operator);
    console.log(JSON.stringify(calculator));
  });
});

decimalButton.addEventListener("click", () => {
  calculator.handleDecimal();
  console.debug(JSON.stringify(calculator));
});
