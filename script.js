const rulesBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Event Handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.toggle('show');
})

// rulesBtn.addEventListener('click', () => {
    // rules.classList.remove('show');
// })

let score = 0;
const brickRowCount = 9,
      brickColumnCount = 5;

// Make Paddle Object
const paddle = {
    x: canvas.width/2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 6,
    currSpeed: 0
};
// Draw Paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}
// Move Paddle
function movePaddle() {
    paddle.x += paddle.currSpeed;
    if(paddle.x + paddle.width > canvas.width)
        paddle.x = canvas.width - paddle.width;
    if(paddle.x < 0)
        paddle.x = 0;
}

// Make Ball Object
const ball = {
    x: Math.random()*(canvas.width - 20) + 10,
    y: (canvas.height) - Math.random()*(canvas.height/2),
    size: 10,
    speed: 4,
    currSpeedX: Math.random() < 0.5 ? 4 : -4,
    currSpeedY: -4
};
// Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI*2);
    ctx.fillStyle = '#cc6600';
    ctx.fill();
    ctx.closePath();
}
// Move Ball
function moveBall() {
    ball.x += ball.currSpeedX;
    ball.y += ball.currSpeedY;

    // Collision with Walls
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
        ball.currSpeedX *= -1;
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0)
        ball.currSpeedY *= -1;

    // Collision with Paddle
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y
    )
        ball.currSpeedY = -ball.speed;

    // Collision with Bricks
    bricks.forEach(column => {
        column.forEach(brick => {
        if(brick.visible) {
            if(
                ball.y + ball.size > brick.y && ball.y - ball.size < brick.y + brick.height
                ) {
                    if(
                        ball.x - ball.size > brick.x && ball.x + ball.size < brick.x + brick.width
                    ) {
                        ball.currSpeedY *= -1;
                        brick.visible = false;
    
                        increaseScore();
                    }
                }
            
            else if (
                ball.x - ball.size > brick.x && 
                ball.x + ball.size < brick.x + brick.width
                ) {
                    if(
                        ball.y + ball.size > brick.y && ball.y - ball.size < brick.y + brick.height
                    ) {
                        ball.currSpeedX *= -1;
                        brick.visible = false;
    
                        increaseScore();
                    }
                }
        }
        });
    });

    // Lose
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

// Make Brick Object
const brick = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};
// Making Bricks Array
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brick.width + brick.padding) + brick.offsetX;
        const y = j * (brick.height + brick.padding) + brick.offsetY;
        bricks[i][j] = { x, y, ...brick };
    }
}
// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.visible ? '#cc0000' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

// Draw score on canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Increase score
function increaseScore() {
    score++;
  
    if (score % (brickRowCount * brickColumnCount) === 0) {
      showAllBricks();
    }
}

// Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

keyDown = e => {
    if(e.key == 'Right' || e.key == 'ArrowRight')
        paddle.currSpeed = paddle.speed;
    if(e.key == 'Left' || e.key == 'ArrowLeft')
        paddle.currSpeed = -paddle.speed
}

keyUp = e => {
    if(e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'Left' || e.key == 'ArrowLeft')
        paddle.currSpeed = 0;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
}

function update() {
    moveBall();
    movePaddle();

    draw();

    requestAnimationFrame(update);
}

update();
