// server.mjs
import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fs from 'fs';

// Initialize dotenv
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// __dirname is not defined in ES module scope, you need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json()); // Parse JSON payloads

// Initialize the OpenAI API with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Serve the main HTML file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle text-to-speech conversion
app.post('/synthesize', async (req, res) => {
  try {
    const { text, voice } = req.body;

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
    });

    // Convert the response to a buffer and send it back to the client
    const buffer = Buffer.from(await response.arrayBuffer());
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while synthesizing the speech.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
