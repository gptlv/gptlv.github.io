const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const BODY_RADIUS = 5;
const FOOD_RADIUS = 5;
const DEFAULT_DIRECTION = { up: false, right: false, down: false, left: false };
const SNAKE_HEAD_INDEX = 0;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const STARTING_POINT_X = CANVAS_WIDTH / 2 - BODY_RADIUS;
const STARTING_POINT_Y = CANVAS_HEIGHT / 2 - BODY_RADIUS;
const SNAKE_COLOR = "#809C13";
const FOOD_COLOR = "#FF0000";
const MIN_X_COORDINATE = CANVAS_WIDTH * 0.1;
const MAX_X_COORDINATE = CANVAS_WIDTH * 0.9;
const MIN_Y_COORDINATE = CANVAS_HEIGHT * 0.1;
const MAX_Y_COORDINATE = CANVAS_HEIGHT * 0.9;

function disableBrowserScroll() {
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          e.code
        ) > -1
      ) {
        e.preventDefault();
      }
    },
    false
  );
}

function removeDuplicates(array) {
  return [...new Set(array)];
}

const resetKeyValuesToFalse = (obj) => {
  Object.keys(obj).forEach((v) => (obj[v] = false));
};

function handleArrowKeys(e) {
  resetKeyValuesToFalse(arrowKeys);
  if (e.key === "Right" || e.key === "ArrowRight") {
    arrowKeys.rightPressed = e.type === "keydown";
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    arrowKeys.leftPressed = e.type === "keydown";
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    arrowKeys.upPressed = e.type === "keydown";
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    arrowKeys.downPressed = e.type === "keydown";
  }
}

class Food {
  constructor() {
    this.positionX = 0;
    this.positionY = 0;
  }

  generateNewCoordinates(bodyParts) {
    while (true) {
      let newPositionX = Math.round(
        Math.random() * (MAX_X_COORDINATE - MIN_X_COORDINATE + 1) +
          MIN_X_COORDINATE -
          0.5
      );
      let newPositionY = Math.round(
        Math.random() * (MAX_Y_COORDINATE - MIN_Y_COORDINATE + 1) +
          MIN_Y_COORDINATE -
          0.5
      );
      if (
        bodyParts.every(
          (bodyPart) =>
            Math.abs(bodyPart.positionX - newPositionX) >
              BODY_RADIUS + FOOD_RADIUS &&
            Math.abs(bodyPart.positionY - newPositionY) >
              BODY_RADIUS + FOOD_RADIUS
        )
      ) {
        this.positionX = newPositionX;
        this.positionY = newPositionY;
        break;
      }
    }
  }

  isFoodEaten(snakeHead) {
    if (
      Math.abs(this.positionX - snakeHead.positionX) <
        BODY_RADIUS + FOOD_RADIUS &&
      Math.abs(this.positionY - snakeHead.positionY) < BODY_RADIUS + FOOD_RADIUS
    ) {
      return true;
    }
    return false;
  }

  drawFood() {
    ctx.beginPath();
    ctx.arc(this.positionX, this.positionY, FOOD_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = FOOD_COLOR;
    ctx.fill();
    ctx.closePath();
  }
}
class bodyPart {
  constructor(
    bodyPartPositionX,
    bodyPartPositionY,
    horizontalSpeed,
    verticalSpeed,
    currentDirection
  ) {
    this.positionX = bodyPartPositionX;
    this.positionY = bodyPartPositionY;
    this.horizontalSpeed = horizontalSpeed;
    this.verticalSpeed = verticalSpeed;
    this.direction = { ...currentDirection };
    this.turns = [];
  }
}

class Snake {
  constructor(snakeHeadPositionX, snakeHeadPositionY) {
    this.bodyParts = [
      new bodyPart(snakeHeadPositionX, snakeHeadPositionY, 0, 0, {
        ...DEFAULT_DIRECTION,
      }),
    ];
  }

  #setMovementDirection(index, directionName) {
    this.bodyParts[index].direction = { ...DEFAULT_DIRECTION };
    this.bodyParts[index].direction[directionName] = true;
  }

