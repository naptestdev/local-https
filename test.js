const express = require("express");
const http = require("http");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(
    "/Users/phong-nguyen/Library/Application Support/mkcert/rootCA.pem"
  );
});

http.createServer(app).listen(80, "192.168.1.49");
