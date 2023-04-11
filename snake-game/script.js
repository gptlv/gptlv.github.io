const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;

function disableBrowserScroll() {
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}

function changeSnakeDirection() {
    if (rightPressed && dx >= 0) {
        if (dx === 0) {
            dx++;
        }
        dx = Math.abs(dx);
        dy = 0;
    } 
    else if (leftPressed && dx <= 0) {
        if (dx === 0) {
            dx++;
        }
        dx = - Math.abs(dx);
        dy = 0;
    }
    if (upPressed && dy <= 0) {
        if (dy === 0) {
            dy++;
        }
        dy = - Math.abs(dy);
        dx = 0;
    } 
    else if (downPressed && dy >= 0) {
        if (dy === 0) {
            dy++;
        }
        dy = Math.abs(dy);
        dx = 0;
    }
}

class Snake {
    constructor(snakeHeadPositionX, snakeHeadPositionY) {
        // this.headPositionX = snakeHeadPositionX;
        // this.headPositionY = snakeHeadPositionY;
        this.bodyParts = [[snakeHeadPositionX, snakeHeadPositionY]];
    }

    addBodyPart (bodyPartPositionX, bodyPartPositionY) {
        this.bodyParts.push([bodyPartPositionX, bodyPartPositionY]);
    };

    adjustBodyPartsPosition() {
        for (let i = 0; i < this.bodyParts.length; i++) {
            if (this.bodyParts[i][0] - ballRadius + dx > canvas.width) {
                this.bodyParts[i][0] = 0 - ballRadius;
            }

            if (this.bodyParts[i][0] + ballRadius + dx < 0) {
                this.bodyParts[i][0] = canvas.width + ballRadius;
            }

            if (this.bodyParts[i][1] - ballRadius + dy > canvas.height) {
                this.bodyParts[i][1] = 0 - ballRadius;
            }

            if (this.bodyParts[i][1] + ballRadius + dy < 0) {
                this.bodyParts[i][1] = canvas.height + ballRadius;
            }

            this.bodyParts[i][0] += dx;
            this.bodyParts[i][1] += dy;
        }
    }

    drawSnake () {
        for (let i = 0; i < this.bodyParts.length; i++) {
            this.drawBodyPart(this.bodyParts[i][0], this.bodyParts[i][1]);
        }
    };

    drawBodyPart(bodyPartPositionX, bodyPartPositionY) {
        ctx.beginPath();
        ctx.arc(bodyPartPositionX, bodyPartPositionY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

let snakeHeadPositionX = canvas.width / 2;
let snakeHeadPositionY = canvas.height / 2;

const snake = new Snake(snakeHeadPositionX, snakeHeadPositionY);
// snake.addBodyPart(snakeHeadPositionX + 2 * ballRadius, snakeHeadPositionY);

let foodPositionX = canvas.width * Math.random();
let foodPositionY = canvas.height * Math.random();

let dx = 1;
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
    } 
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}
  
function leftAndRightKeyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function upAndDownKeyDownHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
    } 
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    }
}
  
function upAndDownKeyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
    }
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    }
}

function draw() {
    disableBrowserScroll();
    changeSnakeDirection();

    // document.getElementById("up").innerHTML = [upPressed, snake.headPositionX];
    document.getElementById("up").innerHTML = [upPressed, snake.bodyParts];
    document.getElementById("down").innerHTML = [downPressed, snake.headPositionX];
    document.getElementById("left").innerHTML = [leftPressed, snake.headPositionY];
    document.getElementById("right").innerHTML = [rightPressed,snake.headPositionY];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood(foodPositionX, foodPositionY);
    snake.drawSnake();
    snake.adjustBodyPartsPosition(dx, dy);
}

setInterval(draw, 10);