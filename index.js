// Require the necessary modules
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises; // use promises version of fs for better error handling

// Define the paths of the logo and data files
const path_of_logo = './public/logo';
const path_of_data = './public/Json/data.json';

// Use async/await to load data and handle errors
async function loadData() {
  try {
    // Read the files in the logo directory
    const logoFiles = await fs.readdir(path_of_logo);

    // Loop through each directory in the logo path and get the files
    const skills = await Promise.all(
      logoFiles.map(async (file) => {
        const skillFiles = await fs.readdir(path.join(path_of_logo, file));
        return { name: file, files: skillFiles };
      })
    );

    // Read the JSON data from the file
    const data = await fs.readFile(path_of_data, 'utf8');
    const projects = JSON.parse(data);

    // Set EJS as the view engine for the app
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));

    // Set up a route for the root URL
    app.get('/', (req, res) => {
      res.render('index', { skills, projects });
    });

    // Ignore favicon requests
    app.get('/favicon.ico', (req, res) => res.status(204));

    // Start the server listening on port 3000
    app.listen(3001, () => {
      console.log('Server is running on port 3000');
    });
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process on error
  }
}

loadData();
