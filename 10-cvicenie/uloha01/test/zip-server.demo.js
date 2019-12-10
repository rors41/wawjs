const zip_server = require('../src/zip-server');
const zip_client = require('../src/zip-client');

server = zip_server();

const file = process.argv[2] || 'test.txt'
zip_client(file).on('finish', () => {
    server.close();
    console.log('server closed');
});
