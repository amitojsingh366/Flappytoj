let gameState = {
    isPlaying: true,
    onScreen: 'game',
    isPaused: false,
    userName: localStorage.getItem('userName'),
}

//common
let script = document.createElement('script');
let spacer = document.createElement('br');
let bestScore = score = 0;
const bird = new Image();
let gameloop = null;

//homepage
let homeDiv = document.createElement('div');
let invalidname = document.createElement('form');
let nameform = document.createElement('form');
let nameinput = document.createElement('input');
let playBtn = document.createElement('button');
let leadBtn = document.createElement('button');

//leaderboard
let homebtncont = document.createElement('div');
let homebtn = document.createElement('button');
let table = document.createElement('table');
let tr = document.createElement('tr');
let th = document.createElement('th');
let td = document.createElement('td');

//game page
let c = document.createElement("canvas");
let context = c.getContext("2d");
let gameDiv = document.createElement('div');
const birds = ['./resources/toj.png', './resources/teg.png', './resources/tesh.png', './resources/deep.png'];
let birdX = birdDY = 0;
let interval = birdSize = pipeWidth = topPipeBottomY = 24;
let birdY = pipeGap = 200;
let canvasSize = pipeX = 400;
let paused = false;
let isRandomising = false;

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