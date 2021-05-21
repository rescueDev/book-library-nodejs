const mongoose = require("mongoose");
const Book = require("./book");
const Schema = mongoose.Schema;
const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
});

module.exports = mongoose.model("Author", authorSchema);
