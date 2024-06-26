const DocxMerger = require("docx-merger");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const filename1 = process.argv[2];
const filename2 = process.argv[3];

const file1Path = path.resolve(__dirname, `${filename1}.docx`);
const file2Path = path.resolve(__dirname, `${filename2}.docx`);

const file1 = fs.readFileSync(file1Path, "binary");
const file2 = fs.readFileSync(file2Path, "binary");

const docx = new DocxMerger({}, [file1, file2]);

docx.save("nodebuffer", (data) => {
  const outputPath = path.resolve(__dirname, "output.docx");
  fs.writeFile(outputPath, data, (err) => {
    if (err) {
      console.error("Error saving the file:", err);
    } else {
      console.log("File saved successfully!");
      // Nyisd meg a kész fájlt Wordben
      exec(`start winword "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }
  });
});
