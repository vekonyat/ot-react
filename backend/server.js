const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { exec } = require("child_process");
// ...
// További Express konfiguráció
// ...

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
// Ezt a részt hozzáadod, hogy a 'myServer.js' szkriptedet el lehessen érni egy API végponton
app.post("/api/myEndpoint", (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const filename1 = req.body.filename1;
  const filename2 = req.body.filename2;
  console.log("Kapott adat:", filename1, filename2);

  const { exec } = require("child_process");

  // Indítsd el a myServer.js scriptet
  const child = exec(`node backend/mCat.js ${filename1} ${filename2}`);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    // Itt visszaküldheted a választ a kliensnek, ha szükséges
    res.send(`Merge process exited with code ${code}`);
  });
});

app.get("/api/getservices", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT sablonajanlat.tipus_id, szolgtipus.tipus_nev, sablonajanlat.sfajl_nev FROM sablonajanlat INNER JOIN szolgtipus ON sablonajanlat.tipus_id=szolgtipus.tipus_id"
    );
    
//console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/api/openfile", (req, res) => {
  const { filePath } = req.body;
  exec(`start winword "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Error opening file");
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send("File opened successfully");
  });
});

const port = process.env.PORT || 3001; // Választhatsz egy portot
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});

