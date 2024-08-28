// /app/api/formula1/state.ts

let state: Record<string, any> = {};

let sseSubscribers: { send: (data: any) => void; close: () => void }[] = [];

export function getState() {
  return state;
}

export function updateState(newState: Record<string, any>) {
  state = { ...state, ...newState };
  notifySseSubscribers();
}

export function addSseSubscriber(subscriber: { send: (data: any) => void; close: () => void }) {
  sseSubscribers.push(subscriber);
}

export function removeSseSubscriber(subscriber: { send: (data: any) => void; close: () => void }) {
  sseSubscribers = sseSubscribers.filter((sub) => sub !== subscriber);
}

function notifySseSubscribers() {
  const data = JSON.stringify(state);
  sseSubscribers.forEach((subscriber) => {
    subscriber.send(data);
  });
}
