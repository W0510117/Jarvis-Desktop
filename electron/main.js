require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the React interface
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);

// Handle messages coming from React
ipcMain.handle("ask-jarvis", async (event, text) => {
  try {
    // === CALCULATOR ===
    const mathMatch = text.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (mathMatch) {
      const a = Number(mathMatch[1]);
      const op = mathMatch[2];
      const b = Number(mathMatch[3]);
      let result;
      switch (op) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = a / b; break;
      }
      return `🧮 ${a} ${op} ${b} = ${result}`;
    }

    // === TIMER ===
    const timerMatch = text.match(/timer for (\d+)\s*(seconds?|secs?|s)/i);
    if (timerMatch) {
      const seconds = Number(timerMatch[1]);

      // Send a message back later
      setTimeout(() => {
        // send an async event TO the renderer
        event.sender.send("jarvis-timer", `⏰ Time's up! ${seconds} seconds passed.`);
      }, seconds * 1000);

      // immediate response
      return `⏳ Timer started for ${seconds} seconds...`;
    }

    // === IF NO PLUGIN MATCH — USE GROQ MODEL ===
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are Jarvis, an intelligent, helpful assistant." },
        { role: "user", content: text }
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    return "Error: " + error.message;
  }
});
