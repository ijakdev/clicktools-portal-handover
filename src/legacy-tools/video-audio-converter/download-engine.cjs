const fs = require('fs');
const https = require('https');
const path = require('path');

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
const files = ['ffmpeg-core.js', 'ffmpeg-core.wasm', 'ffmpeg-core.worker.js'];
const destDir = path.join(__dirname, 'public', 'ffmpeg');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
    const url = `${baseURL}/${file}`;
    const filePath = path.join(destDir, file);
    const stream = fs.createWriteStream(filePath);
    
    console.log(`Downloading ${url} to ${filePath}...`);
    https.get(url, (res) => {
        res.pipe(stream);
        stream.on('finish', () => {
            stream.close();
            console.log(`${file} downloaded successfully.`);
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${file}: ${err.message}`);
    });
});
