const {app, BrowserWindow} = require('electron');
const Bluetooth	= require('node-web-bluetooth');

async function connect() {
    const device = await Bluetooth.requestDevice({
        filters: [
            {services: ['heart_rate']}
        ]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('heart_rate');
    const char = await service.getCharacteristic('heart_rate_measurement');
    await char.startNotifications();
    char.on('characteristicvaluechanged', (data) => {
        // parse heart-rate data here
    });

    await char.stopNotifications();
    await server.disconnect();
}

let mainWindow=null;

function createWindow() {
    mainWindow = new BrowserWindow({width:800, height: 700});
    mainWindow.loadFile('public/index.html');

    mainWindow.on('closed',()=>{
        mainWindow = null;
    });

    connect();
}

app.on('ready',createWindow);
