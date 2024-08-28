// /services/signalr.ts

let isRunning = false;

const startSignalRHub = async () => {
  if (!isRunning) {
    console.log('Starting SignalR hub...');
    await fetch('/api/formula1/signalr-hub');
    isRunning = true;
  }
};

export { startSignalRHub };
