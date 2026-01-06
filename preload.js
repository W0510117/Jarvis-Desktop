const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvis", {
  // Send a message to Jarvis (Groq / plugins)
  sendMessage: (text) => ipcRenderer.invoke("ask-jarvis", text),

  // Listen for timer events from the main process
  onTimer: (callback) => {
    ipcRenderer.on("jarvis-timer", (event, message) => {
      callback(message);
    });
  },

  // Listen for Jarvis thinking events 
  onThinking: (callback) => {
    ipcRenderer.on("jarvis-thinking", (event, stage) => {
      callback(stage);
    });
  }
});
