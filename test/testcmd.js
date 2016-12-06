var assert, async, child_process, exec, existsSync, fs, html2jade, path, testFile, options;

assert = require('assert');
fs = require('fs');
path = require('path');
HTML2JADE = require('../js/html2jade.js');
child_process = require('child_process');
async = require('async');

options = {
  inputDir: './data/',
  expectedDir: './data/',
  outputDir: '../temp/',
  compExt: '.jade',
  specExt: ['.html', '.htm'],
  charset: 'utf-8',
  converter: {
    selectById: true,
    bodyless: true,
    wrapper: true,
    wrapLength: 1000,
    donotencode: true
  }
}

exec = child_process.exec;

existsSync = fs.existsSync || path.existsSync;

html2jade = function(inputFile, outputDir, cb) {
  var child, cmd, options;
  cmd = "node ../js/html2jade.js " + inputFile + " -o " + outputDir;
  options = {
    cwd: __dirname
  };

  var tempFile = fs.readFileSync(inputFile, options.charset).toString();

  HTML2JADE.convertHtml(tempFile.trim(), options.converter, function(err, jade) {
    var basename = path.basename(inputFile, path.extname(inputFile));
    outputFile = path.join(outputDir, basename + options.compExt);
    fs.writeFile(outputFile, jade.jade, function(err) {
      if (err)
        return console.log(err);
    });
  });

  return child = exec(cmd, options, function(err, stdout, stderr) {
    if (cb) {
      return cb(err);
    }
  });
};


testFile = function(inputFile, expectedFile, outputDir, fileDone) {
  var basename, outputFile;
  basename = path.basename(inputFile, path.extname(inputFile));

  outputFile = path.join(outputDir, basename + options.compExt);

  return html2jade(inputFile, outputDir, function(err) {
    var actual, expected;
    if (!err) {
      actual = fs.readFileSync(outputFile, options.charset);
      expected = fs.readFileSync(expectedFile, options.charset);
      assert.equal(actual, expected);
    }
    return fileDone(err);
  });
};

describe("html2jade", function() {
  var testDir;
  testDir = function(inputDir, expectedDir, outputDir) {
    var inputFiles;
    inputDir = path.resolve(__dirname, inputDir);
    expectedDir = path.resolve(__dirname, expectedDir);
    outputDir = path.resolve(__dirname, outputDir);
    if (!existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    inputFiles = fs.readdirSync(inputDir);
    return inputFiles.forEach(function(inputFile) {
      var basename, expectedFile, extname;
      extname = path.extname(inputFile);
      basename = path.basename(inputFile, extname);
      extname = extname.toLowerCase();
      if (extname === options.specExt[0] || extname === options.specExt[1]) {
        inputFile = path.join(inputDir, inputFile);
        expectedFile = path.join(expectedDir, basename + options.compExt);
        return it("should convert " + (path.basename(inputFile)) + " to output matching " + (path.basename(expectedFile)), function(done) {
          return testFile(inputFile, expectedFile, outputDir, done);
        });
      }
    });
  };

  return testDir(options.inputDir, options.expectedDir, options.outputDir);

});