var tftp = require('tftp');
var extend = require('extend');

module.exports = function setup (protocols) {
  protocols.tftp = get;
};

/**
 * Returns a Readable stream from a "tftp:" URI.
 * There are no caching semantics within TFTP.  There is no safe way to
 * cache information using the TFTP protocol.
 *
 * TFTP URI: http://www.ietf.org/rfc/rfc3617.txt
 *
 * @api protected
 */

function get (parsed, opts, fn) {
  var client = tftp.createClient(extend({
    host: parsed.hostname,
    port: +parsed.port
  }, opts));

  var pathname = parsed.pathname;
  if (pathname[0] === '/') pathname = pathname.substring(1);

  var colon = pathname.indexOf(';');
  if (-1 !== colon) {
    // the RFC specifies that a "mode=" value (octet or netascii) can
    // be specified after the colon, but we just throw it away since
    // the `tftp` module doesn't seem to care about this option
    pathname = pathname.substring(0, colon);
  }

  var rs = client.createGetStream(pathname, opts);
  fn(null, rs);
}
