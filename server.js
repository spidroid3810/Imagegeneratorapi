const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Hugging Face API key
const API_TOKEN = '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';

// Serve static files (like index.html) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Send a response indicating the image is being generated

// Route to generate image
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required!' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Saad381/Spectra-V1',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        responseType: 'arraybuffer', // Set responseType to 'arraybuffer' to get binary data
      }
    );

    // Convert the image buffer to a base64 string
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');

    // Respond with the base64 string of the image
    res.json({ image: base64Image });
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Error generating image' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.send('AI Image Generator API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
