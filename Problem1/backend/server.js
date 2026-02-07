const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbRoutes = require("./routes/db.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", dbRoutes);

app.get("/", (req, res) => {
  res.send("Database API running ");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
