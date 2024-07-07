const { readFileSync, writeFileSync } = require("node:fs");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/index", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(readFileSync("./index.json"));
});

app.get("/index-fancy", (req, res) => {
  /**
   * @type Record<String, {
   *  url: string,
   *  status: "on" | "off",
   *  ip: string,
   *  port: string
   * }>
   */
  const info = JSON.parse(readFileSync("./index.json"));

  var s = "";
  for (const key in info)
    s += `${key} | Status: ${info[key].status} | URL: ${info[key].url} | Connect: ${info[key].ip}:${info[key].port}`;

  res.send(s);
});

app.get("/", (_, res) =>
  res.send("Navigate to /index, /index-fancy, or /register.")
);

app.get("/register", (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.send(`Example request:
      {
        "ip": "104.236.1.247",
        "port": "8081",
        "status": "off",
        "url": "http://github.com/insyri/my-fake-repository.git"
      }`);
    return;
  }

  /**
   * @type Record<String, {
   *  url: string,
   *  status: "on" | "off",
   *  ip: string,
   *  port: string
   * }>
   */
  const info = JSON.parse(readFileSync("./index.json"));

  info[res.name] = {
    ip: res.ip,
    port: res.port,
    status: res.status,
    url: res.url,
  };

  writeFileSync("./index.json", JSON.stringify(info));
  res.send("done");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
