require("dotenv").config();
require("pg");
const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(`/${process.env.UPLOAD_PATH}`, express.static(process.env.UPLOAD_PATH));

app.use("/api/v1/", router);

app.get("/", (req, res) => {
  res.send("Welcome to Superindo API");
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on http://localhost:${process.env.PORT}!`)
);
