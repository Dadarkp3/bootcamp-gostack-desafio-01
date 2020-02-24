const express = require("express");
const server = express();

server.get("/teste", (req, res) => {
  return res.json({
    message: "Olá mundo"
  });
});

server.listen(4000);
