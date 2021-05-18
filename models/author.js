const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class Author {
  constructor(name) {
    this.name = name;
  }
}

module.exports = Author;
