const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { exec } = require("child_process");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const multer = require("multer");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "offertool",
  password: "123456",
  port: 5432,
});

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded: ${req.file.path}`);
});

app.post("/api/myEndpoint", (req, res) => {
  console.log("Kapott adat:", req.body);

  if (!req.body || !Array.isArray(req.body.rightBlokkok)) {
    return res
      .status(400)
      .send(
        "Request body should be an object containing an array named 'rightBlokkok'"
      );
  }

  const fileNames = req.body.rightBlokkok.map((fileData) => fileData.rel_path);
  const filePaths = fileNames.join(" ");

  exec(`node ./backend/mCat.js ${filePaths}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Merge process exited with error: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    const outputPath = path.join(__dirname, "output.docx"); // Absolute path to the file
    const relativePath = path.relative(__dirname, outputPath); // Get relative path for download endpoint
    res.json({ filePath: relativePath }); // Return the relative path
  });
});

app.get("/api/getservices", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT sablonajanlat.tipus_id, szolgtipus.tipus_nev, sablonajanlat.f_fajl_nev, sablonajanlat.b_fajl_nev, sablonajanlat.t_fajl_nev FROM sablonajanlat INNER JOIN szolgtipus ON sablonajanlat.tipus_id=szolgtipus.tipus_id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/getams", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM am ORDER BY nev");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/getugyfelek", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ugyfel ORDER BY cegnev");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/getcomps", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comps ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/api/download", async (req, res) => {
  const maganHangzok = [
    "a",
    "á",
    "e",
    "é",
    "i",
    "í",
    "o",
    "ó",
    "ö",
    "ő",
    "u",
    "ú",
    "ü",
    "ű",
  ];
  const { filePath, amName, mobil, email, ugyfel } = req.body; // AM név a request body-ból
  console.log("Received am:", amName, mobil, email, ugyfel);

  const tempDir = path.join(__dirname, "private/temp");

  // Kivonjuk a fájl nevét a filePath-ból
  const fileName = path.basename(filePath);

  // Az eredeti fájl teljes elérési útja
  const originalFilePath = path.join(__dirname, filePath);

  // Az ideiglenes fájl teljes elérési útja
  const tempFilePath = path.join(tempDir, fileName);

  // Győződjünk meg róla, hogy a temp könyvtár létezik
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    // Eredeti fájl másolása a temp könyvtárba
    fs.copyFileSync(originalFilePath, tempFilePath);

    const content = fs.readFileSync(tempFilePath, "binary");

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    // A cserélendő szöveg és az új szöveg
    const textToReplace = "ugyfelmenedzser";
    let replacementText;
    if (amName) replacementText = amName;

    const mobilToReplace = "mobil";
    let replacementMobil;
    if (mobil) replacementMobil = mobil;

    const emailToReplace = "email";
    let replacementEmail;
    if (email) replacementEmail = email;

    const ugyfelToReplace = "z xy cég";
    let replacementUgyfel;

    if (ugyfel) {
      let elsoBetu = ugyfel.charAt(0).toLowerCase();
      if (maganHangzok.includes(elsoBetu)) {
        replacementUgyfel = "z " + ugyfel;
      } else {
        replacementUgyfel = " " + ugyfel;
      }
    }

    let data = {};
    if (replacementText) data[textToReplace] = replacementText;
    if (replacementMobil) data[mobilToReplace] = replacementMobil;
    if (replacementEmail) data[emailToReplace] = replacementEmail;
    if (replacementUgyfel) data[ugyfelToReplace] = replacementUgyfel;

    doc.setData(data);
    doc.render();

    const buf = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(tempFilePath, buf);
    console.log("Modified file written to temp directory.");

    res.download(tempFilePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (err) {
    console.error(`Error processing file: ${err}`);
    res.status(500).send("Error processing file");
  }
});

app.get("/api/download", (req, res) => {
  const filePath = path.join(__dirname, req.query.filePath);
  console.log(`Downloading file from: ${filePath}`);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send("File not found");
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});
