const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const BODY_RADIUS = 5;
const DEFAULT_DIRECTION = { up: false, right: false, down: false, left: false };
const SNAKE_HEAD_INDEX = 0;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const STARTING_POINT_X = CANVAS_WIDTH / 2;
const STARTING_POINT_Y = CANVAS_HEIGHT / 2;
const SNAKE_COLOR = "#809C13";
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

class BodyPart {
  constructor(bodyPartPositionX, bodyPartPositionY, dx, dy, currentDirection) {
    this.positionX = bodyPartPositionX;
    this.positionY = bodyPartPositionY;
    this.dx = dx;
    this.dy = dy;
    this.direction = { ...currentDirection };
    this.turns = [];
  }
}

class Snake {
  constructor(snakeHeadPositionX, snakeHeadPositionY) {
    this.bodyParts = [
      new BodyPart(snakeHeadPositionX, snakeHeadPositionY, 0, 0, {
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
      this.bodyParts[SNAKE_HEAD_INDEX].dy <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.up
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].dy === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].dy++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].dy = -Math.abs(this.bodyParts[0].dy);
      this.bodyParts[SNAKE_HEAD_INDEX].dx = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "up");

      this.#addTurnPosition("up");
    } else if (
      rightPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].dx >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.right
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].dx === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].dx++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].dx = Math.abs(this.bodyParts[0].dx);
      this.bodyParts[SNAKE_HEAD_INDEX].dy = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "right");
      this.#addTurnPosition("right");
    } else if (
      downPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].dy >= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.down
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].dy === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].dy++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].dy = Math.abs(this.bodyParts[0].dy);
      this.bodyParts[SNAKE_HEAD_INDEX].dx = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "down");
      this.#addTurnPosition("down");
    } else if (
      leftPressed &&
      this.bodyParts[SNAKE_HEAD_INDEX].dx <= 0 &&
      !this.bodyParts[SNAKE_HEAD_INDEX].direction.left
    ) {
      if (this.bodyParts[SNAKE_HEAD_INDEX].dx === 0) {
        this.bodyParts[SNAKE_HEAD_INDEX].dx++;
      }
      this.bodyParts[SNAKE_HEAD_INDEX].dx = -Math.abs(
        this.bodyParts[SNAKE_HEAD_INDEX].dx
      );
      this.bodyParts[SNAKE_HEAD_INDEX].dy = 0;
      this.#setMovementDirection(SNAKE_HEAD_INDEX, "left");
      this.#addTurnPosition("left");
    }
  }

  renderSnakeMovement() {
    this.bodyParts[SNAKE_HEAD_INDEX].positionX +=
      this.bodyParts[SNAKE_HEAD_INDEX].dx;
    this.bodyParts[SNAKE_HEAD_INDEX].positionY +=
      this.bodyParts[SNAKE_HEAD_INDEX].dy;
  }

  renderBodyMovement() {
    for (let i = 1; i < this.bodyParts.length; i++) {
      if (this.bodyParts[i].direction.up) {
        this.bodyParts[i].positionY += this.bodyParts[i].dy;
      } else if (this.bodyParts[i].direction.right) {
        this.bodyParts[i].positionX += this.bodyParts[i].dx;
      } else if (this.bodyParts[i].direction.down) {
        this.bodyParts[i].positionY += this.bodyParts[i].dy;
      } else if (this.bodyParts[i].direction.left) {
        this.bodyParts[i].positionX += this.bodyParts[i].dx;
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
      bodyPartPositionY = this.bodyParts.at(-1).positionY + 2 * BODY_RADIUS;
    } else if (currentDirection.left) {
      bodyPartPositionX = this.bodyParts.at(-1).positionX + 2 * BODY_RADIUS;
      bodyPartPositionY = this.bodyParts.at(-1).positionY;
    }
    this.bodyParts.push(
      new BodyPart(
        bodyPartPositionX,
        bodyPartPositionY,
        this.bodyParts.at(-1).dx,
        this.bodyParts.at(-1).dy,
        currentDirection
      )
    );

    if (this.bodyParts.length > 1) {
      this.bodyParts.at(-1).turns.push(...this.bodyParts.at(-2).turns);
    }
  }

  adjustBodyPartsPosition() {
    for (let i = 0; i < this.bodyParts.length; i++) {
      if (this.bodyParts[i].positionX - BODY_RADIUS + dx > CANVAS_WIDTH) {
        this.bodyParts[i].positionX = 0 - BODY_RADIUS;
      }

      if (this.bodyParts[i].positionX + BODY_RADIUS + dx < 0) {
        this.bodyParts[i].positionX = CANVAS_WIDTH + BODY_RADIUS;
      }

      if (this.bodyParts[i].positionY - BODY_RADIUS + dy > CANVAS_HEIGHT) {
        this.bodyParts[i].positionY = 0 - BODY_RADIUS;
      }

      if (this.bodyParts[i].positionY + BODY_RADIUS + dy < 0) {
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
          this.bodyParts[i].dx = 0;
          this.bodyParts[i].dy = this.bodyParts[i - 1].dy;
        } else if (this.bodyParts[i].direction.right) {
          this.bodyParts[i].dx = this.bodyParts[i - 1].dx;
          this.bodyParts[i].dy = 0;
        } else if (this.bodyParts[i].direction.down) {
          this.bodyParts[i].dx = 0;
          this.bodyParts[i].dy = this.bodyParts[i - 1].dy;
        } else if (this.bodyParts[i].direction.left) {
          this.bodyParts[i].dx = this.bodyParts[i - 1].dx;
          this.bodyParts[i].dy = 0;
        }
        this.bodyParts[i].turns.shift();
      }
    }
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

const snake = new Snake(STARTING_POINT_X, STARTING_POINT_Y);

let foodPositionX = CANVAS_WIDTH * Math.random();
let foodPositionY = CANVAS_HEIGHT * Math.random();

let dx = 0;
let dy = 0;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

function drawFood(foodPositionX, foodPositionY) {
  ctx.beginPath();
  ctx.rect(foodPositionX, foodPositionY, 20, 20);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

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

disableBrowserScroll();

function draw() {
  snake.renderSnakeMovement();
  snake.renderBodyMovement();
  snake.changeSnakeDirection();

  // document.getElementById("up").innerHTML = [upPressed, snake.headPositionX];
  // document.getElementById("up").innerHTML = [JSON.stringify(snake.bodyParts)];
  // document.getElementById("down").innerHTML = [downPressed, snake.headPositionX];
  // document.getElementById("left").innerHTML = [leftPressed, snake.headPositionY];
  // document.getElementById("right").innerHTML = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // drawFood(foodPositionX, foodPositionY);
  snake.drawSnake();

  snake.adjustBodyPartsPosition();
  snake.changeBodyPartsDirection();
}

setInterval(draw, 10);
