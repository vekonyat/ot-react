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

app.post("/api/myEndpoint", (req, res) => {
  const filename1 = req.body.filename1;
  const filename2 = req.body.filename2;
  console.log("Kapott adat:", filename1, filename2);

  const child = exec(`node mCat.js ${filename1} ${filename2}`);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.send(`Merge process exited with code ${code}`);
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

app.post("/api/download", async (req, res) => {
  const maganHangzok = ["a", "á", "e", "é", "i", "í", "o", "ó", "ö", "ő", "u", "ú", "ü", "ű"]
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
    let elsoBetu = (ugyfel.charAt(0)).toLowerCase();
    if (maganHangzok.includes(elsoBetu)) {
    replacementUgyfel = "z " + ugyfel;
    } else {
    replacementUgyfel = " " + ugyfel;
    }}

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

    // Ellenőrizzük a módosított fájl tartalmát
   // const modifiedContent = fs.readFileSync(tempFilePath, "utf8");
    //console.log("Modified file content:", modifiedContent);

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
  let filePath = req.query.filePath;
  filePath = path.join(__dirname, filePath);
  res.download(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      res.status(500).send("Error downloading file");
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});
