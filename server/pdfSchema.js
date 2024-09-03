// pdfSchema.js
const mongoose = require('mongoose');

const PdfDetailsSchema = new mongoose.Schema({
  abstractTitle: String,
  abstractFile: String,
}, { collection: "PdfDetails" });

const PdfModel = mongoose.model("PdfDetails", PdfDetailsSchema);

module.exports = PdfModel;
