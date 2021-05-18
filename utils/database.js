const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

const mongoConnect = (cb) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5vg5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      cb(client);
    })
    .catch((err) => console.log(err));
};

//check if db is connected
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
