const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { exec } = require("child_process");

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
    const result = await pool.query(
      "SELECT * FROM am ORDER BY nev"
    );
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
