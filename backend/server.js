const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { exec } = require("child_process");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const multer = require("multer");

const app = express();

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

// Ellenőrizzük, hogy létezik-e az uploads könyvtár
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}-${String(
      now.getMinutes()
    ).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
    const formattedDateTime = `${formattedDate}_${formattedTime}`;
    cb(null, `${formattedDateTime}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(`File uploaded: ${uploadsDir}`);
console.log(req.body);

const { radio, date, valid, am, ugyfel, params } = req.body;
console.log(radio, date, valid, am, ugyfel, params);


  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded: ${req.file.path}`);
});

app.post("/api/compsDownload", (req, res) => {
  if (!req.body || !Array.isArray(req.body.rightBlokkok)) {
    return res.status(400).send("Request body should be an object containing an array named 'rightBlokkok'");
  }
  const { rightBlokkok, amName, mobil, email, ugyfel } = req.body;
  const fileNames = rightBlokkok.map((fileData) => fileData.rel_path);
  const filePaths = fileNames.join(" ");

  exec(`node ./backend/mCat.js ${filePaths}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Merge process exited with error: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
 
    const filePath = "/private/temp/output.docx";
    try {
      const tempFilePath = processFile(
        filePath,
        amName,
        mobil,
        email,
        ugyfel
      );
      res.download(tempFilePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(500).send("Error downloading file");
        } else {
        //  Fájl törlése letöltés után
          fs.unlink(tempFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error deleting file: ${unlinkErr}`);
            } else {
              console.log(`Temp file ${tempFilePath} deleted.`);
            }
          });
        }
      });
    } catch (err) {
      res.status(500).send("Error processing file");
    }
  //  const outputPath = path.join(__dirname, "/private/temp/output.docx");
  //  const relativePath = path.relative(__dirname, outputPath);
  //  res.json({ filePath: relativePath });
  });
});

app.get("/api/getservices", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sablonajanlat INNER JOIN szolgtipus ON sablonajanlat.tipus_id=szolgtipus.tipus_id"
    //  "SELECT sablonajanlat.tipus_id, szolgtipus.tipus_nev, sablonajanlat.f_fajl_nev, sablonajanlat.b_fajl_nev, sablonajanlat.t_fajl_nev FROM sablonajanlat INNER JOIN szolgtipus ON sablonajanlat.tipus_id=szolgtipus.tipus_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/api/getservicetypes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT szolgtipus.tipus_id, szolgtipus.tipus_nev FROM szolgtipus"
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

// Fájl feldolgozó funkció
const maganHangzok = [
  "a", "á", "e", "é", "i", "í", "o", "ó", "ö", "ő", "u", "ú", "ü", "ű",
];

function processFile(filePath, amName, mobil, email, ugyfel) {
  const tempDir = path.join(__dirname, "private/temp");
  const fileName = path.basename(filePath);
  const originalFilePath = path.join(__dirname, filePath);
  const tempFilePath = path.join(tempDir, fileName);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    fs.copyFileSync(originalFilePath, tempFilePath);

    const content = fs.readFileSync(tempFilePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const textToReplace = "ugyfelmenedzser";
    let replacementText = amName || "";
    const mobilToReplace = "mobil";
    let replacementMobil = mobil || "";
    const emailToReplace = "email";
    let replacementEmail = email || "";
    const ugyfelToReplace = "z xy cég";
    let replacementUgyfel = "";

    if (ugyfel) {
      const elsoBetu = ugyfel.charAt(0).toLowerCase();
      replacementUgyfel = (maganHangzok.includes(elsoBetu) ? "z " : " ") + ugyfel;
    }

    const data = {
      [textToReplace]: replacementText,
      [mobilToReplace]: replacementMobil,
      [emailToReplace]: replacementEmail,
      [ugyfelToReplace]: replacementUgyfel,
    };

    doc.setData(data);
    doc.render();

    const buf = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(tempFilePath, buf);

    return tempFilePath;
  } catch (err) {
    console.error(`Error processing file: ${err}`);
    throw new Error("Error processing file");
  }
}

app.post("/api/download", async (req, res) => {
  const { filePath, amName, mobil, email, ugyfel } = req.body;

  try {
    const tempFilePath = processFile(filePath, amName, mobil, email, ugyfel);
    res.download(tempFilePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Error downloading file");
      } else {
        // Fájl törlése letöltés után
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting file: ${unlinkErr}`);
          } else {
            console.log(`Temp file ${tempFilePath} deleted.`);
          }
        });
      }
    });
  } catch (err) {
    res.status(500).send("Error processing file");
  }
});

app.get("/api/download", (req, res) => {
  const filePath = path.join(__dirname, req.query.filePath);
  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});
