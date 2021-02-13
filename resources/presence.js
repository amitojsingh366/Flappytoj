const { ipcRenderer } = require('electron');

if (!bestScore) {
    bestScore = localStorage.getItem('bestScore')
}
if (!score) {
    score = 0;
}
ipcRenderer.on('getScores', () => {
    let scores = {
        highest: bestScore,
        current: score,
    }
    ipcRenderer.send('scores', scores);
});

async function sendStateChange(newState) {
    ipcRenderer.send('stateChanged', newState);
}