  #addTurnPosition(directionName) {
    if (this.bodyParts.length > 1) {
      let currentDirection = { ...DEFAULT_DIRECTION };
      currentDirection[directionName] = true;
      for (let i = 1; i < this.bodyParts.length; i++) {
        this.bodyParts[i].turns.push({
          positionX: this.bodyParts[SNAKE_HEAD_INDEX].positionX,
          positionY: this.bodyParts[SNAKE_HEAD_INDEX].positionY,
          direction: currentDirection,
        });
      }
    }
  }

  changeSnakeDirection() {
    if (
      arrowKeys.upPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.up
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed += 2 * BODY_RADIUS;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = -Math.abs(
        this.bodyParts[0].verticalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "up");
      this.#addTurnPosition("up");
    } else if (
      arrowKeys.rightPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.right
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed += 2 * BODY_RADIUS;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = Math.abs(
        this.bodyParts[0].horizontalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "right");
      this.#addTurnPosition("right");
    } else if (
      arrowKeys.downPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.down
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed += 2 * BODY_RADIUS;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = Math.abs(
        this.bodyParts[0].verticalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "down");
      this.#addTurnPosition("down");
    } else if (
      arrowKeys.leftPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.left
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed += 2 * BODY_RADIUS;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = -Math.abs(
        this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "left");
      this.#addTurnPosition("left");
    }
  }

  renderSnakeMovement() {
    this.bodyParts[SNAKE_HEAD_INDEX].positionX +=
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed;
    this.bodyParts[SNAKE_HEAD_INDEX].positionY +=
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed;
  }

  renderBodyMovement() {
    for (let i = 1; i < this.bodyParts.length; i++) {
      if (this.bodyParts[i].direction.up) {
        this.bodyParts[i].positionY += this.bodyParts[i].verticalSpeed;
      } else if (this.bodyParts[i].direction.right) {
        this.bodyParts[i].positionX += this.bodyParts[i].horizontalSpeed;
      } else if (this.bodyParts[i].direction.down) {
        this.bodyParts[i].positionY += this.bodyParts[i].verticalSpeed;
      } else if (this.bodyParts[i].direction.left) {
        this.bodyParts[i].positionX += this.bodyParts[i].horizontalSpeed;
      }
    }
  }

  addBodyPart() {
    let bodyPartPositionX = 0;
    let bodyPartPositionY = 0;
    let currentDirection = { ...this.bodyParts.at(-1).direction };
    if (currentDirection.up) {
      bodyPartPositionX = this.bodyParts.at(-1).positionX;
      bodyPartPositionY = this.bodyParts.at(-1).positionY + 2 * BODY_RADIUS;
    } else if (currentDirection.right) {
      bodyPartPositionX = this.bodyParts.at(-1).positionX - 2 * BODY_RADIUS;
      bodyPartPositionY = this.bodyParts.at(-1).positionY;
    } else if (currentDirection.down) {
      bodyPartPositionX = this.bodyParts.at(-1).positionX;
      bodyPartPositionY = this.bodyParts.at(-1).positionY - 2 * BODY_RADIUS;
    } else if (currentDirection.left) {
      bodyPartPositionX = this.bodyParts.at(-1).positionX + 2 * BODY_RADIUS;
      bodyPartPositionY = this.bodyParts.at(-1).positionY;
    }
    this.bodyParts.push(
      new bodyPart(
        bodyPartPositionX,
        bodyPartPositionY,
        this.bodyParts.at(-1).horizontalSpeed,
        this.bodyParts.at(-1).verticalSpeed,
        currentDirection
      )
    );

    if (this.bodyParts.length > 1) {
      this.bodyParts.at(-1).turns.push(...this.bodyParts.at(-2).turns);
    }
  }

  adjustBodyPartsPosition() {
    for (let i = 0; i < this.bodyParts.length; i++) {
      if (this.bodyParts[i].positionX - BODY_RADIUS >= CANVAS_WIDTH) {
        this.bodyParts[i].positionX = BODY_RADIUS;
      }

      if (this.bodyParts[i].positionX + BODY_RADIUS <= 0) {
        this.bodyParts[i].positionX = CANVAS_WIDTH - BODY_RADIUS;
      }

      if (this.bodyParts[i].positionY - BODY_RADIUS >= CANVAS_HEIGHT) {
        this.bodyParts[i].positionY = BODY_RADIUS;
      }

      if (this.bodyParts[i].positionY + BODY_RADIUS <= 0) {
        this.bodyParts[i].positionY = CANVAS_HEIGHT - BODY_RADIUS;
      }
    }
  }

  changeBodyPartsDirection() {
    for (let i = 1; i < this.bodyParts.length; i++) {
      if (
        this.bodyParts[i].turns.length !== 0 &&
        this.bodyParts[i].positionX ===
          this.bodyParts[i].turns.at(0).positionX &&
        this.bodyParts[i].positionY === this.bodyParts[i].turns.at(0).positionY
      ) {
        this.bodyParts[i].direction = {
          ...this.bodyParts[i].turns.at(0).direction,
        };
        if (this.bodyParts[i].direction.up) {
          this.bodyParts[i].horizontalSpeed = 0;
          this.bodyParts[i].verticalSpeed = this.bodyParts[i - 1].verticalSpeed;
        } else if (this.bodyParts[i].direction.right) {
          this.bodyParts[i].horizontalSpeed =
            this.bodyParts[i - 1].horizontalSpeed;
          this.bodyParts[i].verticalSpeed = 0;
        } else if (this.bodyParts[i].direction.down) {
          this.bodyParts[i].horizontalSpeed = 0;
          this.bodyParts[i].verticalSpeed = this.bodyParts[i - 1].verticalSpeed;
        } else if (this.bodyParts[i].direction.left) {
          this.bodyParts[i].horizontalSpeed =
            this.bodyParts[i - 1].horizontalSpeed;
          this.bodyParts[i].verticalSpeed = 0;
        }
        this.bodyParts[i].turns.shift();
      }
    }
  }

  isCollisionDetected(snakeHead) {
    for (let i = 1; i < this.bodyParts.length; i++) {
      if (
        (Math.abs(snakeHead.positionX - this.bodyParts[i].positionX) <
          2 * BODY_RADIUS &&
          snakeHead.positionY === this.bodyParts[i].positionY) ||
        (Math.abs(snakeHead.positionY - this.bodyParts[i].positionY) <
          2 * BODY_RADIUS &&
          snakeHead.positionX === this.bodyParts[i].positionX)
      ) {
        return true;
      }
    }
    return false;
  }

  drawSnake() {
    for (let i = 0; i < this.bodyParts.length; i++) {
      this.#drawBodyPart(
        this.bodyParts[i].positionX,
        this.bodyParts[i].positionY
      );
    }
  }

  #drawBodyPart(bodyPartPositionX, bodyPartPositionY) {
    ctx.beginPath();
    ctx.arc(bodyPartPositionX, bodyPartPositionY, BODY_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fill();
    ctx.closePath();
  }
}

