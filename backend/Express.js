const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// ...
// További Express konfiguráció
// ...

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
  const child = exec(`node mCat.js ${filename1} ${filename2}`);

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
// ...
// További Express konfiguráció és alkalmazásindítás
// ...
const port = process.env.PORT || 3001; // Választhatsz egy portot
app.listen(port, () => {
  console.log(`Az Express alkalmazás fut a ${port} porton`);
});
