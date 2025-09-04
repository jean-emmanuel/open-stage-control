const fs = require("fs");
const path = require("path");

function copyRecursively(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    // Copy each entry
    entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursively(srcPath, destPath);
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Create the server directory if it doesn't exist
const serverDir = path.join(__dirname, "../app/server");
const srcDir = path.join(__dirname, "../src/server");

// Copy all server files recursively
copyRecursively(srcDir, serverDir);

// Copy Python files if they exist
const pythonSrcDir = path.join(srcDir, "python");
const pythonDestDir = path.join(serverDir, "python");

if (fs.existsSync(pythonSrcDir)) {
    if (!fs.existsSync(pythonDestDir)) {
        fs.mkdirSync(pythonDestDir, { recursive: true });
    }

    const pythonFiles = fs.readdirSync(pythonSrcDir);
    pythonFiles.forEach((file) => {
        fs.copyFileSync(
            path.join(pythonSrcDir, file),
            path.join(pythonDestDir, file)
        );
    });
}
