var fs = require('fs');
var tftp = require('tftp');
var path = require('path');
var assert = require('assert');
var getURI = require('get-uri');
var toBuffer = require('stream-to-buffer');

describe('get-uri-tftp', function () {
  var server, port;

  // TODO: make relative requires work as expected
  getURI.use(path.resolve(__dirname, '..'));

  before(function (done) {
    port = 12345;
    server = tftp.createServer({
      host: '127.0.0.1',
      port: port,
      root: __dirname,
      denyPUT: true
    });
    server.once('listening', function () { done(); });
    server.listen();
  });

  after(function (done) {
    server.once('close', function () { done(); });
    server.close();
  });

  it('should have "tftp" in `protocols`', function () {
    assert('tftp' in getURI.protocols);
  });

  it('should request a file', function (done) {
    getURI('tftp://127.0.0.1:' + port + '/test.js', function (err, rs) {
      if (err) return done(err);
      const bufs = [];
      rs.on('data', function (buf) {
        bufs.push(buf);
      });
      rs.on('end', function () {
        const data = Buffer.concat(bufs).toString('utf8');
        const expected = fs.readFileSync(__filename, 'utf8');
        assert.equal(data, expected);
        done();
      });
    });
  });

});
