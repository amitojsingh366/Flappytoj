import * as Discord from 'discord-rpc';
import { ipcMain, BrowserWindow } from 'electron';

const rpc = new Discord.Client({ transport: 'ipc' });
const clientId = '809928468879900683';
const startTimestamp = Date.now();

let rpcReady = false;

let scores = {
    highest: 0,
    current: 0,
}

ipcMain.on('scores', (event, newscores) => {
    scores = newscores;
});

export async function startPresence(mainWindow: BrowserWindow) {
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
        rpc.setActivity({
            details: `Score: ${scores.current}`,
            state: `High Score: ${scores.highest}`,
            startTimestamp,
            largeImageKey: 'logo',
            largeImageText: 'Flappytoj',
            //smallImageKey: 'snek_small',
            //smallImageText: 'i am my own pillows',
            instance: false,
        });
    }
}