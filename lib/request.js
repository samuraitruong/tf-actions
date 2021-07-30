const https = require('https');
const utils = require('util');
const urlLib = require('url');

function get({ url, headers }, callback) {
  const parsed = urlLib.parse(url);
  const req = https
    .get(
      {
        hostname: parsed.host,
        path: parsed.path,
        headers,
      },
      (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          callback(null, JSON.parse(data));
        });
      },
    )
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
}

module.exports = {
  getAsync: utils.promisify(get),
};
