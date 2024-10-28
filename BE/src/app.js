const express = require("express");
const cors = require("cors");
const dataSensorRouter = require("./routes/dataSensor");

const app = express();

app.use(cors());
app.use(express.json());

// Đảm bảo route prefix đúng
app.use("/table/data", dataSensorRouter);

module.exports = app;
