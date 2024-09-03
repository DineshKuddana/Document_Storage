const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

// Import the PdfModel
const PdfModel = require('./pdfSchema.js');

app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/PDF", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch((e) => console.log("Error connecting to MongoDB: ", e));

// Define storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API to upload files and data
app.post("/upload-files", upload.single('abstractFile'), async (req, res) => {
  const formData = {
    abstractTitle: req.body.abstractTitle,
    abstractFile: req.file.filename,
  };

  try {
    await PdfModel.create(formData);
    res.send({ status: "Ok" });
  } catch (error) {
    res.json({ status: error.message });
  }
});

// API to fetch all uploaded files
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfModel.find({});
    res.send({ status: "Ok", data });
  } catch (error) {
    res.json({ status: error.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server Started on port 5000");
});
