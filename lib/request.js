const https = require('https');
const utils = require('util');
const urlLib = require('url');

function get({ url, headers }, callback) {
  return request({ url, headers, method: 'GET' }, callback);
}

function patch({ url, headers, data }, callback) {
  return request({ url, headers, method: 'PATCH', data }, callback);
}

function post({ url, headers, data }, callback) {
  return request({ url, headers, method: 'POST', data }, callback);
}

function request({ url, headers, method = 'GET', data }, callback) {
  const parsed = urlLib.parse(url);
  let success = false;
  const req = https
    .request(
      {
        method,
        hostname: parsed.host,
        path: parsed.path,
        headers,
      },
      (resp) => {
        let data = '';
        success = [200, 201].includes(resp.statusCode);
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          try {
            if (!success) {
              console.error(data);
              callback( new Error('Request not return successful status code'));
            } else callback(null, JSON.parse(data));
          } catch (err) {
            console.log(data);
            callback(new Error('Request error'));
          }
        });
      },
    )
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
  if (data) req.write(JSON.stringify(data));
  req.end();
}

module.exports = {
  getAsync: utils.promisify(get),
  patchAsync: utils.promisify(patch),
  postAsync: utils.promisify(post),
};
