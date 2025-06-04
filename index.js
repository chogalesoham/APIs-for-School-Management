const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const schoolRoutes = require("./routes/schoolRoutes");

dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use("/api", schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
