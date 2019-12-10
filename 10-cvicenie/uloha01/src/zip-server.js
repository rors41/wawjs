const http = require('http');
const fs = require('fs');
const { createGzip } = require("zlib");
const { pipeline } = require("stream");

module.exports = zip_server;

function zip_server () {
    const dir = './files/'
    const path = require("path")


    let server = http.createServer()
    server.listen(9999, "localhost")
        .on("request", (req, res) => {
            filename = req.headers['filename'];

            pipeline(req, createGzip(), res, (err) => {
                if (err) {
                    console.error('Pipeline failed.', err);
                }});

            pipeline(req,
                fs.createWriteStream(path.join(dir, filename), {
                    encoding: null
                }),
                (err) => {
                if (err) console.error('Pipeline failed.', err);
            	});
        });
    return server;
}