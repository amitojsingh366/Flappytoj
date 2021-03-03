gameDiv = document.createElement('div');
gameDiv.style.height = '400px';
gameDiv.style.width = '400px';
gameDiv.style.padding = '0px';
gameDiv.style.margin = '0px';
gameDiv.id = 'main-div';

document.getElementById('main-div').replaceWith(gameDiv);

c = document.createElement("canvas");
c.id = "c";
c.width = 400;
c.height = 400;
document.getElementById('main-div').appendChild(c);
context = c.getContext("2d");


bird.src = birds[0];

isRandomising = false;

birdX = birdDY = 0;
interval = birdSize = pipeWidth = topPipeBottomY = 24;
birdY = pipeGap = 200;
canvasSize = pipeX = 400;
paused = false;

gameState = {
    isPlaying: true,
    onScreen: 'game',
    isPaused: false,
    userName: localStorage.getItem('userName'),
}

sendStateChange(gameState);

if (localStorage.getItem('bestScore')) {
    bestScore = localStorage.getItem('bestScore');
}
localStorage.setItem("bestScore", bestScore);

//c.onclick = () => (birdDY = 9);

c.onmouseup = function(e) {
    if (gameState.onScreen == 'game') {
        if (e.button == 0) {
            birdDY = 9
        }
        if (e.button == 2) {
            paused = paused ? false : true;
            gameState.isPaused = paused;
            sendStateChange(gameState);
        }
    }
}

document.body.onkeyup = function(e) {
    if (gameState.onScreen == 'game') {
        if (e.keyCode == 32 || e.keyCode == 38) {
            birdDY = 9
        }
        if (e.keyCode == 27 || e.keyCode == 40) {
            paused = paused ? false : true;
            gameState.isPaused = paused;
            sendStateChange(gameState);
        }

        if (e.keyCode == 72) {
            script = document.createElement('script');
            script.src = './resources/home.js';
            script.id = 'main-running-script';

            document.getElementById('main-running-script').replaceWith(script);
        }
    }
}

clearInterval(gameloop);
gameloop = setInterval(() => {
    if (!paused) {
        //bg
        context.fillStyle = "skyblue";
        context.fillRect(0, 0, canvasSize, canvasSize);

        //gravity
        birdY -= birdDY -= 0.5;

        //bird
        context.drawImage(bird, birdX, birdY, birdSize * (524 / 374), birdSize);

        //pipes
        context.fillStyle = "green";
        pipeX -= 8;
        pipeX < -pipeWidth &&
            ((pipeX = canvasSize), (topPipeBottomY = pipeGap * Math.random()));
        context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY);
        context.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasSize);

        //scores
        score++;
        context.fillStyle = "black";
        context.fillText(`Current: ${score}`, 8, 25);
        bestScore = bestScore < score ? score : bestScore;
        localStorage.setItem('bestScore', bestScore);
        context.fillText(`Best: ${bestScore}`, 8, 50);

        //bird death logic
        (((birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap) && pipeX < birdSize * (524 / 374)) ||
            birdY > canvasSize) &&
        ((birdDY = 0), (birdY = 200), (pipeX = canvasSize), (score = 0));

        if (score > 10000 && score < 11000) {
            if (!isRandomising) {
                randomiseBird();
                isRandomising = true;
            }
        }
    }
}, interval);


function randomiseBird() {
    let interval = setInterval(() => {
        if (isRandomising) {
            let random = Math.floor(Math.random() * birds.length);
            bird.src = birds[random];
        } else {
            normaliseBird();
            clearInterval(interval);
        }
    }, 5000);
}

function normaliseBird() {
    if (isRandomising) {
        isRandomising = false;
    }
    bird.src = birds[0];
}