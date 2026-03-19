let history = [];

export function addToHistory(role, content) {
  history.push({ role, content });

  // limit history
  if (history.length > 20) {
    history.shift();
  }
}

export function getHistory() {
  return history;
}

export function clearHistory() {
  history = [];
}