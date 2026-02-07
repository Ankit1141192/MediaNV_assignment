const http = require('http');

function checkPort(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(port, () => {
            console.log(`Port ${port}: AVAILABLE`);
            server.close(() => resolve(true));
        });
        server.on('error', (err) => {
            console.log(`Port ${port}: BUSY (${err.code})`);
            resolve(false);
        });
    });
}

(async () => {
    console.log('Checking ports...');
    await checkPort(5000);
    await checkPort(5001);
})();
