const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./auth");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
