const DocxMerger = require("docx-merger");
const fs = require("fs");
const path = require("path");

// Getting the file arguments from the command line
const fileArgs = process.argv.slice(2);
console.log("kapott adat:", fileArgs);

if (fileArgs.length < 1) {
  console.error("At least one input file must be provided.");
  process.exit(1);
}

// Reading the files
const files = fileArgs.map((filePath) =>
  fs.readFileSync(path.resolve(__dirname, filePath), "binary")
);

// Merging the files
const docx = new DocxMerger({}, files);

// Saving the merged file
docx.save("nodebuffer", (data) => {
  const outputPath = path.resolve(__dirname, 'private', 'temp', 'output.docx');
  fs.writeFile(outputPath, data, (err) => {
    if (err) {
      console.error("Error saving the file:", err);
      process.exit(1);
    } else {
      console.log("File saved successfully!");
      console.log(outputPath);
      process.exit(0);
    }
  });
});
