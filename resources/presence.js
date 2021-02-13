const { ipcRenderer } = require('electron');
ipcRenderer.on('getScores', () => {
    let scores = {
        highest: bestScore,
        current: score,
    }
    console.log(scores);
    ipcRenderer.send('scores', scores);
});