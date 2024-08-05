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

app.post("/api/upload", upload.single("file"), async (req, res) => {
  // console.log(`File uploaded: ${uploadsDir}`);

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const { radio, date, valid, am, ugyfel, params } = req.body;
    const offerParams = JSON.parse(params);

    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO kiadott_ajanlat (tipus, am_id, datum, ervenyesseg, afajl_nev, ugyfel_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ajanlat_id",
      [radio, am, date, valid, req.file.filename, ugyfel]
    );

    const newAjanlatId = result.rows[0].ajanlat_id;
    let index = 0;
    let havidij = 0;
    let egyszeridij = 0;
    for (const param of offerParams) {
      await client.query(
        "INSERT INTO ajanlatresz (ajanlat_id, tipus_id, resz_id, futamido, havidij, egyszeridij) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          newAjanlatId,
          param.tipus_id,
          index,
          param.futamido,
          param.havidij,
          param.egyszeridij,
        ]
      );
      index++;
      havidij = havidij + parseInt(param.havidij);
      egyszeridij = egyszeridij + parseInt(param.egyszeridij);
    }

    await client.query(
      "UPDATE kiadott_ajanlat SET osszhavidij = $1, osszegyszeridij = $2 WHERE ajanlat_id = $3",
      [havidij, egyszeridij, newAjanlatId]
    );

    client.release();

    res.send(`File uploaded: ${req.file.path}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing file and data");
  }
});

app.post("/api/compsDownload", (req, res) => {
  if (!req.body || !Array.isArray(req.body.rightBlokkok)) {
    return res
      .status(400)
      .send(
        "Request body should be an object containing an array named 'rightBlokkok'"
      );
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
      const tempFilePath = processFile(filePath, amName, mobil, email, ugyfel);
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
      replacementUgyfel =
        (maganHangzok.includes(elsoBetu) ? "z " : " ") + ugyfel;
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

app.post("/api/statdownload", (req, res) => {
  const { filePath } = req.body;
  const fullFilePath = path.join(__dirname, filePath);
  if (fs.existsSync(fullFilePath)) {
    res.download(fullFilePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    res.status(404).send("File not found");
  }
});

app.post("/api/getstats", async (req, res) => {
  const { am, ugyfel, tipus, startDate, endDate } = req.body;
  try {
    let query = `
      SELECT afajl_nev, ajanlatresz.ajanlat_id, to_char(datum, 'YYYY-MM-DD') AS datum, am.nev, ugyfel.cegnev, szolgtipus.tipus_nev, ajanlatresz.havidij, ajanlatresz.egyszeridij 
      FROM kiadott_ajanlat
      INNER JOIN ugyfel on kiadott_ajanlat.ugyfel_id=ugyfel.ugyfel_id
      INNER JOIN am on kiadott_ajanlat.am_id=am.am_id
      INNER JOIN ajanlatresz on kiadott_ajanlat.ajanlat_id=ajanlatresz.ajanlat_id
      INNER JOIN szolgtipus on ajanlatresz.tipus_id=szolgtipus.tipus_id
      WHERE 1=1
    `;

    // Tároljuk a paramétereket egy tömbben
    const params = [];

    // Feltételek hozzáadása az adott paraméterek alapján
    if (am) {
      query += ` AND am.am_id = $${params.length + 1}`;
      params.push(am);
    }
    if (ugyfel) {
      query += ` AND ugyfel.ugyfel_id = $${params.length + 1}`;
      params.push(ugyfel);
    }
    if (tipus) {
      query += ` AND szolgtipus.tipus_id = $${params.length + 1}`;
      params.push(tipus);
    }
    if (startDate) {
      query += ` AND datum >= $${params.length + 1}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND datum <= $${params.length + 1}`;
      params.push(endDate);
    }

    const result = await pool.query(query, params);
    console.log(startDate, endDate, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});
