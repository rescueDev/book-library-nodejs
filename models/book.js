// import getDb to interacte to the db

const getDb = require("../utils/database").getDb;
const mongodb = require("mongodb");

class Book {
  constructor(
    title,
    description,
    publishDate,
    pageCount,
    createdAt,
    // coverImage,
    author
  ) {
    this.title = title;
    this.description = description;
    this.publishDate = publishDate;
    this.pageCount = pageCount;
    this.createdAt = createdAt;
    // this.coverImage = coverImage;
    this.author = author;
  }

  save() {
    const db = getDb();
    return db
      .collection("books")
      .insertOne(this)
      .then((book) => {
        console.log(book);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("books")
      .find()
      .toArray()
      .then((books) => {
        console.log(books);
        return books;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Book;
