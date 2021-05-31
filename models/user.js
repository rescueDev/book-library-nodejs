// import mongoose to interacte to the db
const mongoose = require("mongoose");
const Book = require("./book");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

UserSchema.methods.addToCart = function (book) {
  const cartProductIndex = this.cart.items.findIndex((cb) => {
    return cb.bookId.toString() === book._id.toString();
  });
  console.log(book);
  console.log("cart product index", cartProductIndex);
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  //if book  already in cart
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    //if book not already in cart
    updatedCartItems.push({
      bookId: book._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

UserSchema.methods.removeFromCart = function (book) {
  const updatedCart = this.cart.items.filter((cb) => {
    return cb.bookId.toString() !== book._id.toString();
  });
  this.cart.items = updatedCart;
  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
