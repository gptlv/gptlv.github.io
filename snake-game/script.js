const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const BODY_RADIUS = 5;
const FOOD_RADIUS = 5;
const DEFAULT_DIRECTION = { up: false, right: false, down: false, left: false };
const SNAKE_HEAD_INDEX = 0;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const STARTING_POINT_X = CANVAS_WIDTH / 2;
const STARTING_POINT_Y = CANVAS_HEIGHT / 2;
const SNAKE_COLOR = "#809C13";
const FOOD_COLOR = "#FF0000";
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

class Food {
  constructor() {
    this.positionX = 0;
    this.positionY = 0;
  }

  generateNewCoordinates(bodyParts) {
    while (true) {
      let newPositionX = Math.round(
        Math.random() * (CANVAS_WIDTH * 0.9 - CANVAS_WIDTH * 0.1 + 1) +
          CANVAS_WIDTH * 0.1 -
          0.5
      );
      let newPositionY = Math.round(
        Math.random() * (CANVAS_HEIGHT * 0.9 - CANVAS_HEIGHT * 0.1 + 1) +
          CANVAS_HEIGHT * 0.1 -
          0.5
      );
      if (
        bodyParts.every(
          (bodyPart) =>
            bodyPart.positionX !== newPositionX &&
            bodyPart.positionY !== newPositionY
        ) //TODO account for body radius
      ) {
        this.positionX = newPositionX;
        this.positionY = newPositionY;
        break;
      }
    }
  }

  isFoodEaten(snakeHead) {
    if (
      (Math.abs(this.positionX - snakeHead.positionX) <
        BODY_RADIUS + FOOD_RADIUS &&
        this.positionY === snakeHead.positionY) ||
      (Math.abs(this.positionY - snakeHead.positionY) <
        BODY_RADIUS + FOOD_RADIUS &&
        this.positionX === snakeHead.positionX)
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
      upPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.up
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = -Math.abs(
        this.bodyParts[0].verticalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "up");

      this.#addTurnPosition("up");
    } else if (
      rightPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.right
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = Math.abs(
        this.bodyParts[0].horizontalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "right");
      this.#addTurnPosition("right");
    } else if (
      downPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.down
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].verticalSpeed = Math.abs(
        this.bodyParts[0].verticalSpeed
      );
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "down");
      this.#addTurnPosition("down");
    } else if (
      leftPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.left
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].horizontalSpeed++;
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
      if (
        this.bodyParts[i].positionX - BODY_RADIUS + horizontalSpeed >
        CANVAS_WIDTH
      ) {
        this.bodyParts[i].positionX = 0 - BODY_RADIUS;
      }

      if (this.bodyParts[i].positionX + BODY_RADIUS + horizontalSpeed < 0) {
        this.bodyParts[i].positionX = CANVAS_WIDTH + BODY_RADIUS;
      }

      if (
        this.bodyParts[i].positionY - BODY_RADIUS + verticalSpeed >
        CANVAS_HEIGHT
      ) {
        this.bodyParts[i].positionY = 0 - BODY_RADIUS;
      }

      if (this.bodyParts[i].positionY + BODY_RADIUS + verticalSpeed < 0) {
        this.bodyParts[i].positionY = CANVAS_HEIGHT + BODY_RADIUS;
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

  // a function that returns true if the snake collides with itself
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

const snake = new Snake(STARTING_POINT_X, STARTING_POINT_Y);
const food = new Food();
food.generateNewCoordinates(snake.bodyParts);
food.drawFood();

let horizontalSpeed = 0;
let verticalSpeed = 0;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", leftAndRightKeyDownHandler, false);
document.addEventListener("keyup", leftAndRightKeyUpHandler, false);
document.addEventListener("keydown", upAndDownKeyDownHandler, false);
document.addEventListener("keyup", upAndDownKeyUpHandler, false);

function leftAndRightKeyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function leftAndRightKeyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function upAndDownKeyDownHandler(e) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  }
}

function upAndDownKeyUpHandler(e) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = false;
  }
}

document.addEventListener("keydown", spaceKeyDownHandler, false);

function spaceKeyDownHandler(e) {
  if (e.key === " ") {
    snake.addBodyPart();
  }
}

function draw() {
  snake.changeSnakeDirection();
  snake.adjustBodyPartsPosition();
  snake.changeBodyPartsDirection();
  snake.renderSnakeMovement();
  snake.renderBodyMovement();

  // document.getElementById("up").innerHTML = [];
  // document.getElementById("down").innerHTML = [];
  // document.getElementById("left").innerHTML = [];
  // document.getElementById("right").innerHTML = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  food.drawFood();
  if (food.isFoodEaten(snake.bodyParts[SNAKE_HEAD_INDEX])) {
    food.generateNewCoordinates(snake.bodyParts);
    snake.addBodyPart();
  }

  if (snake.isCollisionDetected(snake.bodyParts[SNAKE_HEAD_INDEX])) {
    location.reload();
  }
  snake.drawSnake();
}

setInterval(draw, 10);
