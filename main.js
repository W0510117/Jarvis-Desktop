require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the frontend
  win.loadURL("http://localhost:3000");

  // ⭐ Make win accessible inside handler
  global.mainWindow = win; 
}

app.whenReady().then(createWindow);

// Handle messages coming from frontend React
ipcMain.handle("ask-jarvis", async (event, text) => {
  try {

    // Jarvis starts thinking
    global.mainWindow.webContents.send("jarvis-thinking", "reasoning");

    // Send it to Flask RAG server
    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text })
    });

    // Jarvis is searching memory
    global.mainWindow.webContents.send("jarvis-thinking", "memory_search");

    const data = await response.json();

    // Jarvis is preparing final answer
    global.mainWindow.webContents.send("jarvis-thinking", "responding");

    return data.answer || "No response from RAG server";

  } catch (error) {
    return "Error: " + error.message;
  }
});
