// import mongoose to interacte to the db
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const authorSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
// });

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
    type: Date,
    required: false,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

module.exports = mongoose.model("Book", bookSchema);
