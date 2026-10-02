import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('start', {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  handlers: {
    ping: () => ipcRenderer.invoke('ping'),
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('open-file'),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
    counterValue: (value) => ipcRenderer.send('counter-value', value),
  }
});

ipcRenderer.on('custom_click', (event, message) => {
  console.log(`Custom click event received: ${message}`);
  handleCustomClick(message);
});

function handleCustomClick(message) {
  console.log(`Handling custom click event: ${message}`);
}


const { port1, port2 } = new MessageChannel();

port2.postMessage('Hello from the port2!');
ipcRenderer.postMessage('port', null, [port1]); // 不能用send或invoke传递MessagePort

port2.onmessage = (event) => {
  console.log(`Port2 message received: ${event.data}`);
};
