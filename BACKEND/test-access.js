console.log("Vérifiant les permissions...");
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../FRONTEND/assets/css/styles.css');
try {
    const stats = fs.statSync(cssPath);
    console.log("CSS file exists:", stats.isFile());
    console.log("CSS file size:", stats.size, "bytes");
    console.log("CSS file permissions:", stats.mode.toString(8));
} catch (error) {
    console.error("Error accessing CSS file:", error);
}