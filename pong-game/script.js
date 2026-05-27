// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;
const paddleSpeed = 6;
const ballSpeed = 5;
const winScore = 11;

// Player paddle (left)
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Computer paddle (right)
const computerPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: ballSpeed,
    dy: ballSpeed,
    speed: ballSpeed
};

// Score
let playerScore = 0;
let computerScore = 0;
let gameOver = false;

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse control for player paddle
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Smoothly move paddle towards mouse position
    const paddleCenter = playerPaddle.y + playerPaddle.height / 2;
    const diff = mouseY - paddleCenter;
    
    if (Math.abs(diff) > 5) {
        playerPaddle.dy = diff > 0 ? paddleSpeed : -paddleSpeed;
    } else {
        playerPaddle.dy = 0;
    }
});

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#667eea';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawNetLine() {
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawScoreboard() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Update functions
function updatePlayerPaddle() {
    // Arrow keys control
    if (keys['ArrowUp']) {
        playerPaddle.dy = -paddleSpeed;
    } else if (keys['ArrowDown']) {
        playerPaddle.dy = paddleSpeed;
    }

    playerPaddle.y += playerPaddle.dy;

    // Wall collision
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

function updateComputerPaddle() {
    // Simple AI: follow the ball
    const paddleCenter = computerPaddle.y + computerPaddle.height / 2;
    const diff = ball.y - paddleCenter;

    if (Math.abs(diff) > 10) {
        computerPaddle.dy = diff > 0 ? paddleSpeed * 0.8 : -paddleSpeed * 0.8;
    } else {
        computerPaddle.dy = 0;
    }

    computerPaddle.y += computerPaddle.dy;

    // Wall collision
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }
    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;

        // Clamp ball to prevent getting stuck
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
        }
    }

    // Player paddle collision
    if (
        ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;

        // Add spin based on where ball hits paddle
        const paddleCenter = playerPaddle.y + playerPaddle.height / 2;
        const diff = ball.y - paddleCenter;
        ball.dy += diff * 0.1;

        // Increase speed slightly
        ball.speed += 0.5;
        ball.dx = Math.sign(ball.dx) * ball.speed;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;

        // Add spin based on where ball hits paddle
        const paddleCenter = computerPaddle.y + computerPaddle.height / 2;
        const diff = ball.y - paddleCenter;
        ball.dy += diff * 0.1;

        // Increase speed slightly
        ball.speed += 0.5;
        ball.dx = Math.sign(ball.dx) * ball.speed;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Check for game over
    if (playerScore >= winScore || computerScore >= winScore) {
        gameOver = true;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = ballSpeed;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
    ball.dy = (Math.random() - 0.5) * ballSpeed;
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';

    const winner = playerScore >= winScore ? 'PLAYER WINS!' : 'COMPUTER WINS!';
    ctx.fillText(winner, canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${playerScore} - ${computerScore}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Refresh page to play again', canvas.width / 2, canvas.height / 2 + 60);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updatePlayerPaddle();
        updateComputerPaddle();
        updateBall();
    }

    // Draw game objects
    drawNetLine();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    drawBall();
    drawScoreboard();

    if (gameOver) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();