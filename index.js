const { execSync } = require("child_process");
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();

const ip = execSync(
  `ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`,
  { stdio: "pipe" }
)
  .toString()
  .trim();

execSync(`mkcert ${ip}`);

const caRoot = path.join(
  execSync("mkcert -CAROOT", { stdio: "pipe" }).toString().trim(),
  "rootCA.pem"
);

app.get("/", (req, res) => {
  res.send("Hello from http and https server");
});

http.createServer(app).listen(80, ip);
https
  .createServer(
    {
      key: fs.readFileSync(`${ip}-key.pem`),
      cert: fs.readFileSync(`${ip}.pem`),
      ca: fs.readFileSync(caRoot),
    },
    app
  )
  .listen(443, ip);

console.log("Server is listening on port 80 and 443");
console.log(`http://${ip} or https://${ip}`);
