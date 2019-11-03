/* 

Paged request for sonar urls
sonar supports pageSize and pageIndex as params in URL,
this can get all results (sequential, not to kill sonar)

IN:     uri
OUT:    concatenated paged result

Samples:
a)
  node src/sonar-rules-cli.js \
      'https://gazelle.ihe.net/sonar/api/rules/search?languages=js' \
      | npx jsontool -a name

b) TODO: shell work as  
  npm start
--------------------------------
// other TODOs:

c) shell work as npx sonar-rules-cli (node binary)
d) parameters (queryes)

*/

const [, ,
  URL = 'https://gazelle.ihe.net/sonar/api/rules/search?languages=js'
] = process.argv;

const async = require("async");
const debug = require("debug")("");
const request = require("request")
  .defaults({ json: true });

function getTotal(cb) {
  const url = `${URL}&pageIndex=1`;
  request(url, (err, _, { total, ps }) => {
    cb(null, { total, ps });
  });
}

function getPage(url, cb) {
  request(url, (err, _, data) => {
    cb(null, data.rules);
  });
}

function getPages(pageSize, cb) {
  let urls = Array.from({length:pageSize+1},(_, i) => {
    return `${URL}&pageIndex=${i+1}`
  })
  let jobs=urls.map((url) => {
    return (cb) => getPage(url, cb);
  });
  async.parallel(jobs, (err, results) => {
    let a = [].concat(...results);
    cb(JSON.stringify(a, null, 2));
  })
}

function getPageCount(obj) {
  return parseInt(obj.total) / parseInt(obj.ps);
 
}

function print(args) {
  console.log(args);
}

async.waterfall([
  getTotal,
  async.asyncify(getPageCount),
  getPages
], print)



// let pageIndex = 0;
// const results = [];

// doWhilst(
//   function _do(done) {
//     const url = `${URL}&pageIndex=${pageIndex + 1}`;
//     debug("_do", url);
//     request(url,
//       (err, response, result) => {
//         if (err || response.statusCode !== 200)
//           return done(err || new Error(statusCode));
//         results.push(...result.rules);
//         pageIndex++;
//         debug("do.done", pageIndex, results.length);
//         done(null, result);
//       }
//     );
//   },
//   function _while(result, cb) {
//     let { p, ps, total } = result;
//     // has more records, index * pageSize
//     debug("_while", arguments);
//     cb(null, p * ps < total);
//   },
//   function _done(err, result) {
//     debug("_done", arguments);
//     if (err) throw err;
//     console.log(JSON.stringify(results, null, 2));
//   }
// );