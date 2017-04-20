var fs = require('fs');
var path = require('path');

var isUtf8 = function(bytes) {
  var i = 0;
  while (i < bytes.length) {
    if (
      // ASCII
      bytes[i] == 0x09 ||
      bytes[i] == 0x0a ||
      bytes[i] == 0x0d ||
      (0x20 <= bytes[i] && bytes[i] <= 0x7e)
    ) {
      i += 1;
      continue;
    }

    if (
      // non-overlong 2-byte
      0xc2 <= bytes[i] &&
      bytes[i] <= 0xdf &&
      (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xbf)
    ) {
      i += 2;
      continue;
    }

    if (
      // excluding overlongs
      (bytes[i] == 0xe0 &&
        (0xa0 <= bytes[i + 1] && bytes[i + 1] <= 0xbf) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf)) || // straight 3-byte
      (((0xe1 <= bytes[i] && bytes[i] <= 0xec) ||
        bytes[i] == 0xee ||
        bytes[i] == 0xef) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xbf) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf)) || // excluding surrogates
      (bytes[i] == 0xed &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9f) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf))
    ) {
      i += 3;
      continue;
    }

    if (
      // planes 1-3
      (bytes[i] == 0xf0 &&
        (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xbf) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xbf)) || // planes 4-15
      (0xf1 <= bytes[i] &&
        bytes[i] <= 0xf3 &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xbf) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xbf)) || // plane 16
      (bytes[i] == 0xf4 &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8f) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xbf) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xbf))
    ) {
      i += 4;
      continue;
    }

    return false;
  }

  return true;
};

var saveFile = function(input) {
  if (!input) {
    console.error('Expected a filename');
    process.exit(1);
  }

  if (input) {
    fs.readFile(input, function(err, buf) {
      if (err) throw err;

      if (!Buffer.isBuffer(buf)) {
        return console.log('Got no buffer!');
      }
      if (!isUtf8(buf)) {
        return console.log('File ' + input + ' is not in UTF-8 encoding!');
      }
      if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf)
        return console.log('File %s already has BOM markers!', input);

      fs.writeFile(input, '\ufeff' + buf, function(err) {
        if (err) throw err;
        else console.log('BOM was appended to %s', input);
      });
    });
  }
};

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(__dirname + '\\platforms\\windows\\www', function(err, results) {
  if (err) throw err;

  results.forEach(saveFile);
});
