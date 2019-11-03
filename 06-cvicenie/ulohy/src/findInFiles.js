const async = require("async");
const fs = require("fs");
const path = require("path");

function findInFiles(dirPaths, fileName, substring, cb) {
    const tasks = [];

    const task = (dirPath, fileName, substring, cb) => fs.readFile(path.join(dirPath, fileName), (err, data) => {
        if (err) return cb(err);
        return data.includes(substring) ? cb(null, path.join(dirPath, fileName)) : cb(!err);
    });

    // for (var dpath of dirPaths) {
    //     tasks.push(async.reflect(task.bind(null, dpath, fileName, substring)));
    // }
    // async.parallel(tasks, cb);

    for (var dpath of dirPaths) {
        tasks.push(task.bind(null, dpath, fileName, substring));
    }
    async.tryEach(tasks, cb)
}

// const callback = (err, result) => {
//    	for (var res of result){
//    		if (res.value) console.log(res.value);
//    	}
// }

const callback = (err, path) => {
	if (err) {
		return err;
	} else {
		console.log(path);
	}
}

const paths = [
    `${__dirname}/../test/data/c`,
    `${__dirname}/../test/data/a`,
    `${__dirname}/../test/data/b`
];

const fileName = 'two.txt';
const substring = 'Lorem Ipsum';

findInFiles(paths, fileName, substring, callback);