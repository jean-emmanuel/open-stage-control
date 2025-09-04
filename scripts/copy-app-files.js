const fs = require("fs");
const path = require("path");

// Create the app directory if it doesn't exist
const appDir = path.join(__dirname, "../app");
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
}

// Copy main index.js
const srcIndexPath = path.join(__dirname, "../src/index.js");
const destIndexPath = path.join(appDir, "index.js");

if (fs.existsSync(srcIndexPath)) {
    fs.copyFileSync(srcIndexPath, destIndexPath);
    console.log("Copied index.js to app directory");
} else {
    console.error("Source index.js not found!");
}
