var DocxMerger = require('docx-merger');

var fs = require('fs');
var path = require('path');
const filename1 = process.argv[2];
const filename2 = process.argv[3];
var file1 = fs
    .readFileSync(path.resolve(__dirname, `${filename1}.docx`), 'binary');

var file2 = fs
    .readFileSync(path.resolve(__dirname, `${filename2}.docx`), 'binary');

var docx = new DocxMerger({},[file1,file2]);



//SAVING THE DOCX FILE

docx.save('nodebuffer',function (data) {
    // fs.writeFile("output.zip", data, function(err){/*...*/});
    fs.writeFile("output.docx", data, function(err){/*...*/});
});