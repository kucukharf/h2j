var assert, async, child_process, exec, existsSync, fs, html2jade, path, testFile;

assert = require('assert');

fs = require('fs');

path = require('path');

HTML2JADE = require('../js/html2jade.js');



child_process = require('child_process');

async = require('async');

exec = child_process.exec;
var joptions = {
  selectById: true,
  bodyless: true,
  wrapper: true,
  wrapLength: 1000,
  donotencode: true
};

existsSync = fs.existsSync || path.existsSync;

html2jade = function(inputFile, outputDir, cb) {
  var child, cmd, options;
  cmd = "node ../js/html2jade.js " + inputFile + " -o " + outputDir;
  options = {
    cwd: __dirname
  };

  var tempFile = fs.readFileSync(inputFile, 'utf8').toString();
  
  HTML2JADE.convertHtml(tempFile.trim(), joptions, function(err, jade) {
    var basename = path.basename(inputFile, path.extname(inputFile));
    outputFile = path.join(outputDir, basename + ".jade");
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

  outputFile = path.join(outputDir, basename + ".jade");

  return html2jade(inputFile, outputDir, function(err) {
    var actual, expected;
    if (!err) {
      actual = fs.readFileSync(outputFile, 'utf8');
      expected = fs.readFileSync(expectedFile, 'utf8');
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
      if (extname === '.html' || extname === '.htm') {
        inputFile = path.join(inputDir, inputFile);
        expectedFile = path.join(expectedDir, basename + ".jade");
        return it("should convert " + (path.basename(inputFile)) + " to output matching " + (path.basename(expectedFile)), function(done) {
          return testFile(inputFile, expectedFile, outputDir, done);
        });
      }
    });
  };
  return testDir("./data/", "./data/", "../temp/");
});