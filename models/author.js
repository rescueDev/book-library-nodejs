const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class Author {
  constructor(name, id) {
    this.name = name;
    this._id = id;
  }
  save(name) {
    const db = getDb();
    return db
      .collection("authors")
      .find({ name: name })
      .next()
      .then((author) => {
        console.log("author to save", author);
        if (!author) {
          console.log("author does not exists");

          return db.collection("authors").insertOne(this);
          // return author;
        }
        return author;
      })
      .catch((err) => console.log(err));
  }

  checkCollection() {
    const db = getDb();
    db.listCollections({ name: "authors" }).next(function (err, collinfo) {
      if (collinfo) {
        // The collection exists
      }
    });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("authors")
      .find()
      .toArray()
      .then((authors) => {
        console.log("authors", authors);
        return authors;
      })
      .catch((err) => console.log(err));
  }
  static findById(id) {
    const db = getDb();
    return db
      .collection("authors")
      .find({ _id: id })
      .next()
      .then((author) => {
        console.log("finded by id", author);
        return author;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Author;
