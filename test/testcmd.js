var assert, async, child_process, exec, existsSync, fs, html2jade, path, testFile, options, atob;

assert = require('assert');
fs = require('fs');
path = require('path');
Parser = require('../js/index.js');
HTML2JADE = require('../js/html2jade.js');
child_process = require('child_process');
async = require('async');
atob = require('atob');

options = {
  inputDir: './mock/',
  expectedDir: './mock/',
  outputDir: '../temp/',
  compExt: '.jade',
  specExt: ['.html', '.htm'],
  charSet: 'utf-8',
  cwd: __dirname,
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

html2jade = function(inputFile, outputDir, cb, options) {

  var child, cmd, options;
  cmd = "node ../js/html2jade.js " + inputFile + " -o " + outputDir;

  var tempFile = fs.readFileSync(inputFile, options.charSet).toString();

  HTML2JADE.convertHtml(tempFile.trim(), options.converter, function(err, jade) {
    var basename = path.basename(inputFile, path.extname(inputFile));
    outputFile = path.join(outputDir, basename + options.compExt);

    fs.writeFile(outputFile, jade.jade.trim(), function(err) {
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


testFile = function(inputFile, expectedFile, outputDir, fileDone, options) {
  var basename, outputFile;
  basename = path.basename(inputFile, path.extname(inputFile));

  outputFile = path.join(outputDir, basename + options.compExt);  

  return html2jade(inputFile, outputDir, function(err) {
    var actual, expected;
    if (!err) {
      actual = fs.readFileSync(outputFile, options.charSet);
      expected = fs.readFileSync(expectedFile, options.charSet);
      assert.equal(actual, expected);
    }

    return fileDone(err);
  }, options);
};

describe("html2jade", function() {
  var testDir;
  testDir = function(inputDir, expectedDir, outputDir, options) {
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
          return testFile(inputFile, expectedFile, outputDir, done, options);
        });
      }
    });
  };

  return testDir(options.inputDir, options.expectedDir, options.outputDir, options);
});


describe("StaticHTMLParser", function() {

    
    it('should decode encoded base64 string', function() {
        
        //actual = '<img class="hero-image" src="http://sonyglobal.scene7.com/is/image/gwtprod/7b4a4b5486eaa7dcbb884d74f209605a?fmt=pjpeg&wid=1664&qlt=43" alt="image Alt Text 1" />';
        //expected = Parser["StaticHtmlParser"].decodeOutput("PGltZyBjbGFzcz0iaGVyby1pbWFnZSIgc3JjPSdodHRwOi8vc29ueWdsb2JhbC5zY2VuZTcuY29tL2lzL2ltYWdlL2d3dHByb2QvN2I0YTRiNTQ4NmVhYTdkY2JiODg0ZDc0ZjIwOTYwNWE/Zm10PXBqcGVnJndpZD0xNjY0JnFsdD00MycgYWx0PSdpbWFnZSBBbHQgVGV4dCAxJyAvPg==")

        //assert.equal(actual, expected);
    });
});



