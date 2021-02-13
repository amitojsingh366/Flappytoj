"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.startPresence = void 0;
var Discord = require("discord-rpc");
var electron_1 = require("electron");
var axios_1 = require("axios");
var rpc = new Discord.Client({ transport: 'ipc' });
var clientId = '809928468879900683';
var startTimestamp = Date.now();
var bWindow = null;
var rpcReady = false;
var uploadedScore = 0;
var lastRequest = 0;
var gameState = {
    isPlaying: false,
    onScreen: 'home',
    isPaused: false,
    userName: ''
};
var scores = {
    highest: 0,
    current: 0
};
electron_1.ipcMain.on('scores', function (event, newscores) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(newscores.highest > uploadedScore)) return [3 /*break*/, 2];
                return [4 /*yield*/, updateHighscore(Number(newscores.highest))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                scores = newscores;
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('getLeaderboard', function (event, nothing) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1["default"]({
                    method: 'GET',
                    url: 'https://flappytoj.amitoj.net/leaderboard/get.php'
                }).then(function (resp) {
                    if (bWindow) {
                        bWindow.webContents.send('leaderboard', resp.data);
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('stateChanged', function (event, newState) {
    gameState = newState;
    if (rpcReady) {
        setActivity();
    }
});
function startPresence(mainWindow) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bWindow = mainWindow;
                    return [4 /*yield*/, mainWindow.webContents
                            .executeJavaScript('localStorage.getItem("bestScore");', true)
                            .then(function (result) {
                            scores.highest = result;
                            setInterval(function () {
                                mainWindow.webContents.send('getScores');
                                setActivity();
                            }, 3000);
                        })];
                case 1:
                    _a.sent();
                    rpc.on('ready', function () {
                        rpcReady = true;
                    });
                    rpc.login({ clientId: clientId })["catch"](console.error);
                    return [2 /*return*/];
            }
        });
    });
}
exports.startPresence = startPresence;
function setActivity() {
    return __awaiter(this, void 0, void 0, function () {
        var presenceData;
        return __generator(this, function (_a) {
            if (rpcReady) {
                presenceData = {
                    startTimestamp: startTimestamp,
                    largeImageKey: 'logo',
                    largeImageText: 'Flappytoj',
                    smallImageKey: 'idling_med',
                    smallImageText: 'Idling',
                    buttons: [
                        { label: 'Play Now', url: 'https://flappytoj.amitoj.net/' },
                        { label: 'Leaderboard', url: 'https://flappytoj.amitoj.net/leaderboard' },
                    ],
                    instance: false
                };
                if (gameState.isPlaying) {
                    presenceData.details = "Score: " + scores.current;
                    presenceData.state = "High Score: " + scores.highest;
                    presenceData.smallImageKey = gameState.isPaused ? 'paused_med' : 'playing_med';
                    presenceData.smallImageText = gameState.isPaused ? 'Paused' : 'Playing';
                }
                else {
                    switch (gameState.onScreen) {
                        case "home":
                            presenceData.state = 'On the home screen';
                            break;
                        case "leaderboard":
                            presenceData.state = 'Viewing the leaderboards';
                            break;
                        default:
                            presenceData.state = 'On the home screen';
                            break;
                    }
                }
                rpc.setActivity(presenceData);
            }
            return [2 /*return*/];
        });
    });
}
function updateHighscore(newHighScore) {
    return __awaiter(this, void 0, void 0, function () {
        var up;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    up = newHighScore + 1613218610;
                    if (!(Date.now() - lastRequest > 10000)) return [3 /*break*/, 2];
                    lastRequest = Date.now();
                    uploadedScore = newHighScore;
                    return [4 /*yield*/, axios_1["default"]({
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            url: "https://flappytoj.amitoj.net/leaderboard/highscore.php?score=" + up + "&name=" + gameState.userName
                        }).then(function (resp) {
                            if (resp.data.code == 200) {
                                lastRequest = Date.now();
                                uploadedScore = newHighScore;
                                return true;
                            }
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=presence.js.map