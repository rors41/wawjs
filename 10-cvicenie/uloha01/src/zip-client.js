const http = require("http");
const fs = require("fs");
const path = require("path")
const { pipeline } = require("stream");


//const filename = process.argv.slice(2)[0];

module.exports = zip_client;

function zip_client(filename) {
    console.log(__dirname);
    if (fs.existsSync(filename)) {
        console.log(`file ${filename} exists`);
    } else {
        console.log(`Error: file ${filename} doesn't exist`);
        process.exit()
    }


    let input = fs.createReadStream(filename);
    let output = fs.createWriteStream(filename + '.gz', {
        encoding: null
    });

    let url = "http://localhost:9999";
    let request = http.request(url, {
        method: "POST",
        headers: {
            'Filename': filename
        }
    }).on("response", (res) => {
        pipeline(res, output, (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            }
        });
    });

    pipeline(input, request, (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        }
    });
    return request;
}