disableBrowserScroll();

function updateHighScoresList(highScores) {
  const highScoresList = document.getElementById("high-scores-list");
  highScoresList.innerHTML = "";
  highScores.forEach((score) => {
    const li = document.createElement("li");
    li.innerText = score;
    highScoresList.appendChild(li);
  });
}

let highScores = [];

if (localStorage.getItem("highScores")) {
  highScores = JSON.parse(localStorage.getItem("highScores"));
}

let score = 0;

const snake = new Snake(STARTING_POINT_X, STARTING_POINT_Y);
const food = new Food();
food.generateNewCoordinates(snake.bodyParts);
food.drawFood();

let horizontalSpeed = 0;
let verticalSpeed = 0;

const arrowKeys = {
  rightPressed: false,
  leftPressed: false,
  upPressed: false,
  downPressed: false,
};

document.addEventListener("keydown", handleArrowKeys, false);
document.addEventListener("keyup", handleArrowKeys, false);

function draw() {
  snake.changeSnakeDirection();
  snake.renderSnakeMovement();
  snake.renderBodyMovement();
  snake.adjustBodyPartsPosition();
  snake.changeBodyPartsDirection();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  food.drawFood();
  if (food.isFoodEaten(snake.bodyParts[SNAKE_HEAD_INDEX])) {
    food.generateNewCoordinates(snake.bodyParts);
    snake.addBodyPart();
    score++;
    document.getElementById("score").innerHTML = score;
  }

  if (snake.isCollisionDetected(snake.bodyParts[SNAKE_HEAD_INDEX])) {
    highScores.push(score);
    highScores = removeDuplicates(highScores);
    highScores.sort((a, b) => b - a);
    if (highScores.length > 10) {
      highScores.pop();
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
    location.reload();
    return;
  }
  snake.drawSnake();
}

updateHighScoresList(highScores);
setInterval(draw, 50);
