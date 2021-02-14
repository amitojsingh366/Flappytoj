leaderboardDiv = document.createElement('div');

leaderboardDiv.style.minHeight = '400px';
leaderboardDiv.style.width = '400px';
leaderboardDiv.style.padding = '0px';
leaderboardDiv.style.margin = '0px';
leaderboardDiv.style.textAlign = 'center';
leaderboardDiv.id = 'main-div';

document.getElementById('main-div').replaceWith(leaderboardDiv);

gameState = {
    isPlaying: false,
    onScreen: 'leaderboard',
    isPaused: false,
    userName: localStorage.getItem('userName'),
}

sendStateChange(gameState);

homebtncont = document.createElement('div');
homebtncont.style.width = '400px';
homebtncont.style.textAlign = 'start';

homebtn = document.createElement('button');

homebtn.style.border = 'none';
homebtn.style.backgroundColor = '';
homebtn.style.background = 'url(./resources/home.png)';
homebtn.style.backgroundClip = 'cover';
homebtn.style.backgroundRepeat = 'no-repeat';
homebtn.style.height = '32px';
homebtn.style.width = '32px';
homebtn.style.margin = '5px';
homebtn.style.marginTop = '10px';
homebtn.style.marginBottom = '10px';

homebtn.addEventListener('click', (e) => {
    e.preventDefault();
    script = document.createElement('script');
    script.src = './resources/home.js';
    script.id = 'main-running-script';

    document.getElementById('main-running-script').replaceWith(script);
})

homebtn.style.marginTop = '10px';
homebtn.style.marginLeft = '10px';
homebtncont.appendChild(homebtn);
document.getElementById('main-div').appendChild(homebtncont);

document.getElementById('main-div').style.backgroundColor = 'skyblue';

ipcRenderer.send('getLeaderboard', '');

ipcRenderer.on('leaderboard', (event, data) => {
    if (data != 'unavailable') {
        renderTable(data);
    } else {
        document.getElementById('main-div').appendChild(spacer);
        document.getElementById('main-div').appendChild(spacer);
        document.getElementById('main-div').appendChild(spacer);

        p = document.createElement('p');
        p.innerText = 'Unable to load at the moment';
        document.getElementById('main-div').appendChild(p);
    }
});

function renderTable(data) {
    table = document.createElement('table');
    table.id = 'leaderboard-table';
    tr = document.createElement('tr');

    th = document.createElement('th');
    th.innerText = 'Pos.'
    th.style.width = '120px';
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerText = 'Name'
    th.style.width = '120px';
    tr.appendChild(th);
    th = document.createElement('th');
    th.innerText = 'Score'
    th.style.width = '120px';

    tr.appendChild(th);

    table.appendChild(tr);

    if (document.getElementById('leaderboard-table')) {
        document.getElementById('leaderboard-table').remove();
    }

    document.getElementById('main-div').appendChild(table);


    for (let i in data) {
        tr = document.createElement('tr');
        let index = Number(i) + 1;

        td = document.createElement('td');
        td.innerText = `${index})`;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = data[i].name;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = data[i].score;
        tr.appendChild(td);

        document.getElementById('leaderboard-table').appendChild(tr);
    }
}