let c = document.createElement("canvas");
c.id = "c";
c.width = 400;
c.height = 400;
document.body.appendChild(c);
let context = c.getContext("2d");
const bird = new Image();
bird.src = "./resources/toj.png";

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
        context.fillStyle = "skyblue";
        context.fillRect(0, 0, canvasSize, canvasSize);

        birdY -= birdDY -= 0.5;
        context.drawImage(bird, birdX, birdY, birdSize * (524 / 374), birdSize);

        context.fillStyle = "green";
        pipeX -= 8;
        pipeX < -pipeWidth &&
            ((pipeX = canvasSize), (topPipeBottomY = pipeGap * Math.random()));
        context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY);
        context.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasSize);

        context.fillStyle = "black";
        context.fillText(score++, 9, 25);
        bestScore = bestScore < score ? score : bestScore;
        localStorage.setItem('bestScore', bestScore);
        context.fillText(`Best: ${bestScore}`, 9, 50);

        (((birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap) && pipeX < birdSize * (524 / 374)) ||
            birdY > canvasSize) &&
        ((birdDY = 0), (birdY = 200), (pipeX = canvasSize), (score = 0));
    }
}, interval);