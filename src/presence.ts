import * as Discord from 'discord-rpc';
import { ipcMain, BrowserWindow } from 'electron';
import Axios, { AxiosResponse } from 'axios';

const rpc = new Discord.Client({ transport: 'ipc' });
const clientId = '809928468879900683';
const startTimestamp = Date.now();

let bWindow: any = null;

let rpcReady = false;

let uploadedScore = 0;
let lastRequest = 0;

let gameState = {
    isPlaying: false,
    onScreen: 'home',
    isPaused: false,
    userName: '',
}

let scores = {
    highest: 0,
    current: 0,
}

ipcMain.on('scores', async (event, newscores) => {
    if (newscores.highest > uploadedScore) {
        await updateHighscore(Number(newscores.highest));
    }
    scores = newscores;
});

ipcMain.on('getLeaderboard', async (event, nothing) => {
    await Axios({
        method: 'GET',
        url: 'https://flappytoj.amitoj.net/leaderboard/get.php',
    }).then((resp: AxiosResponse) => {
        if (bWindow) {
            bWindow.webContents.send('leaderboard', resp.data);
        }
    })
});

ipcMain.on('stateChanged', (event, newState) => {
    gameState = newState;
    if (rpcReady) {
        setActivity();
    }
})

export async function startPresence(mainWindow: BrowserWindow) {
    bWindow = mainWindow;
    await mainWindow.webContents
        .executeJavaScript('localStorage.getItem("bestScore");', true)
        .then(result => {
            scores.highest = result;
            setInterval(() => {
                mainWindow.webContents.send('getScores');
                setActivity();
            }, 3000);
        });

    rpc.on('ready', () => {
        rpcReady = true;
    });
    rpc.login({ clientId }).catch(console.error);
}

async function setActivity() {
    if (rpcReady) {
        let presenceData: Discord.Presence = {
            startTimestamp,
            largeImageKey: 'logo',
            largeImageText: 'Flappytoj',
            smallImageKey: 'idling_med',
            smallImageText: 'Idling',
            buttons: [
                { label: 'Play Now', url: 'https://flappytoj.amitoj.net/' },
                { label: 'Leaderboard', url: 'https://flappytoj.amitoj.net/leaderboard' },
            ],
            instance: false,
        }
        if (gameState.isPlaying) {
            presenceData.details = `Score: ${scores.current}`;
            presenceData.state = `High Score: ${scores.highest}`;
            presenceData.smallImageKey = gameState.isPaused ? 'paused_med' : 'playing_med';
            presenceData.smallImageText = gameState.isPaused ? 'Paused' : 'Playing';
        } else {
            switch (gameState.onScreen) {
                case "home":
                    presenceData.state = 'On the home screen'
                    break;
                case "leaderboard":
                    presenceData.state = 'Viewing the leaderboards'
                    break;
                default:
                    presenceData.state = 'On the home screen'
                    break;
            }
        }
        rpc.setActivity(presenceData);
    }
}

async function updateHighscore(newHighScore: number) {
    let up = newHighScore + 1613218610;
    if (Date.now() - lastRequest > 10000) {
        lastRequest = Date.now();
        uploadedScore = newHighScore;
        await Axios(
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                url: `https://flappytoj.amitoj.net/leaderboard/highscore.php?score=${up}&name=${gameState.userName}`,
            }
        ).then((resp: AxiosResponse) => {
            if (resp.data.code == 200) {
                lastRequest = Date.now();
                uploadedScore = newHighScore;
                return true;
            }
        })

    }

}
