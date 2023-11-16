const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8081;

app.use(bodyParser.json()); // Parse JSON request bodies

// Ensure that the 'photos' directory exists
const photosDirectory = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDirectory)) {
  fs.mkdirSync(photosDirectory);
  console.log('Created "photos" directory');
}

// GET request handler for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// GET request handler for retrieving saved photos
app.get('/photos', (req, res) => {
  fs.readdir(photosDirectory, (err, files) => {
    if (err) {
      console.error('Error reading photos directory:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const photoList = files.map((file) => ({ filename: file }));
      res.json(photoList);
    }
  });
});

// GET request handler
app.get('/upload', (req, res) => {
  res.send('This is the GET endpoint');
});

// POST request handler
app.post('/upload', (req, res) => {
  // Handle the image data received from the client
  const imageData = req.body.image;
  console.log('Image received:', imageData);

  // Save the image to the server
  const filename = `photo_${Date.now()}.jpg`;
  const filePath = path.join(photosDirectory, filename);

  fs.writeFile(filePath, imageData, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Image saved to', filePath);

      // Send a response to the client
      res.json({ message: 'Image received and saved successfully' });
    }
  });
});

app.listen(port, '172.16.2.149', () => {
  console.log(`Server is running at http://172.16.2.149:${port}`);
});
