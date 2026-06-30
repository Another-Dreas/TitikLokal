const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Basic static server
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((request, response) => {
    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(404);
                response.end('404 Not Found');
            } else {
                response.writeHead(500);
                response.end('500 Server Error: ' + error.code);
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(8081, async () => {
    console.log('Server running at http://127.0.0.1:8081/');
    
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()} ${msg.text()}`);
        });
        
        page.on('pageerror', error => {
            console.log(`[BROWSER ERROR] ${error.message}`);
        });

        page.on('requestfailed', request => {
            console.log(`[BROWSER NETWORK ERROR] ${request.url()} - ${request.failure().errorText}`);
        });

        await page.goto('http://127.0.0.1:8081/', { waitUntil: 'networkidle0', timeout: 10000 });
        
        const bodyClass = await page.evaluate(() => document.body.className);
        const appHtml = await page.evaluate(() => document.getElementById('app') ? document.getElementById('app').innerHTML.substring(0, 200) : 'NO APP DIV');
        console.log('Body classes:', bodyClass);
        console.log('App HTML preview:', appHtml);
        
        await browser.close();
    } catch(e) {
        console.error('Puppeteer Error:', e);
    }
    server.close();
    process.exit(0);
});
