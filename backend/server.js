const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const notesRoutes = require("./routes/noteRoutes")
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRoutes)
app.use("/api/notes", notesRoutes)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});