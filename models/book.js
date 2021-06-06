// import mongoose to interacte to the db
const mongoose = require("mongoose");
const Author = require("./author");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  publishDate: {
    type: String,
    required: false,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  price: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
  },
});

module.exports = mongoose.model("Book", bookSchema);
