homeDiv = document.createElement('div');

homeDiv.style.height = '400px';
homeDiv.style.width = '400px';
homeDiv.style.padding = '0px';
homeDiv.style.margin = '0px';
homeDiv.style.textAlign = 'center';
homeDiv.id = 'main-div';

document.getElementById('main-div').replaceWith(homeDiv);

gameState = {
    isPlaying: false,
    onScreen: 'home',
    isPaused: false,
    userName: localStorage.getItem('userName'),
}

sendStateChange(gameState);

document.getElementById('main-div').style.backgroundColor = 'skyblue';

uname = '';
if (localStorage.getItem('userName')) {
    uname = localStorage.getItem('userName');
}

// let text = document.createElement('h2');
// text.innerText = 'Flappytoj';
// text.style.fontFamily = 'sans-serif'
// text.style.color = 'green';
// text.style.marginBottom = '10px';
// document.getElementById('main-div').appendChild(text);

bird.src = "./resources/toj.png";
bird.style.height = '100px';
bird.style.marginTop = '20px'
document.getElementById('main-div').appendChild(bird);

invalidname = document.createElement('p');
invalidname.innerText = 'Please enter a valid username'
invalidname.style.color = 'red';
invalidname.style.display = 'none';
invalidname.id = 'invalid-name-error'
document.getElementById('main-div').appendChild(invalidname);

nameform = document.createElement('form');
nameinput = document.createElement('input');
nameinput.placeholder = 'Username';
nameinput.type = 'text';
nameinput.style.backgroundColor = 'skyblue';
nameinput.style.border = '1px solid #086b94';
nameinput.style.borderRadius = '10px';
nameinput.id = 'user-name-input';
nameinput.style.height = '40px';
nameinput.style.width = '200px';
nameinput.style.marginTop = '10px';
nameinput.value = uname;
nameform.appendChild(nameinput);
nameform.addEventListener('submit', async(e) => {
    e.preventDefault();
    await tryName();
});

playBtn = document.createElement('button');
playBtn.style.border = 'none';
playBtn.style.backgroundColor = '';
playBtn.style.background = 'url(./resources/play.png)';
playBtn.style.backgroundClip = 'cover';
playBtn.style.backgroundRepeat = 'no-repeat';
playBtn.style.height = '65px';
playBtn.style.width = '65px';
playBtn.style.margin = '5px';
playBtn.style.marginTop = '10px';
playBtn.addEventListener('click', async(e) => {
    e.preventDefault();
    await tryName();
})

leadBtn = document.createElement('button');
leadBtn.style.border = 'none';
leadBtn.style.backgroundColor = '';
leadBtn.style.background = 'url(./resources/leaderboard.png)';
leadBtn.style.backgroundClip = 'cover';
leadBtn.style.backgroundRepeat = 'no-repeat';
leadBtn.style.height = '65px';
leadBtn.style.width = '65px';
leadBtn.style.margin = '5px';
leadBtn.style.marginTop = '10px';

leadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    script = document.createElement('script');
    script.src = './resources/leaderboard.js';
    script.id = 'main-running-script';

    document.getElementById('main-running-script').replaceWith(script);
})

spacer = document.createElement('br');

document.getElementById('main-div').appendChild(spacer);
document.getElementById('main-div').appendChild(nameform);
document.getElementById('main-div').appendChild(spacer);
document.getElementById('main-div').appendChild(playBtn);
document.getElementById('main-div').appendChild(leadBtn);

async function validateName(name) {
    return /^[0-9a-zA-Z]+$/.test(name);
}

async function tryName() {
    let n = document.getElementById('user-name-input').value;
    if (await validateName(n) == true) {

        if (localStorage.getItem('userName') != n) {
            localStorage.setItem('bestScore', 0);
        }

        localStorage.setItem('userName', n);
        gameState.userName = n;

        script = document.createElement('script');
        script.src = './resources/flappytoj.js';
        script.id = 'main-running-script';

        document.getElementById('main-running-script').replaceWith(script);
    } else {
        document.getElementById('invalid-name-error').style.display = 'inherit';
    }
}