let c = document.createElement("canvas");
c.id = "c";
c.width = 400;
c.height = 400;
document.body.appendChild(c);
let context = c.getContext("2d");

const birds = ['./resources/toj.png', './resources/teg.png', './resources/tesh.png', './resources/deep.png']

const bird = new Image();
bird.src = birds[0];

let isRandomising = false;

let birdX = birdDY = score = bestScore = 0;
let interval = birdSize = pipeWidth = topPipeBottomY = 24;
let birdY = pipeGap = 200;
let canvasSize = pipeX = 400;
let paused = false;

if (localStorage.getItem('bestScore')) {
    bestScore = localStorage.getItem('bestScore');
}
localStorage.setItem("bestScore", bestScore);

c.onclick = () => (birdDY = 9);
document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        birdDY = 9
    }
    if (e.key === "Escape") {
        paused = paused ? false : true;
    }
}

let gameloop = setInterval(() => {
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
    bird.src = birds[0];
}